# CodeArena

Short instructions to run and build the React frontend and Express backend.

## Development (start)

These commands run the React dev server (Vite) and the Express backend in development mode.

1. Install dependencies for both packages (run from project root):

```bash
npm install --prefix frontend
npm install --prefix backend
```

2. Start the frontend dev server (Vite):

```bash
npm run dev --prefix frontend
```

3. Start the backend in development (uses nodemon):

```bash
npm run dev --prefix backend
```

You can open the frontend at the address Vite prints (usually http://localhost:5173) and the backend at the configured `PORT` (see backend `.env`).

## Build (production)

These steps build the frontend and start the backend which serves the built frontend in production mode.

1. Build the project (from project root):

```bash
# This will install dependencies in frontend & backend and build the frontend
npm run build
```

Note: The root `build` script runs `npm install --prefix frontend` and `npm install --prefix backend` and then `npm run build --prefix frontend`.

2. Start the backend (production):

```bash
# From project root — this runs the backend start script
npm run start
```

Or run directly in the backend folder:

```bash
npm run start --prefix backend
```

Ensure you have a backend `.env` with at least the `PORT` (and set `NODE_ENV=production` when appropriate). The backend server is configured to serve static files from the built frontend (`frontend/dist`) when `NODE_ENV === "production"`.

## Preview frontend build locally

If you only want to preview the built frontend without starting the backend, use Vite's preview command:

```bash
npm run preview --prefix frontend
```

## Notes & troubleshooting

- If ports conflict, change `PORT` in the backend `.env` or the Vite dev server port in `frontend` config.
- If you don't see the built frontend served by the backend, verify the `frontend/dist` directory exists after `npm run build` and that `NODE_ENV` is set to `production` for the backend.
- For development you may run the frontend and backend concurrently using a process manager (e.g. `concurrently`) — this project does not include that by default.

---

If you'd like, I can also add a small npm script to start both dev servers concurrently (e.g., using `concurrently`) and/or add a sample `.env.example` for the backend.

## Auth sync: Clerk -> Inngest -> MongoDB

This project uses Clerk for auth on the frontend and Inngest on the backend to process auth-related events from Clerk (for example, when a user is created or deleted). The backend's Inngest functions sync user data into MongoDB via the `User` model.

High level flow

1. A user signs up or is deleted in Clerk (frontend or Clerk dashboard).
2. Clerk emits an event (for example, `clerk/user.created` or `clerk/user.deleted`).
3. The event is sent to your backend's Inngest endpoint exposed at `/api/inngest` (this project mounts Inngest middleware at that path).
4. Inngest receives the event and triggers the appropriate function defined in `backend/src/lib/inngest.js`:
	 - `sync-user` (on `clerk/user.created`) — extracts user fields from the event and creates a `User` document in MongoDB.
	 - `delete-user` (on `clerk/user.deleted`) — removes the corresponding `User` document by `clerkId`.
5. The Inngest functions call `connectDB()` to ensure there is a MongoDB connection before reading/writing data.

Where to look in the code

- `backend/src/lib/inngest.js` — defines the Inngest client and two functions:
	- `syncUser` — constructs a `newUser` object using fields from `event.data` (maps: `id` -> `clerkId`, `email_addresses[0].email_address` -> `email`, `first_name`/`last_name` -> `name`, `image_url` -> `profileImage`) and calls `User.create(newUser)`.
	- `deleteUserFromDB` — deletes the user document with the matching `clerkId`.
- `backend/src/models/User.js` — Mongoose schema. Note that `email` and `clerkId` are unique and required.
- `backend/src/lib/db.js` — `connectDB()` throws/exists the process if `DB_URL` is missing or the connection fails (the Inngest functions call this before using the DB).
- `backend/src/server.js` — mounts the Inngest route at `/api/inngest` using `serve({ client: inngest, functions })`.

Environment variables and setup notes

- `DB_URL` (backend) — required. The Inngest functions call `connectDB()` and the server will exit if `DB_URL` is not set or the DB connection fails. Provide a working MongoDB connection string (Atlas or self-hosted).
- `PORT` (backend) — port the Express server listens on.
- `NODE_ENV` — set to `production` for the backend to serve the built frontend.
- `CLIENT_URL` — used by the backend CORS configuration (`ENV.CLIENT_URL`) so the frontend origin can make requests to the API. Make sure this is set if you use CORS origin checks.
- `VITE_CLERK_PUBLISHABLE_KEY` (frontend) — frontend Clerk key (starts with `VITE_` so Vite exposes it to the browser).

Configuring Clerk & Inngest

- In Clerk dashboard, configure event webhooks (or event subscriptions) to send `user.created` and `user.deleted` events to your backend. Point the receiver URL at `https://<your-domain>/api/inngest` (or `http://localhost:5000/api/inngest` during local testing). The exact webhook configuration in Clerk depends on Clerk's UI — create a webhook or subscription that posts the relevant events to your backend.
- If you use Inngest's hosted product or signing verification, ensure you pass any required secrets or signing keys to the server (this project currently mounts the Inngest `serve` middleware directly; if you enable signing verification, configure the middleware accordingly).

Troubleshooting

- If users are not created in the DB:
	- Verify that Clerk is sending events to `/api/inngest` and that your backend is reachable from Clerk.
	- Check backend logs for errors (connection errors, validation errors from Mongoose, or unhandled exceptions in the Inngest functions).
	- Confirm `DB_URL` is set and reachable from the environment where the backend runs.
	- The Inngest functions call `connectDB()` internally, so check those logs specifically.

- If inserts fail due to duplicates, remember `email` and `clerkId` are unique in the `User` schema — either adjust your data or modify the schema/logic if necessary.

Local testing tips

- You can test the flow locally by running the backend (`npm run dev --prefix backend`) and sending a sample HTTP POST with the Clerk event shape to `http://localhost:<PORT>/api/inngest` (or use Clerk's dashboard to send a test webhook). Check backend logs and the `users` collection in MongoDB to confirm records.
- Use the `/health` endpoint to verify the server is running: `GET /health` returns 200 with JSON `{msg: "success from api"}`.

If you'd like, I can add `backend/.env.example` and `frontend/.env.example` files and/or a short script that posts a sample `clerk/user.created` payload to `/api/inngest` for local testing.

## Stream Chat integration

This project integrates Stream Chat to manage user objects in the chat service alongside the main MongoDB `User` documents. The helper functions live in `backend/src/lib/stream.js` and are invoked from the Inngest functions in `backend/src/lib/inngest.js` whenever a Clerk user is created or deleted.

What the code does

- `backend/src/lib/stream.js`
	- Initializes a Stream client with `StreamChat.getInstance(apiKey, apiSecret)` using `ENV.STREAM_API_KEY` and `ENV.STREAM_API_SECRET`.
	- `upsertStreamUser(userData)` — calls `chatClient.upsertUser(userData)` to create or update a Stream user. It expects an object with at least `id`, and optionally `name`, `image`, etc.
	- `deleteStreamUser(userId)` — calls `chatClient.deleteUser(userId)` to remove a user from Stream.

- `backend/src/lib/inngest.js` calls `upsertStreamUser` after inserting a new `User` in MongoDB and `deleteStreamUser` when deleting a user.

Environment variables required for Stream

- `STREAM_API_KEY` — the Stream API key.
- `STREAM_API_SECRET` — the Stream API secret. Keep this secret; do not commit it.

Where Stream integration is used

- When a Clerk `user.created` event is received, Inngest's `sync-user` function:
	1. Connects to MongoDB and creates a `User` document.
	2. Calls `upsertStreamUser` with `{ id: clerkId, name, image }` to ensure the user exists in Stream.
- When a Clerk `user.deleted` event is received, Inngest's `delete-user` function deletes the MongoDB user and calls `deleteStreamUser` to remove the Stream user.

Testing and troubleshooting Stream integration

- Verify `STREAM_API_KEY` and `STREAM_API_SECRET` are set in `backend/.env` and that they are valid for your Stream app.
- Watch backend logs for messages from `stream.js` (it logs success/failure for upsert/delete operations).
- If `chatClient` initialization fails, the file logs an error: `Stream_API_key OR Stream_API_SECRET is missing`.
- If user upserts/deletes silently fail, try calling the Stream client directly in a small script or Node REPL using the same env values to isolate credential/network issues.

Token generation note (TODO)

- Chat applications typically need a server endpoint to issue Stream user tokens to clients (for authenticated access). `stream.js` currently includes upsert and delete helpers but does not expose a token generation endpoint. Consider adding a secure endpoint such as `POST /api/stream/token` that:
	1. Verifies the user (for example via Clerk session or other auth middleware).
	2. Uses the Stream server secret to create a user token and returns it to the client.

If you want, I can implement the token endpoint and a minimal client example that requests and uses the token in the frontend.


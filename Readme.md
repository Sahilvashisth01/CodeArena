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


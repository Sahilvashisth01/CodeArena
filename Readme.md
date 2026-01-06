# CodeArena

Short instructions to run and build the React frontend and Express backend.

## Development (start)

These commands run the React dev server (Vite) and the Express backend in development mode.

````markdown
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

	- `syncUser` — constructs a `newUser` object using fields from `event.data` (maps: `id` -> `clerkId`, `email_addresses[0].email_address` -> `email`, `first_name`/`last_name` -> `name`, `image_url` -> `profileImage`) and calls `User.create(newUser)`.
	- `deleteUserFromDB` — deletes the user document with the matching `clerkId`.

Environment variables and setup notes


Configuring Clerk & Inngest


Troubleshooting

	- Verify that Clerk is sending events to `/api/inngest` and that your backend is reachable from Clerk.
	- Check backend logs for errors (connection errors, validation errors from Mongoose, or unhandled exceptions in the Inngest functions).
	- Confirm `DB_URL` is set and reachable from the environment where the backend runs.
	- The Inngest functions call `connectDB()` internally, so check those logs specifically.


Local testing tips


If you'd like, I can add `backend/.env.example` and `frontend/.env.example` files and/or a short script that posts a sample `clerk/user.created` payload to `/api/inngest` for local testing.

## Stream Chat integration

This project integrates Stream Chat to manage user objects in the chat service alongside the main MongoDB `User` documents. The helper functions live in `backend/src/lib/stream.js` and are invoked from the Inngest functions in `backend/src/lib/inngest.js` whenever a Clerk user is created or deleted.

What the code does

	- Initializes a Stream client with `StreamChat.getInstance(apiKey, apiSecret)` using `ENV.STREAM_API_KEY` and `ENV.STREAM_API_SECRET`.
	- `upsertStreamUser(userData)` — calls `chatClient.upsertUser(userData)` to create or update a Stream user. It expects an object with at least `id`, and optionally `name`, `image`, etc.
	- `deleteStreamUser(userId)` — calls `chatClient.deleteUser(userId)` to remove a user from Stream.


Environment variables required for Stream


Where Stream integration is used

	1. Connects to MongoDB and creates a `User` document.
	2. Calls `upsertStreamUser` with `{ id: clerkId, name, image }` to ensure the user exists in Stream.

Testing and troubleshooting Stream integration


Token generation note (TODO)

	1. Verifies the user (for example via Clerk session or other auth middleware).
	2. Uses the Stream server secret to create a user token and returns it to the client.

If you want, I can implement the token endpoint and a minimal client example that requests and uses the token in the frontend.

## Clerk middleware, protectRoute, chatRoutes, and getStreamToken

This project uses Clerk for authentication and exposes a protected chat token endpoint so authenticated frontend users can get Stream tokens. Below is a concise explanation of how the pieces fit together and how to call the endpoint during development.

Files to inspect

	1. Reads the Clerk user id via `req.auth().userId`.
	2. Looks up the corresponding user record in MongoDB using `User.findOne({ clerkId })`.
	3. Attaches the found `user` document to `req.user` for downstream handlers.
	4. Returns a 401 when not authenticated or if the user is not found.
	- `token` — the Stream user token
	- `userId` — the Clerk id (used as Stream id)
	- `userName` and `userImage` — convenience info from the DB user doc

How the flow works (runtime)

1. Browser frontend authenticates the user via Clerk and holds a Clerk session (cookie or token).
2. Frontend calls `GET /api/chat/token` (on same origin or using correct `CLIENT_URL`) with credentials (cookies) included.
3. `clerkMiddleware()` and `requireAuth()` validate the request/session with Clerk.
4. `protectRoute` then finds the application `User` document using the Clerk user id.
5. `getStreamToken` uses the server Stream client (`chatClient`) to create a token for the Clerk id and returns it to the client.

Example frontend fetch (from an authenticated browser session):

```js
const res = await fetch('/api/chat/token', {
	method: 'GET',
	credentials: 'include', // important so Clerk session cookie is sent
});
if (!res.ok) throw new Error('Failed to get token');
const body = await res.json();
// body.token, body.userId, body.userName
```

Auth and CORS notes


Common errors and how to debug

	- The Clerk session is missing or invalid. Confirm the frontend is logged in and requests include credentials (cookies or authorization header as configured).
	- The middleware may also return 401 if the user isn't found in the `users` collection — ensure the Clerk user was synced to the DB (via Inngest or manual insert).
	- Check backend logs for errors from `chatClient.createToken` or `req.user` being undefined.
	- Ensure `STREAM_API_KEY` and `STREAM_API_SECRET` are set and valid.

Local testing checklist

1. Run MongoDB (or ensure Atlas connection) and set `DB_URL`.
2. Start backend: `npm run dev --prefix backend`.
3. Start frontend and sign in a user with Clerk.
4. After sign-up, ensure the user exists in MongoDB (Inngest should have created it, or create it manually for testing).
5. From the authenticated browser, call `/api/chat/token` and verify you get a token in the response.






**Session Endpoints**
- **Base path:** `/api/sessions` (mounted in `backend/src/server.js`). All routes below are protected and require a logged-in user via Clerk + `protectRoute`.
- **POST /**: Create a session
  - **Request body:** `{ problem: string, difficulty: "easy"|"medium"|"hard" }`
  - **Behavior:** Creates a `Session` document (host = current user), generates a unique `callId`, creates a Stream video call and a Stream chat channel for the session.
  - **Responses:** `201` with `{ session }` on success, `400` when required fields missing, `500` on server error.
- **GET /active**: List active sessions
  - **Behavior:** Returns up to 20 sessions with `status: "active"`, populated host info.
  - **Responses:** `200` with `{ sessions }`, `500` on server error.
- **GET /my-recent**: Get my recent completed sessions
  - **Behavior:** Returns up to 20 sessions where the current user is host or participant and `status: "completed"`.
  - **Responses:** `200` with `{ sessions }`, `500` on server error.
- **GET /:id**: Get session by id
  - **Behavior:** Returns session details including populated `host` and `participants` fields.
  - **Responses:** `200` with `{ session }`, `404` if not found, `500` on server error.
- **POST /:id/join**: Join a session
  - **Behavior:** Adds the current user as `participants` (if slot is free) and adds the user's Stream id to the session chat channel members.
  - **Responses:** `200` with `{ session }` on success, `400` if session already has a participant, `404` if session not found, `500` on server error.
- **GET /:id/end**: End a session (host only)
  - **Behavior:** Only the session `host` can call this. Marks session `status` = `completed`, deletes the Stream video call and deletes the Stream chat channel.
  - **Responses:** `200` with `{ session, msg }` on success, `403` if caller is not host, `400` if already completed, `404` if session not found, `500` on server error.

**Session Controller**
- **File:** `backend/src/controllers/sessionController.js`
- **Responsibilities:**
  - Create sessions: validate input, persist a `Session` document, generate a unique `callId`, create a Stream video call (via `streamClient.video.call(...).getOrCreate`) and a Stream chat channel (via `chatClient.channel(...).create`).
  - List active sessions: query `Session` for `status: "active"`, populate host and return latest 20.
  - List user's recent sessions: query completed sessions where the user is `host` or `participants`.
  - Fetch session by id: return session with populated host and participant info.
  - Join session: ensure session exists and has no participant, set `participants` to current user, and add the user to the Stream chat channel members.
  - End session: verify requester is the host, mark session `completed`, delete the Stream video call and the Stream chat channel.
- **Notes & caveats:**
  - The controller expects `req.user` to include `_id` and `clerkId` (provided by `protectRoute`).
  - Stream operations (video call creation/deletion and chat channel creation/deletion) are performed during controller actions and may fail separately from DB operations; check backend logs for Stream errors.
  - Responses use standard HTTP status codes to indicate validation (`400`), unauthorized/forbidden (`401`/`403`), not found (`404`), success (`200`/`201`), and server errors (`500`).

```





# Frontend: Tools & Functionality

This document summarizes frontend frameworks, libraries, and where they're used in the codebase.

1) Tailwind CSS + DaisyUI
- Purpose: Utility-first styling (Tailwind) with component themes (DaisyUI).
- Files:
  - Tailwind is configured and imported via `frontend/src/index.css` (`@import "tailwindcss"; @plugin "daisyui";`).
- Notes:
  - Use Tailwind utility classes directly in JSX; DaisyUI provides component class names (e.g. `btn`, `btn-primary`).
  - For production builds ensure Tailwind's content paths include `./src/**/*.{js,jsx}` so unused CSS is purged.

2) React Router
- Purpose: Client-side routing.
- Files:
  - `frontend/src/main.jsx` mounts `BrowserRouter`.
  - `frontend/src/App.jsx` defines routes using `Routes` and `Route` and redirects unauthenticated users with `<Navigate />`.
- Notes:
  - Protected routes: `App.jsx` uses Clerk's `useUser()` to check `isSignedIn` and conditionally renders protected pages (see `/problems` route).

3) Clerk Authentication
- Purpose: Authentication provider used across the app.
- Files:
  - `frontend/src/main.jsx` wraps the app with `ClerkProvider` using `VITE_CLERK_PUBLISHABLE_KEY`.
  - Components use `SignedIn`, `SignedOut`, `SignInButton`, `SignOutButton`, `UserButton`, `useUser` from `@clerk/clerk-react` (see `HomePage.jsx` and `App.jsx`).

4) React Hot Toast
- Purpose: Lightweight toast notifications.
- Files:
  - `frontend/src/App.jsx` adds the `<Toaster />` (global toasts) with a 3000ms default duration.
  - `frontend/src/pages/HomePage.jsx` demonstrates usage via `toast.success()`.

5) TanStack Query (react-query)
- Purpose: Server state caching, background refetching, and request deduplication.
- Files:
  - `frontend/src/main.jsx` initializes `QueryClient` and wraps the app in `QueryClientProvider`.
- Notes:
  - Use `useQuery` / `useMutation` in pages and hooks for data fetching and mutations.
  - Configure sensible `staleTime` and `cacheTime` per endpoint.

6) Axios instance
- Purpose: Centralized HTTP client configured with base URL and credentials.
- Files:
  - `frontend/src/lib/axios.js` exports an axios instance with `baseURL = import.meta.env.VITE_API_URL` and `withCredentials: true`.
- Notes:
  - `withCredentials: true` is required for Clerk session cookies to be sent to the backend.
  - Use the axios instance for all API calls to ensure consistent base URL and error handling.

Environment variables used by the frontend
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (required at startup).
- `VITE_API_URL` — API base URL consumed by the axios instance.

Quick run & build (frontend)
```bash
# install deps
npm install --prefix frontend
# dev server
npm run dev --prefix frontend
# build
npm run build --prefix frontend
```

Suggestions
- Add a small `frontend/src/hooks/useApi.js` to wrap axios + react-query calls for consistent error handling and token refresh logic if needed.
- Add `frontend/.env.example` listing `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL`.
# HomePage — Main things

Short reference for the HomePage component (frontend/src/pages/HomePage.jsx).

## Sections
- NAVBAR
  - Logo link ("/")
  - Clerk SignInButton opens modal (Get Started)
  - Uses SparklesIcon, ArrowRightIcon

- HERO
  - Left: headline, subcopy, feature pills, CTA buttons (SignInButton + Watch Demo)
  - Right: hero image (`/hero.png`)
  - Responsive two-column grid (lg:grid-cols-2)

- FEATURE GRID
  - 3 feature cards: HD Video Call, Live Code Editor, Easy Collaboration
  - Uses VideoIcon, Code2Icon, UsersIcon
  - Cards use DaisyUI `card` styling

- STATS
  - stats-vertical / lg:stats-horizontal containing Active Users, Sessions, Uptime

## Styling & Utilities
- Tailwind + DaisyUI utility classes throughout (examples: `bg-linear-to-br`, `badge`, `btn`, `card`, `stats`)
- Animations: `hover:scale-105`, `transition-transform`, `duration-500`
- Icons from `lucide-react`

## Auth / Behavior notes
- Sign-in buttons use `@clerk/clerk-react` SignInButton (mode="modal")
- HomePage is intended for unauthenticated users; authenticated users are redirected by App.jsx

## Assets
- Expects `/hero.png` in public/static assets

## Files of interest
- Component: frontend/src/pages/HomePage.jsx
- Docs: this file
- Styling: frontend/src/index.css (Tailwind + DaisyUI)
- Routing/auth check: frontend/src/App.jsx

## Quick dev notes
- If you change SignInButton usage, ensure Clerk provider & publishable key are configured in main.jsx
- For layout tweaks, adjust Tailwind classes directly in HomePage.jsx


# ProblemsPage — Main things

Short reference for the ProblemsPage component (frontend/src/pages/ProblemsPage.jsx).

## Purpose
List and browse practice problems, show per-difficulty counts, and link to individual problem pages.

## Main pieces
- Navbar — imported from `../components/Navbar`.
- Problems data — reads `PROBLEMS` from `../data/problems`.
- Utility — `getDifficultyBadgeClass` from `../lib/utils` to render difficulty badges.
- Icons — `Code2Icon`, `ChevronRightIcon` from `lucide-react`.

## Behavior
- Converts `PROBLEMS` object to an array: `const problems = Object.values(PROBLEMS)`.
- Computes counts:
  - easyProblemsCount = problems.filter(p => p.difficulty === "Easy").length
  - mediumProblemsCount, hardProblemsCount similar.
- Renders each problem as a clickable card linking to `/problem/:id`.
- Card shows: icon, title, difficulty badge, category, short description, and a "Solve" CTA.

## Styling & UI
- Uses Tailwind + DaisyUI classes: `card`, `badge`, `stats`, etc.
- Hover transform: `hover:scale-[1.01]`, `transition-transform`.
- Responsive layout via container widths (`max-w-6xl`) and spacing utilities.

## Expected PROBLEMS shape (example)
{
  id: "two-sum",
  title: "Two Sum",
  difficulty: "Easy" | "Medium" | "Hard",
  category: "Array",
  description: { text: "short description..." },
  // other fields...
}

## Notes / To-dos
- Consider adding client-side filtering / search.
- Ensure routing has a Route for `/problem/:id`.
- If using remote data later, replace `PROBLEMS` import with a fetch / react-query hook and show loading/error states.






# ProblemPage — Main things

Short reference for the ProblemPage component (frontend/src/pages/ProblemPage.jsx).

## Purpose
Render a full problem workspace: problem description, code editor, and output. Run user code via the Piston API and validate output against expected results.

## Layout / Components
- Navbar — `../components/Navbar`
- Panel layout — `react-resizable-panels` (PanelGroup, Panel, PanelResizeHandle)
- ProblemDescription — left panel (`../components/ProblemDescription`)
- CodeEditorPanel — top-right panel (`../components/CodeEditorPanel`)
- OutputPanel — bottom-right panel (`../components/OutputPanel`)


- confetti — `canvas-confetti` (celebration on success)

## Key state
- currentProblemId (string) — active problem id (initialized to "two-sum")
- selectedLanguage (string) — "javascript" | "python" | "java" | "cpp"
- code (string) — editor content (starter code from PROBLEMS)
- output (object|null) — result from executeCode: { success, output, error } or null
- isRunning (bool) — running flag for UI

## Routing behavior
- Reads `id` from URL via `useParams()`
- When `id` changes and exists in PROBLEMS, updates currentProblemId, loads starter code for selectedLanguage, and clears output.

## Important functions
- handleLanguageChange(e)
  - Updates selectedLanguage, loads corresponding starter code, clears output.
- handleProblemChange(newProblemId)
  - Navigates to `/problem/:id` (uses useNavigate); useEffect handles loading.
- handleRunCode()
  - Sets isRunning, clears output, calls executeCode(selectedLanguage, code)
  - Stores result in output, sets isRunning false
  - If execution succeeded, compares result.output to expectedOutput for the current problem & language
    - Uses normalizeOutput() and checkIfTestsPassed() for robust comparison
    - On pass → confetti + toast.success
    - On fail → toast.error
- normalizeOutput(output)
  - Trims lines, normalizes spacing around commas/brackets, removes empty lines
- checkIfTestsPassed(actual, expected)
  - Compares normalized strings (==)



## Notes & caveats
- executeCode must support the selectedLanguage and return { success, output, error }.
- Comparison is string-based; for complex outputs consider parsing (JSON) before compare.
- Ensure PROBLEMS contains starterCode and expectedOutput for every supported language.
- Resize handles provided by `react-resizable-panels` allow layout adjustments; min/default sizes set in JSX.
- UI feedback uses isRunning to disable run button and show spinner (handled in CodeEditorPanel).



// ...existing code...

## DashboardPage — Technical details & how it works

Location: frontend/src/pages/DashboardPage.jsx  
Related files:
- Components: frontend/src/components/Navbar.jsx, WelcomeSection, StatsCard, ActiveSession, RecentSession, CreateSessionModal
- Hooks/API: frontend/src/hooks/useSessions.js, frontend/src/api/session.js
- Backend endpoints used: /api/sessions (POST), /api/sessions/active (GET), /api/sessions/my-recent (GET)

Purpose
- Main authenticated landing for hosts/participants.
- Lists active sessions, recent sessions, site stats, and provides UI to create or join sessions.

Data flow & state
- useActiveSessions() (react-query) → fetches GET /sessions/active. Result shown in ActiveSessions component.
- useMyRecentSessions() (react-query) → fetches GET /sessions/my-recent. Result shown in RecentSessions component.
- useCreateSession() (react-query mutation) → POST /sessions to create a new session.
- Local state in DashboardPage:
  - showCreateModal (bool): controls CreateSessionModal visibility
  - roomConfig ({ problem, difficulty }): selected problem + difficulty for session create

Create session flow
1. User opens CreateSessionModal (WelcomeSection triggers setShowCreateModal(true)).
2. User selects problem & difficulty → roomConfig updated.
3. handleCreateRoom validates roomConfig then calls createSessionMutation.mutate(payload).
4. useCreateSession.onSuccess shows a toast and DashboardPage onSuccess callback navigates to /session/{session._id}.
5. createSessionMutation errors are surfaced via toast (configured in hook).

UI behaviors & optimizations
- Loading states:
  - Active/recent sessions queries expose isLoading; the components show skeletons or loaders accordingly.
  - CreateSessionModal disables create button while mutation is pending (CreateSessionModal reads mutation state passed as isCreating).
- isUserInSession() helper determines whether the current Clerk user is host/participant to show join/end actions.
- Pagination/filtering: currently the backend returns limited results (up to 20); add UI filters if needed.

React Query specifics
- useQuery is used for active & recent sessions with default cache/stale behavior; you can tune staleTime/cacheTime in hooks.
- useSessionById (used elsewhere) sets refetchInterval: 5000 to poll session status — useful for session lifecycle updates (participant joined, ended).
- Mutations use optimistic UX via toast notifications; add onMutate/revert logic if you want immediate UI updates before server confirms.

API contract (frontend expectations)
- POST /sessions { problem, difficulty } → returns { session } with session._id, host, callId, etc.
- GET /sessions/active → returns { sessions: [...] }
- GET /sessions/my-recent → returns { sessions: [...] }
- All endpoints expect authenticated requests (Clerk session / credentials). The frontend axios instance uses withCredentials to send cookies.

Error handling & UX
- Hooks centralize error toast messages (see useSessions.js).
- DashboardPage relies on hook errors to inform users; consider centralizing retry logic or showing inline error state in each component.

Testing & debugging tips
- To test create flow locally:
  1. Ensure backend is running and Clerk auth is active.
  2. Sign in with Clerk in the frontend.
  3. Open Dashboard, create a session and confirm navigation to /session/{id}.
- To debug missing sessions or auth:
  - Check backend logs for Inngest / Stream errors.
  - Verify axios baseURL and that requests include credentials.
  - Inspect network tab for responses from /sessions endpoints.

To extend
- Add client-side filters and search for problems in CreateSessionModal.
- Add optimistic UI for adding sessions to ActiveSessions list on create.
- Add websocket/real-time updates (Socket/Stream webhook) instead of polling for session state.


// ...existing code...


// ...existing code...

## Session Page — Components, technical details & how it works

Location: frontend/src/pages/SessionPage.jsx

Purpose
- Real-time collaborative session UI combining problem description, code editor, code execution, video call and chat.

Top-level composition
- SessionPage.jsx — main page layout using PanelGroup (react-resizable-panels).
  - Left: Problem details (top) + Code editor (bottom-left) + Output (bottom-right).
  - Right: Video call UI + Chat.
- Components used:
  - Navbar — frontend/src/components/Navbar.jsx
  - CodeEditorPanel — frontend/src/components/CodeEditorPanel.jsx (Monaco editor + language selector + Run button)
  - OutputPanel — frontend/src/components/OutputPanel.jsx (renders execution result)
  - VideoCallUI — frontend/src/components/VideoCallUI.jsx (Stream Video call + chat toggle)
  - ProblemDescription (inline content in SessionPage or component file) — shows description, examples, constraints

Supporting hooks & libs
- useSessionById (frontend/src/hooks/useSessions.js)
  - Fetches session data from backend (`sessionApi.getSessionById(id)`).
  - Polls session status (refetchInterval: 5000) so UI updates when participant joins / session ends.
- useJoinSession, useEndSession (useSessions)
  - Mutations to join or end sessions; show toasts on success/error.
- sessionApi (frontend/src/api/session.js)
  - Axios wrappers for backend session endpoints:
    - GET /sessions/:id, POST /sessions/:id/join, POST /sessions/:id/end, GET /chat/token
- executeCode (frontend/src/lib/piston.js)
  - Calls Piston API to run user code; returns { success, output, error }.
  - Used by both SessionPage and ProblemPage for "Run Code" feature.
- getDifficultyBadgeClass (frontend/src/lib/utils.js)
  - UI helper for difficulty badge styling.

Video & Chat integration
- Stream SDK
  - initializeStreamClient / disconnectStreamClient (frontend/src/lib/stream.js)
    - Creates a StreamVideoClient with apiKey, user and token.
    - Disconnects user & cleans up client singleton.
  - useStreamClient hook (frontend/src/hooks/useStreamClient.js)
    - Responsibilities:
      - Calls backend `sessionApi.getStreamToken()` to get Stream token and user fields.
      - Initializes StreamVideoClient and joins video call: client.call("default", session.callId).join({ create: true }).
      - Initializes StreamChat client and watches messaging channel: chatClient.channel("messaging", session.callId).watch().
      - Returns { streamClient, call, chatClient, channel, isInitializingCall }.
      - Cleans up on unmount: leave call, disconnect chat, disconnect stream client.
    - Error handling: toasts on failure; sets isInitializingCall to false in finally.

VideoCallUI (frontend/src/components/VideoCallUI.jsx)
- Uses StreamVideo components: StreamVideo, StreamCall, SpeakerLayout, CallControls.
- Shows participant count (useCallStateHooks).
- Chat toggle opens Stream Chat (stream-chat-react) in right panel:
  - Channel, Chat, MessageList, MessageInput, Thread.
- UX:
  - Loading/joining state handled via useCallCallingState.
  - CallControls.onLeave navigates back to /dashboard.
  - Chat panel width toggles with CSS class; components lazy-render only when chatClient & channel exist.

Code editor & execution
- CodeEditorPanel
  - Monaco editor configured via @monaco-editor/react.
  - Language selector reads LANGUAGE_CONFIG and switches monaco language + starter code.
  - Run button triggers onRunCode; shows spinner when isRunning true.
- OutputPanel
  - Renders output or errors using monospace blocks.
  - Handles null state (no run yet) and success vs error states.

Session lifecycle & main flows
1. Load page → useSessionById fetches session data.
2. If user is neither host nor participant and session active → auto-join (useJoinSession) triggers and refetches session.
3. If session.status === "completed" → participant(s) redirected to /dashboard.
4. When problemData loads, editor starter code is set for selectedLanguage.
5. Run code:
   - handleRunCode calls executeCode(selectedLanguage, code).
   - Output stored in state; OutputPanel shows success or error.
6. Host can end session using useEndSession mutation; on success navigate to /dashboard.

Important details & caveats
- Authentication:
  - All session API calls require auth (Clerk). Axios instance is configured with withCredentials: true.
  - sessionApi.getStreamToken requires an authenticated request to return Stream token and user info.
- Stream tokens:
  - Backend generates token using server Stream secret; frontend never stores the secret.
  - session.callId is used as both video call identifier and chat channel id.
- Clean-up:
  - useStreamClient ensures video and chat clients are left/disconnected on unmount to avoid leaking resources.
- Polling vs real-time:
  - Session state is polled via useSessionById (5000ms). Consider replacing with server-sent events or socket updates for lower latency.
- Error handling:
  - Most failures show toast messages; UI shows "Connection Failed" card if stream client or call not available.
- Starter code & expected outputs:
  - Problems come from PROBLEMS (frontend/src/data/problems). Ensure starterCode and expectedOutput exist per language if you run automated checks.

Testing & debugging tips
- To test video flow locally:
  - Ensure backend /chat/token endpoint works and the server has STREAM_API_KEY/SECRET.
  - Authenticate a user using Clerk, create a session, then open session URL in two browsers/tabs (different users) to test joining.
- To test code execution:
  - Use Run Code with simple prints; inspect network tab to ensure POST to Piston URL succeeds.
  - Check executeCode error message if Piston returns non-200.
- Common failures:
  - Missing VITE_STREAM_API_KEY or backend token endpoint failure → video join fails.
  - Axios failing due to CORS or missing cookies → ensure withCredentials and correct API origin are configured.

Where to look in code
- Page & layout: frontend/src/pages/SessionPage.jsx
- Video init & cleanup: frontend/src/hooks/useStreamClient.js, frontend/src/lib/stream.js
- Video UI: frontend/src/components/VideoCallUI.jsx
- Editor & output: frontend/src/components/CodeEditorPanel.jsx, frontend/src/components/OutputPanel.jsx
- Session API: frontend/src/api/session.js
- Session hooks: frontend/src/hooks/useSessions.js
- Code execution: frontend/src/lib/piston.js
- Problem data: frontend/src/data/problems.js

Possible improvements
- Use WebSockets / Stream event handlers to reduce polling.
- Add retries/backoff for call/chat initialization.
- Show inline errors in UI (not just toasts) for better UX.
- Centralize Stream/Chat initialization & token refresh handling.


// ...existing code...
# PeerCode

PeerCode is a collaborative coding interview and practice platform. Create or join a one-on-one coding session, talk over video, chat, and work through coding problems in a multi-language editor.

**Live app:** [ialksng.me/work/projects/peercode/app](https://ialksng.me/work/projects/peercode/app)  
**Developer:** [Alok Singh](https://ialksng.me)

## Features

- Clerk sign-in
- One-on-one video calls and real-time chat powered by Stream
- Active and recent interview sessions
- Session-based practice and a multi-language code editor
- JavaScript, Python, and Java execution through Judge0 CE on RapidAPI
- Session and user data stored in MongoDB
- Clerk user lifecycle events handled with Inngest

## Tech stack

- Frontend: React, Vite, React Router, TanStack Query, Tailwind CSS
- Backend: Node.js, Express, MongoDB/Mongoose
- Services: Clerk, Stream, Inngest, Judge0 CE (RapidAPI)

## Run locally

Use Node.js and npm. Install each app's dependencies in its own folder.

### Backend

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
CLIENT_URL=http://localhost:5173
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
JUDGE0_RAPIDAPI_KEY=your_rapidapi_key
JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

Then run:

```bash
cd backend
npm install
npm run dev
```

### Frontend

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

Then run in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Vercel frontend

- Import the repository into Vercel and set **Root Directory** to `frontend`.
- Build command: `npm run build`; output directory: `dist`.
- Set `VITE_API_URL=https://peercode-le7n.onrender.com/api`, plus `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_STREAM_API_KEY` for the Clerk and Stream instances used in production.
- The Vite base path and `frontend/vercel.json` serve the app at `/work/projects/peercode/app/` and keep nested routes and assets working.

### Render backend

- Create a Node web service from this repository and set **Root Directory** to `backend`.
- Build command: `npm install`; start command: `npm start`.
- Set `DB_URL`, `CLERK_SECRET_KEY`, `STREAM_API_KEY`, `STREAM_API_SECRET`, `JUDGE0_RAPIDAPI_KEY`, `JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com`, and `CLIENT_URL=https://ialksng.me,https://peercode-beige.vercel.app`. Render supplies `PORT`.
- Get a Judge0 CE subscription and API key from [Judge0 CE on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce). In Render, set `JUDGE0_RAPIDAPI_KEY` to your RapidAPI app key and `JUDGE0_RAPIDAPI_HOST` to `judge0-ce.p.rapidapi.com`. Do not add this key to Vercel or any `VITE_` variable.
- Set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` if using the Clerk user-sync jobs.

To keep the app under your existing site's URL, copy [`cloudflare/pages-function/functions/work/projects/peercode/app/[[path]].js`](cloudflare/pages-function/functions/work/projects/peercode/app/%5B%5Bpath%5D%5D.js) into the same path under the existing Cloudflare Pages project's `functions/` directory. Pages Functions route requests by file path, and this function forwards the matching URL, including its path and query, to Vercel. Cloudflare Pages `_redirects` cannot proxy to external domains, so use a Pages Function for this cross-host route ([Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/), [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)). This repository contains the function template; it does not deploy it or change your Pages project or domain settings.

Example environment files are provided at [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example), with production deployment examples in each folder. Copy the relevant example and replace every placeholder. Never commit real keys. The Stream API key and Clerk publishable key are public; keep the Stream API secret, Clerk secret key, and Judge0 RapidAPI key on the backend only. Code submissions are sent through Render so the Judge0 key is never exposed to the browser.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

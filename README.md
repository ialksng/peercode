# PeerCode

PeerCode is a collaborative coding interview and practice platform. Create or join a one-on-one coding session, talk over video, chat, and work through coding problems in a multi-language editor.

**Live app:** [ialksng.me/work/projects/peercode/app](https://ialksng.me/work/projects/peercode/app)  
**Developer:** [Alok Singh](https://ialksng.me)

## Features

- Clerk sign-in
- One-on-one video calls and real-time chat powered by Stream
- Active and recent interview sessions
- Session-based practice and a multi-language code editor
- JavaScript, Python, and Java execution through Piston
- Session and user data stored in MongoDB
- Clerk user lifecycle events handled with Inngest

## Tech stack

- Frontend: React, Vite, React Router, TanStack Query, Tailwind CSS
- Backend: Node.js, Express, MongoDB/Mongoose
- Services: Clerk, Stream, Inngest, Piston

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

The client is intended to be served at `/work/projects/peercode/app/`. Vercel configuration redirects `/` to that path and rewrites app routes to the client entry point so nested pages work on refresh. Set the frontend environment variables above in Vercel, using the deployed backend URL for `VITE_API_URL`.

Example environment files are provided at [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example). Copy the relevant file to `.env` and replace the sample values. Never commit real keys.

Deploy the `backend` directory as a Node web service on Render. Configure `DB_URL`, `CLERK_SECRET_KEY`, `STREAM_API_KEY`, `STREAM_API_SECRET`, `CLIENT_URL` (the Vercel site origin), and the Inngest keys if using Inngest. Render supplies `PORT`.

Configure the Clerk production instance with the deployed site's domain and the matching publishable and secret keys. The Stream API key is public and is used by the browser; keep the Stream API secret and Clerk secret key only on the backend.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

# Project Task Board

A full-stack app for managing projects and their tasks. Users sign in with Google or with email/password, then create, edit and delete projects. Each project has a Kanban board where tasks get a status, priority and due date. Projects can be filtered by Active/Inactive/All and tasks by status, due date and search text. Users only ever see their own data.

## Live Demo

Hosted on **Vercel** (free tier), with the frontend and backend as separate projects. The first request after a period of inactivity can take a few seconds while the serverless function cold-starts.

| App | URL |
|---|---|
| Frontend | https://project-task-board-vsjo.vercel.app |
| Backend API | https://project-task-board-ruby.vercel.app (health check: [`/api/health`](https://project-task-board-ruby.vercel.app/api/health)) |

## Tech Stack & Why

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5 |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | Google OAuth 2.0 + email/password (bcrypt), JWT on all private routes |

I chose **Express** because it is minimal and has no boilerplate, and a few REST resources don't need NestJS's extra structure. It also deploys to Vercel as a single serverless function. **MongoDB with Mongoose** fits the simple user → project → task hierarchy well. Mongoose schemas give validation, enums and indexes in code, and Atlas's free tier works well with serverless hosting.

**Schemas:** MongoDB has no migrations. The Mongoose models in [`server/src/models`](server/src/models) are the source of truth for the `users`, `projects` and `tasks` collections, including their indexes. Task statuses are named `todo`, `in-progress` and `completed`; these are the brief's todo / in_progress / done.

## Setup

Requirements: Node.js 20.19+ (or 22.12+), npm, and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/m-abdullah-shakoor/project-task-board.git
cd project-task-board
npm install --prefix server
npm install --prefix client
```

## Environment Variables

**`server/.env`**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on locally (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID, used to verify Google logins |
| `FRONTEND_URL` | Frontend origin allowed by CORS, e.g. `http://localhost:5173` |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (default `http://localhost:5000`) |
| `VITE_GOOGLE_CLIENT_ID` | Same Google OAuth client ID as the server |

On Vercel, set these in each project's environment settings, then redeploy.

## Running Locally

```bash
npm --prefix server run seed   # optional: load sample data
npm run dev:server             # API at http://localhost:5000
npm run dev:client             # app at http://localhost:5173 (separate terminal)
```

**Seeder:** `npm run seed` (in `server/`) creates a demo account, **`demo@taskboard.dev` / `password123`**. The account gets 3 projects (one of them inactive) and 8 tasks with mixed statuses and due dates. Running it again resets only the demo account's data.

Production build of the client: `npm run build:client`

## Testing

```bash
npm --prefix server test       # 30 API tests
npm --prefix client run lint   # ESLint
```

The server tests use Node's built-in test runner with Supertest against an in-memory MongoDB, so no database or `.env` is needed. The first run downloads a MongoDB binary. The tests cover:

- **Auth:** register, login, the `/me` endpoint, and rejecting missing or invalid tokens.
- **CRUD:** projects and tasks, including the status filter.
- **Ownership isolation:** another user's projects and tasks return 404.
- **Seeder:** the demo data loads, and re-running doesn't duplicate it.

**Manual check:** log in with Google or the demo account. Create, edit and delete a project. Toggle it inactive and use the project filter. Add a task, edit it, change its status, filter by status, then refresh to confirm everything persisted.

## Not Implemented (Optional)

- **Due-date reminder job:** the optional scheduled job isn't built. It would find tasks due within the next X hours that aren't done and log a reminder, with X stored in the database. Vercel has no always-on process, so this would need a [Vercel Cron Job](https://vercel.com/docs/cron-jobs) that calls a protected API route on a schedule.

## API Overview

Every route except `/api/health`, `/api/auth/register`, `/api/auth/login` and `/api/auth/google` needs an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` · `/api/auth/login` · `/api/auth/google` | Sign up / log in; returns a JWT |
| GET | `/api/auth/me` | Current user |
| GET / POST | `/api/projects` | List / create projects |
| GET / PUT / DELETE | `/api/projects/:id` | Get / update / delete a project (delete also removes its tasks) |
| GET / POST | `/api/projects/:projectId/tasks` | List (`?status=`, `?priority=`) / create tasks |
| PUT / DELETE | `/api/tasks/:id` | Update / delete a task |

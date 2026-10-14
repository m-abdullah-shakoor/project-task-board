# Task Board — Full-Stack Project & Task Management

A responsive, full-stack task management application for organizing projects, tracking tasks, monitoring deadlines, and managing day-to-day work through a clean dashboard.

The application provides project-level organization, task status and priority tracking, due-date management, and search and filtering tools. Its interface uses a light, warm-neutral color palette with sage-green accents and is designed to work across desktop, tablet, and mobile screens.

## Live Demo

| Component | URL |
|---|---|
| Frontend | `https://YOUR-FRONTEND-URL.vercel.app` |
| Backend API | `https://YOUR-BACKEND-URL.vercel.app` |

> **Note:** Replace these placeholders with the actual deployed Vercel URLs. The frontend and backend are deployed as separate projects.

## Features

### Dashboard

- Centralized view of projects and tasks.
- Clean, light-themed interface with consistent visual styling.
- Responsive layout for desktop, tablet, and mobile devices.
- Project and task information organized for quick access.

### Project Management

- Create and manage projects.
- Add project descriptions.
- Track project availability using active and inactive status.
- View project-related task information.
- Filter projects according to their status.

### Task Management

- Organize tasks within projects.
- Assign task statuses:
  - `todo` — Work that has not started.
  - `in-progress` — Work currently underway.
  - `completed` — Finished work.
- Set task priorities:
  - `low`
  - `medium`
  - `high`
- Assign due dates to tasks.
- Identify overdue tasks based on their due dates and completion status.
- Search tasks and filter them using available task attributes.

### User Interface

- Warm, neutral background with sage-green accents.
- Consistent spacing, typography, and component styling.
- Clear visual distinction between task statuses and priorities.
- Responsive forms and project-creation modal.
- Loading and data-fetching states.

## Technology Stack

The project uses a separate frontend and backend architecture.

| Layer | Technology |
|---|---|
| Frontend framework | React |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Backend framework | Node.js and Express |
| Database | MongoDB |
| Object data modeling | Mongoose |
| API communication | HTTP/REST API |
| Deployment | Vercel |

**Architecture overview**

```text
User
  |
  v
React Frontend (Vite + Tailwind CSS)
  |
  | HTTP requests to backend API
  v
Express Backend (Node.js)
  |
  | Mongoose
  v
MongoDB Database
```

The frontend handles the user interface and client-side interactions. The backend exposes API endpoints, processes requests, and communicates with MongoDB through Mongoose.

The frontend and backend are deployed independently. The frontend must use the correct backend API URL, and the backend must allow requests from the deployed frontend origin.

## Project Structure

The repository contains separate frontend and backend applications.

```text
project-task-board/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/
│   ├── package.json
│   ├── ...
│
└── README.md
```

> This is an illustrative structure. Update it to match the actual repository, including the locations of entry points, routes, models, controllers, and configuration files.

## Prerequisites

Install the following before running the application locally:

- Node.js — preferably the version supported by the project.
- npm, included with Node.js.
- A MongoDB database, either a local MongoDB instance or a MongoDB Atlas cluster.
- Git, for cloning and managing the repository.

Verify your installed versions:

```bash
node --version
npm --version
git --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd project-task-board
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure frontend environment variables

Create a `.env.local` file in the frontend directory, if that matches the environment-file convention used by your application.

For a Vite application, client-exposed environment variables must use the `VITE_` prefix.

Example:

```env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

Replace `YOUR_BACKEND_PORT` with the port configured by the backend.

The variable name above is an example. Use the exact name referenced by your frontend API configuration. If your code uses `VITE_API_BASE_URL` or another variable, document and configure that name instead.

### 4. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 5. Configure backend environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=YOUR_BACKEND_PORT
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
FRONTEND_URL=http://localhost:5173
```

Replace the example values with your actual configuration.

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Local backend listening port, if supported by the application | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/taskboard` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

**Important configuration notes:**

- These names are examples; confirm the actual variables referenced in the backend code.
- A MongoDB Atlas connection string typically begins with `mongodb+srv://`.
- For Atlas, ensure the database user has the necessary permissions and the network access configuration allows the connection.
- Do not commit `.env`, `.env.local`, credentials, database passwords, or private API keys.
- Never put backend secrets in Vite variables, because `VITE_` variables are exposed to client-side code.

### 6. Start the backend

Check the scripts in `backend/package.json` and use the appropriate command.

For example, if a development script exists:

```bash
npm run dev
```

Alternatively, use the script configured by the project, such as `npm start`.

Confirm that the backend starts successfully and establishes its MongoDB connection. Record the local API URL and port from the actual application output.

### 7. Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, commonly:

```text
http://localhost:5173
```

Keep both development servers running while using the application.

## Running the Application

1. Start MongoDB or confirm that your Atlas database is reachable.
2. Start the backend API.
3. Start the frontend development server.
4. Open the frontend in your browser.
5. Create a project and add tasks.
6. Test task status, priority, due dates, search, and filtering.
7. Refresh the page to verify that data is retrieved from the backend and persisted in the database, if persistence is implemented for those operations.

If the dashboard remains stuck on its loading state, check the browser's Network and Console tabs, along with the backend terminal. Verify the API URL, server status, CORS configuration, and database connection.

## Environment Configuration

The application uses different configuration values for local development and production.

### Local development

**Frontend environment file**

```env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

**Backend environment file**

```env
PORT=YOUR_BACKEND_PORT
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
FRONTEND_URL=http://localhost:5173
```

Use the exact environment-variable names expected by the codebase.

### Production deployment

Configure environment variables in the respective Vercel projects.

**Frontend Vercel project**

```env
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app
```

**Backend Vercel project**

```env
MONGODB_URI=YOUR_PRODUCTION_MONGODB_CONNECTION_STRING
FRONTEND_URL=https://YOUR-FRONTEND-URL.vercel.app
```

Add `PORT` only if required by the backend's deployment configuration. Vercel serverless deployments do not necessarily use a persistent listening server or require a manually configured port.

After changing a Vite environment variable in Vercel, redeploy the frontend so the new value is included in its build.

## API and CORS Configuration

The frontend communicates with the backend through HTTP requests. The backend must accept requests from the frontend's origin.

For local development, the allowed origin will typically be:

```text
http://localhost:5173
```

For production, add the exact deployed frontend origin:

```text
https://YOUR-FRONTEND-URL.vercel.app
```

If the application uses credentials such as cookies, configure CORS accordingly and use explicit allowed origins rather than a wildcard origin.

Document the API endpoints below after confirming them in the backend source code.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `ACTUAL_PROJECT_LIST_ENDPOINT` | Retrieve projects |
| `POST` | `ACTUAL_PROJECT_CREATE_ENDPOINT` | Create a project |
| `GET` | `ACTUAL_TASK_LIST_ENDPOINT` | Retrieve tasks |
| `POST` | `ACTUAL_TASK_CREATE_ENDPOINT` | Create a task |
| `PATCH` / `PUT` | `ACTUAL_TASK_UPDATE_ENDPOINT` | Update a task |
| `DELETE` | `ACTUAL_DELETE_ENDPOINT` | Delete a resource, if supported |

These are documentation placeholders, not verified routes. Replace them with the actual HTTP methods, paths, request bodies, and response formats implemented by the backend. Remove unsupported operations.

## Testing

Testing should cover both the frontend and backend, along with their integration.

### 1. Check available test scripts

Inspect the scripts in both `package.json` files:

```bash
cd frontend
npm run
```

```bash
cd backend
npm run
```

Run the test command defined by the project if a test script exists:

```bash
npm test
```

Do not add a test command to the documentation as an existing capability until the corresponding script and test suite are confirmed.

### 2. Manual functional testing

Use the following checklist to validate the main workflows.

#### Projects

- [ ] Create a project with a name and description.
- [ ] Confirm that the project appears in the dashboard.
- [ ] Change its active/inactive status.
- [ ] Verify that project status filtering behaves correctly.
- [ ] Check how projects with no tasks are displayed.

#### Tasks

- [ ] Create a task within the correct project.
- [ ] Change its status between `todo`, `in-progress`, and `completed`.
- [ ] Assign and change task priorities.
- [ ] Set a due date and verify that it is displayed correctly.
- [ ] Confirm that overdue tasks are identified appropriately.
- [ ] Verify that completed tasks are not incorrectly treated as outstanding overdue work.
- [ ] Search for tasks and apply available filters.
- [ ] Verify task updates and deletions, if supported.

#### Persistence and integration

- [ ] Refresh the page and confirm that saved data remains available.
- [ ] Confirm that API requests reach the expected backend.
- [ ] Check browser Console and Network tabs for errors.
- [ ] Confirm that backend errors are handled without leaving the interface stuck indefinitely.
- [ ] Verify that MongoDB connectivity works in the local environment.
- [ ] Repeat the essential workflows against the deployed application.

#### Responsive interface

- [ ] Check the dashboard on a desktop-sized viewport.
- [ ] Check the layout on a tablet-sized viewport.
- [ ] Check the layout on a mobile-sized viewport.
- [ ] Verify that dialogs, forms, filters, and task information remain usable on smaller screens.

### 3. Production smoke test

After deployment:

1. Open the frontend's live URL.
2. Confirm that the dashboard loads without a persistent loading state.
3. Inspect the browser's Network tab and verify that API requests target the deployed backend.
4. Create or update a test project and task.
5. Refresh the page and confirm the expected persistence behavior.
6. Check the backend deployment logs if requests fail.

## Deployment

The frontend and backend are deployed as separate Vercel projects.

### Frontend deployment

1. Import the Git repository into Vercel.
2. Set the frontend project's **Root Directory** to the actual frontend directory.
3. Configure the build settings based on the frontend's `package.json`.
4. Add the production API URL using the environment variable expected by the frontend.
5. Deploy the project.
6. Copy the resulting deployment URL into the Live Demo section.

### Backend deployment

1. Create a separate Vercel project for the backend.
2. Set its **Root Directory** to the actual backend directory.
3. Confirm that the Express application is configured for Vercel's deployment model.
4. Add the production MongoDB connection string and frontend origin to the backend environment variables.
5. Deploy the backend.
6. Confirm that the API endpoints work in the deployed environment.
7. Copy the backend URL into the Live Demo section.

**Deployment considerations**

- A Vercel backend must be compatible with Vercel's runtime and serverless execution model; a conventional persistent `app.listen()` server may require adaptation depending on the project structure.
- The backend must connect to MongoDB using the production connection string.
- The frontend must use the deployed backend URL, not a localhost URL.
- CORS must allow the exact deployed frontend origin.
- If the frontend uses cookies or other credentials, verify the relevant CORS and cookie settings.
- Do not expose database credentials or private environment variables in the frontend.

## Troubleshooting

| Problem | What to check |
|---|---|
| Dashboard remains on a loading screen | Inspect the API request in the browser Network tab and check backend logs. |
| `ERR_CONNECTION_REFUSED` | Confirm that the backend is running and that the requested host and port are correct. |
| CORS error | Confirm that the frontend's exact origin is allowed by the backend. |
| HTTP `404` | Verify the API base URL, endpoint path, and HTTP method. |
| HTTP `500` | Inspect backend logs for exceptions, missing variables, or database failures. |
| MongoDB connection failure | Check `MONGODB_URI`, database credentials, network access, and connection permissions. |
| Frontend works locally but not in production | Check Vercel environment variables, deployment logs, API URL, and production CORS configuration. |
| Frontend still uses an old API URL | Check the Vite environment variable and redeploy the frontend. |
| Data disappears after refreshing | Check whether the operation reaches the database and whether the relevant API endpoint persists data. |

## Security and Configuration

- Keep secrets in environment variables, not source code.
- Keep `.env` and `.env.local` files out of version control.
- Use a restricted MongoDB database account for production.
- Allow only the necessary frontend origins through CORS.
- Validate and sanitize API inputs on the backend.
- Handle errors without returning sensitive internal details to clients.
- Avoid committing real production credentials, tokens, or connection strings.

## Future Improvements

Potential extensions include:

- Automated frontend and backend test suites.
- Improved validation and error reporting.
- Additional task sorting and filtering options.
- Pagination for larger projects and task lists.
- More detailed project progress summaries.
- Continuous integration checks for pull requests and deployments.

These are potential enhancements, not claims that they are already implemented.

## License

No license has been specified in this README. Add the appropriate license if the project is intended for redistribution or open-source use.

---

**Maintainer:** Muhammad Abdullah Shakoor  
**Repository:** `YOUR_GITHUB_REPOSITORY_URL`

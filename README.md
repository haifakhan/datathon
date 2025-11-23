# Datathon workspace

This repo now splits the React frontend into `frontend/`, leaving `backend/` free for server work.

## Structure
- `frontend/` – Create React App code (package files, `src/`, `public/`, and its `node_modules/`)
- `backend/` – placeholder for backend code

## Frontend commands
- `cd frontend && npm start` to run the dev server
- `cd frontend && npm test` for tests
- `cd frontend && npm run build` for production builds

`node_modules` stays alongside the frontend package so installs and scripts run locally inside `frontend/`.

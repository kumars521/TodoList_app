# Todonew

A modern task and project tracking app built as a React + Vite frontend and Azure Functions backend.

## Local development

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Start infrastructure:
   `docker compose up -d postgres azurite`
3. Start the backend:
   `npm --prefix services/functions run start`
4. Start the frontend:
   `npm --prefix services/web run dev -- --host 0.0.0.0`

## Workspace scripts

- `npm run build` — build shared, backend, and frontend.
- `npm run dev:web` — run the Vite app.
- `npm run dev:func` — start Azure Functions.

## Included services

- PostgreSQL for task and project data
- Blob Storage for uploaded attachments
- Azure Functions API routes for tasks and health checks

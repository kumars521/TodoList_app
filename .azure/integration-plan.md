# Integration Plan

## Backend
- Project folder: `services/functions`
- Run command: `npm --prefix services/functions run start`
- Port: `7071`
- Build command: `npm --prefix services/functions run build`
- Health endpoint: `GET /api/health`

## Frontend
- Project folder: `services/web`
- Build command: `npm --prefix services/web run build`
- Dev command: `npm --prefix services/web run dev -- --host 0.0.0.0`
- API seam to swap: `services/web/src/api/index.ts`
- Mock files to delete after live integration: `services/web/src/api/mockClient.ts`, `services/web/src/api/previewState.ts`, `services/web/src/mocks/`, and any locally duplicated types in `services/web/src/api/types.ts` that are replaced by shared contracts.
- Live-data wire-up: replace `api` export in `services/web/src/api/index.ts` with the live client implementation. No page or hook rewrites should be needed outside the seam.

## API routes
- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Database
- Type: PostgreSQL
- Migration tool: Prisma or direct SQL migration script (choose the repo’s preferred consistent migration approach once implemented)
- Migration directory: `services/functions/src/database/migrations` (or equivalent generated migration folder if Prisma is adopted)
- Connection env vars: `DATABASE_URL`
- Note: no seed data should be created in migrations.

## Shared types
- Shared package: `services/shared`
- Shared import alias: `@app/shared`

## Services
- Essential:
  - Task repository
  - Blob storage client
- Enhancement:
  - Health aggregate checks / connection monitoring
  - Optional storage upload or metadata helpers

## Integration checklist
- Smoke-test backend health and task endpoints.
- Replace mock client with live API client at `services/web/src/api/index.ts`.
- Remove mock-only files once live client is confirmed.
- Create schema migrations only for the task table and related persistence structure; no seed rows.
- Verify the app loads and the dashboard, tasks list, and task detail page read live backend data.

## Integration results
- PostgreSQL and Azurite started with Docker Compose; `001_create_tasks.sql` applied successfully.
- Backend builds successfully and all routes registered after configuring the Node v4 `main` glob in `services/functions/package.json`.
- `GET /api/health` returned `200` with database and storage `ok`.
- `GET /api/tasks` returned `200` with an empty live result; invalid `POST /api/tasks` returned structured `422` validation.
- Valid create, update, delete, and missing-delete probes returned `201`, `200`, `200`, and `404` respectively; the temporary task was removed.
- Frontend build passed and Vite proxy requests to `/api/health` and `/api/tasks` returned live backend responses.
- Live client is the active API seam; mock and preview-state sources are absent from frontend source usage.
- No seed data was created.

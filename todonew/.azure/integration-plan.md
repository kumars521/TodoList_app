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
- API seam: `services/web/src/api/index.ts`
- Mock files to delete: `services/web/src/api/mockClient.ts`, `services/web/src/mocks/**`, `services/web/src/api/previewState.ts`, `services/web/src/components/previewStateSwitcher.tsx` (if present)
- Live data swap: replace the mock `api` implementation with the backend-backed client at the `src/api/index.ts` seam; do not rewrite call sites across the app.

## API routes
- GET `/api/health`
- POST `/api/auth/login`
- GET `/api/tasks`
- POST `/api/tasks`
- PATCH `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- GET `/api/users`
- PATCH `/api/users/:id/role`

## Database
- Type: PostgreSQL (or Azure SQL if the integration agent chooses a platform-specific adapter)
- Migration tool: Prisma or standard SQL migration scripts as appropriate
- Migration directory: `services/functions/migrations` or `services/db/migrations`
- Connection env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`
- Rule: no seed data is to be created during integration.

## Shared types
- Shared package: `services/shared`
- Import alias: `@app/shared`

## Services
- Essential: auth, tasks, user roles, health
- Enhancement: admin telemetry, search indexing, activity logging

## Verification
- Smoke-test each backend route with the expected response contract.
- Check frontend pages render with live data instead of mocked data.
- Ensure TypeScript compilation succeeds after the live-data swap.

## Integration Results
- Created and applied the schema-only PostgreSQL migration at `services/functions/migrations/001_initial_schema.sql`; `users` and `tasks` tables plus task indexes are present. No seed data was created.
- Added the `npm run migrate` runner and local Functions configuration for the Node worker.
- Backend build passed and all eight routes were smoke-tested on port 7071: health/auth/tasks list/create/update/delete/users/role.
- Replaced the embedded frontend mock client with the typed live client at `services/web/src/api/client.ts`; the seam now exports `liveClient` and no mock or preview-state references remain.
- Added the Vite `/api` proxy to the backend and pinned `@app/shared` to the workspace shared source.
- Frontend and backend builds passed. Vite ran on port 5176 and `GET /api/tasks` through the frontend proxy returned HTTP 200 with the backend response.

# Project Plan

**Status**: Integrated
**Created**: 2026-09-21
**Mode**: NEW
**Execution Mode**: auto

---

## 1. Project Overview

**Goal**: Build a React task management app for a small team to sign in, manage users and roles, create task records, sort and filter a shared backlog, and review workload from a daily and monthly dashboard. The project is designed so that every module is independently testable.

**App Type**: SPA + API

**API Login**: Yes

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | React + Vite |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure Static Web Apps | Host the React frontend and static assets for the task manager demo | VITE_API_BASE_URL | http://localhost:5173 | Essential |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | * | ✅ | v24.11.1 |
| npm | * | ✅ | 11.6.2 |
| Git | * | ✅ | 2.55.0 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker Desktop | Frontend demo | ✅ | Docker version 29.7.2 |
| Docker Compose | Frontend demo | ✅ | Docker Compose version v5.5.0 |
| VS Code | * | ❓ | not detected via CLI |

---

## 5. Project Structure

```text
todonew/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ routes.tsx
│  │  └─ providers/
│  ├─ components/
│  │  ├─ auth/
│  │  ├─ dashboard/
│  │  ├─ tasks/
│  │  ├─ users/
│  │  └─ layout/
│  ├─ hooks/
│  ├─ lib/
│  ├─ types/
│  ├─ data/
│  └─ styles/
├─ .env.example
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vitest.config.ts
└─ README.md
```

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: Modern productivity dashboard with subtle depth, rounded surfaces, and strong emphasis on urgent work so the team can scan priorities in seconds.
**Typography**: Inter, system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2F6FED` | Primary buttons, active navigation, selected task filters |
| `accent` | `#14B8A6` | Secondary highlights, completion badges, positive states |
| `surface` | `#F5F7FB` | Page and card backgrounds for the main task workspace |
| `text` | `#111827` | Body text, labels, and task titles |
| `muted` | `#64748B` | Secondary text, captions, timestamps, and empty-state hints |
| `border` | `#D8E0EC` | Dividers, rows, and input borders |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Dashboard | `/` | Track daily commitments, monthly totals, and urgent tasks | header + hero + grid + table |
| Tasks | `/tasks` | Manage task creation, filters, sorting, completion, and deletion | header + actions + table |
| User Access | `/users` | Review team members, roles, and permissions by account | header + card-list + form |

### Sample Content

```
Dashboard — tasks:
| Task | Owner | Due | Priority | Status |
| Launch checklist | Priya | Today | High | In progress |
| QA bug triage | Mateo | Tomorrow | Medium | Review |
| Sprint retro notes | Daria | Thu | Low | Planned |

Tasks — task: New design review · Due: Today · Owner: Jess · Priority: High
User Access — user: Priya Shah · Role: Team Lead · Access: Full
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Health check | — | `{ status, services }` | 200, 503 |
| 2 | POST | `/api/auth/login` | Sign in with email and password | `{ email, password }` | `{ user, token }` | 200, 401 |
| 3 | GET | `/api/tasks` | Fetch task list and filters | — | `{ tasks, total }` | 200 |
| 4 | POST | `/api/tasks` | Create a task | `{ title, owner, dueDate, priority }` | `{ task }` | 201, 400 |
| 5 | PATCH | `/api/tasks/:id` | Toggle task completion or update metadata | `{ completed, priority, owner }` | `{ task }` | 200, 404 |
| 6 | DELETE | `/api/tasks/:id` | Delete a task | — | `{ deleted: true }` | 200, 404 |
| 7 | GET | `/api/users` | Fetch users and roles | — | `{ users }` | 200 |
| 8 | PATCH | `/api/users/:id/role` | Update a user role or access level | `{ role }` | `{ user }` | 200, 404 |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification

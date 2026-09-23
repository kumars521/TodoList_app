# Project Plan

**Status**: Integrated
**Created**: 2026-09-21
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build a modern personal task and project tracking app for Todonew so users can plan work, monitor priorities, and complete tasks with clear status visibility. The project is designed so that every module is independently testable.

**App Type**: SPA + API

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Backend — Azure Functions

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Runtime** | Node |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |

> **Language vs Runtime**: `Language` is the source language the user picked in this service's `language` question. `Runtime` is the execution runtime — default `Node` for TypeScript/JavaScript, `CPython` for Python, `.NET` for C#. Only deviate from the default (e.g. `Bun`, `Deno`, `PyPy`) when the user explicitly asks. **Package Manager and Test Runner are language-dependent** — match them to this service's Language (e.g. C# → `dotnet (NuGet)` + `xUnit`/`NUnit`/`MSTest`). The `Orchestration` row is recorded for the scaffold step but hidden in the plan UI — always keep it set to `docker-compose`.

---

## 3. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | React + Vite |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 4. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Blob Storage | Store task attachments and uploaded files | STORAGE_CONNECTION_STRING | UseDevelopmentStorage=true | Essential |
| PostgreSQL | Primary data store for tasks, projects, and activity history | DATABASE_URL | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/todonew | Essential |

---

## 5. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | Backend, Frontend | ✅ | v24.11.1 |
| npm | Backend, Frontend | ✅ | 11.6.2 |
| Docker Desktop | Backend, Frontend | ✅ | 29.7.2 |
| Azure Functions Core Tools | Backend | ❓ | unknown |
| Azure CLI | Backend, Deployment | ❓ | unknown |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| VS Code Azure Functions extension | Backend | ❓ | unknown |
| Docker Compose | Backend, Frontend | ✅ | 29.7.2 |
| VS Code | Backend, Frontend | ❓ | unknown |

> Inform the user to double-check all `❓` tools are installed before proceeding.

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: Modern productivity dashboard with calm blue accents, highly legible task lists, and subtle depth to support quick daily triage without visual noise.
**Typography**: Inter, system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | #2563eb | Primary action buttons, active task states, and navigation highlights |
| `accent`  | #14b8a6 | Focus badges, progress highlights, and secondary CTAs |
| `surface` | #f8fafc | Page and panel backgrounds throughout the dashboard |
| `text`    | #0f172a | Primary task names, labels, and interface text |
| `muted`   | #64748b | Secondary metadata, timestamps, and inactive filters |
| `border`  | #dbe2ea | Dividers, pill outlines, and form/input boundaries |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Dashboard | `/` | Overview of today’s priorities, streaks, and workload | `header + hero + grid + table` |
| Tasks | `/tasks` | Review and filter active task work across projects | `header + sidebar + list + table` |
| Task Detail | `/tasks/{id}` | View a task’s status, description, attachments, and notes | `header + two-column(meta+details) + action-bar` |

### Sample Content

```
Dashboard — tasks:
| Task | Project | Due | Status |
| Finish onboarding checklist | Product Launch | Today | In Progress |
| Draft weekly sprint plan | Growth | Tue | Todo |
| Review analytics dashboard | Ops | Thu | Review |
| Prepare release notes | Product Launch | Fri | Done |

Tasks — tasks:
| Title | Priority | Owner | Status |
| QA regression pass | High | Maya | In Progress |
| Update customer onboarding copy | Medium | Leo | Todo |
| Create launch checklist | High | Priya | Review |
| Archive completed sprint items | Low | Aiden | Done |

Task Detail — task: Sprint review and blockers summary · Assignee: Maya · Due: Today · Status: In Progress
```

---

## 7. Project Structure

```
project-root/
├── .azure/
│   ├── project-plan.md
│   └── .preview-temp/
│       ├── theme.css
│       └── manifest.json
├── .env.example
├── .gitignore
├── package.json
├── services/
│   ├── functions/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── host.json
│   │   ├── local.settings.json
│   │   ├── src/
│   │   │   ├── functions/
│   │   │   ├── services/
│   │   │   ├── config/
│   │   │   └── types/
│   │   └── tests/
│   ├── web/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── api/
│   │       ├── components/
│   │       ├── pages/
│   │       ├── hooks/
│   │       └── routes/
│   └── shared/
│       ├── package.json
│       └── types/
├── docker-compose.yml
└── README.md
```

---

## 8. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Health check for API and datastore connectivity | — | `{ status, services }` | 200, 503 |
| 2 | GET | `/api/tasks` | List tasks with optional filter parameters | — | `{ items: [{ id, title, status, project, dueDate, priority }] }` | 200 |
| 3 | POST | `/api/tasks` | Create a new task | `{ title, projectId, description, dueDate, priority }` | `{ id, title, status }` | 200, 201, 422 |
| 4 | PATCH | `/api/tasks/{id}` | Update an existing task | `{ status, assignee, dueDate, priority }` | `{ id, updatedAt, status }` | 200, 404 |
| 5 | DELETE | `/api/tasks/{id}` | Remove a task | — | `{ deleted: true }` | 200, 404 |

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification

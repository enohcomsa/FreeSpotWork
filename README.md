# @H1-group/source

Nx monorepo containing applications, shared libraries, and development tooling.

The repository currently hosts the **FreeSpot** application, including its frontend, backend, shared libraries, and end-to-end testing infrastructure.

## Repository Structure

```text
apps/
├── freespot/                  # Angular frontend
├── freespot-backend/          # Express backend API
├── freespot-e2e/              # Cypress end-to-end tests
└── freespot-backend-e2e/      # Backend integration tests

libs/
├── frontend/freespot/         # FreeSpot feature libraries
└── _free-spot-client-api/     # Generated OpenAPI TypeScript client

tools/
├── eslint/                    # Shared ESLint configuration
├── scripts/                   # Development scripts
└── seed/                      # Local E2E database seed
```

The repository is structured to support multiple applications. New applications can be added under `apps/` while reusing shared libraries from `libs/`.

---

# Prerequisites

- Node.js
- npm
- Local MongoDB (required for local E2E development)

---

# Development

## Start the FreeSpot frontend

```bash
npm run start:freespot
```

## Start the FreeSpot backend

```bash
npm run start:freespot:backend
```

## Start the backend using the local E2E database

```bash
npm run start:freespot:backend:e2e
```

---

# Local End-to-End Development

The repository contains a deterministic local E2E environment backed by a local MongoDB database.

## Start the local E2E environment

```bash
npm run start:freespot:e2e
```

This command:

- Seeds the local E2E database
- Starts the frontend
- Starts the backend using the E2E configuration

## Open Cypress

```bash
npx nx run freespot-e2e:open-cypress
```

or execute the test suite directly:

```bash
npx nx e2e freespot-e2e
```

---

# Seed Infrastructure

The local E2E database is populated using the seed modules located in:

```text
tools/seed/
├── academic.*
├── campus.*
├── activities.*
├── auth.*
├── bookings.*
├── system.seed.ts
├── context.ts
├── reset.ts
└── seed.ts
```

The seeded dataset contains:

- Academic hierarchy
- Campus (buildings, floors, and rooms)
- Timetable activities
- Test users
- Bookings
- System data

The database can also be seeded manually:

```bash
npm run seed:freespot:e2e
```

---

# Available Scripts

| Script | Description |
| -------- | ----------- |
| `npm run start:freespot` | Start the FreeSpot frontend |
| `npm run start:freespot:backend` | Start the backend using the development configuration |
| `npm run start:freespot:backend:e2e` | Start the backend using the local E2E configuration |
| `npm run start:freespot:backend:prod` | Run the production backend |
| `npm run start:freespot:e2e` | Seed the local database and start the frontend and backend for E2E development |
| `npm run build:freespot` | Build the FreeSpot frontend |
| `npm run build:freespot:backend` | Build the backend for production |
| `npm run seed:freespot:e2e` | Seed the local E2E database |
| `npm run migrate:freespot:db` | Execute MongoDB migrations |
| `npm run generate:freespot:api-client` | Regenerate the OpenAPI TypeScript client |

---

# Build

Build the frontend:

```bash
npm run build:freespot
```

Build the backend:

```bash
npm run build:freespot:backend
```

---

# Running Nx Tasks

Run a target:

```bash
npx nx <target> <project>
```

Run multiple targets:

```bash
npx nx run-many -t <target1> <target2>
```

Run multiple targets for selected projects:

```bash
npx nx run-many -t <target1> <target2> -p <project1> <project2>
```

---

# Generate a Library

```bash
npx nx generate @nx/angular:library \
  --directory=libs/frontend/freespot/my-bookings/data-access \
  --name=freespot-my-bookings-data-access \
  --publishable=true \
  --changeDetection=OnPush \
  --compilationMode=full \
  --flat=true \
  --importPath=@free-spot/my-bookings/data-access \
  --prefix=free-spot \
  --skipModule=true \
  --skipTests=true \
  --style=scss \
  --tags=platform:frontend,scope:freespot,type:data-access \
  --no-interactive
```

---

# Deployments

## Production

- Vercel: https://free-spot-work.vercel.app/

## Staging

- Netlify: https://shimmering-frangollo-07e558.netlify.app/

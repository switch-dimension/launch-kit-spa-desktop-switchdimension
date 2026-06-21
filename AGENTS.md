# AGENTS.md

## Cursor Cloud specific instructions

This is an npm-workspaces monorepo with two services plus an optional desktop shell. Standard commands live in the root `README.md` and `package.json` scripts; only the non-obvious caveats are captured here.

### Services
- `apps/web` — Vite + React SPA on port `5167` (`npm run dev:web`).
- `apps/api` — Hono API on port `3834`, backed by PostgreSQL via Drizzle (`npm run dev:api`).
- `src-tauri` — optional Tauri desktop shell (needs Rust; not set up here).

Run both web + api together with `npm run dev`. Lint with `npm run lint`, build with `npm run build` (both from repo root).

### PostgreSQL (local dev DB)
- A local PostgreSQL 16 cluster is used for development. The service is NOT auto-started on boot — start it with `sudo pg_ctlcluster 16 main start` before running the API.
- Connection used by `.env`: `postgresql://postgres:postgres@localhost:5432/launchkit` (db `launchkit`, user `postgres`/`postgres`).
- `drizzle-kit` CLI scripts (`db:push`, `db:migrate`, `db:studio`) currently fail: `apps/api/drizzle.config.ts` uses `import.meta.dirname`, which is empty under drizzle-kit's CJS bundling (`paths[0] ... must be of type string`). To create/update the schema, apply the SQL migrations directly:
  `PGPASSWORD=postgres psql -h localhost -U postgres -d launchkit -f apps/api/drizzle/0000_init.sql -f apps/api/drizzle/0001_add_todos.sql`

### Env vars must be exported into the shell before running the API
`apps/api/src/index.ts` calls `dotenv.config()` *after* its static imports, but ESM evaluates imports first — so `src/lib/db/index.ts` reads `process.env.DATABASE_URL` before `.env` is loaded and the API crashes with "DATABASE_URL environment variable is required". Load `.env` into the shell environment before starting dev servers:
```
set -a; source .env; set +a; npm run dev
```
The root `.env` is gitignored; create it from `.env.example` if missing.

### Clerk auth is required for the API and frontend to function
- `clerkMiddleware()` is applied to all `/api/*` routes, so with no/invalid keys EVERY API request (including `/api/health`) returns `500 "Publishable key not valid."`, and the web app renders a full-page "Clerk not configured" screen instead of the app.
- Set all three in the root `.env` (same `pk_test_...` value for the first two): `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`. Provide them via Cursor Secrets or the Clerk Dashboard.
- **Clerk CLI** (`npx clerk@latest`): after `clerk auth login`, run `clerk env pull` to write framework-detected env vars into `.env`, or `clerk init` to create/link an app. Requires interactive OAuth login — not usable headlessly without prior auth.
- **UI sign-up in dev** may require email verification before sign-in works. For automated E2E in this VM, create a pre-verified user via the Backend API (`POST https://api.clerk.com/v1/users` with `CLERK_SECRET_KEY`), then sign in via UI or a sign-in token.
- After updating `.env` or secrets, restart dev: `set -a; source .env; set +a; npm run dev`.

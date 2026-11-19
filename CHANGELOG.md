# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-19

Dependency refresh and security hardening.

### Security

- **Todos are now per-user.** Added a `user_id` column (migration `0002_todos_user_id`); every query is scoped to the signed-in user. Previously any signed-in user could read and modify every todo.
- **Removed `GET /api/users`**, which returned every user's email to any signed-in user. Replaced with `GET /api/me`.
- API verifies Clerk session tokens with `@clerk/backend` v3 and checks the token's authorized party against `ALLOWED_ORIGINS`.
- CORS restricted to `ALLOWED_ORIGINS` (was `*`).
- Added `secureHeaders()`, a 100 KB request body limit, Zod input validation, and a JSON error handler that doesn't leak stack traces.
- Added a Content Security Policy for the Tauri desktop build (was `null`).
- Upgraded all dependencies: `npm audit` went from 35 vulnerabilities (3 critical, 17 high) to 0 (an npm `overrides` entry moves drizzle-kit's old bundled esbuild to a patched version).
- Stopped tracking the `.neon` project file.

### Changed

- Vite 7 → 8, `@vitejs/plugin-react` 5 → 6, TypeScript 5.9 → 6.0, ESLint 9 → 10, Drizzle ORM 0.38 → 0.45, drizzle-kit 0.30 → 0.31, `@hono/node-server` 1 → 2, lucide-react 0.5x → 1.x, concurrently 9 → 10, plus minor/patch bumps across the board. Tauri crates 2.12 / CLI 2.12.
- Replaced the unmaintained `@hono/clerk-auth` (pinned to Clerk Core 2) with a small `requireAuth` middleware.
- Node.js **22.12+** is now required (Vite 8). Added `.nvmrc` (Node 24) and `engines`.
- `CLERK_PUBLISHABLE_KEY` is no longer needed. The API reuses `VITE_CLERK_PUBLISHABLE_KEY`.
- Replaced `dotenv` with Node's built-in `process.loadEnvFile`.
- Hono routes are now chained so `AppType` carries real route types. The frontend client is fully typed and the `@ts-expect-error` workarounds are gone.
- Root scripts for database and type-checking (`db:up`, `db:migrate`, `db:studio`, `typecheck`, `start`, …).

### Added

- `docker-compose.yml` for a one-command local Postgres (`npm run db:up`).
- Delete button and error messages on the Todos page; `DELETE /api/todos/:id`.
- Optional `CLERK_JWT_KEY` for networkless token verification.

## [0.1.0] - 2026-03-10

Initial release of Launch Kit SPA Desktop.

### Added

- React 19 + Vite 7 frontend with TypeScript and HMR
- Hono API server (Node runtime) with typed RPC client
- Drizzle ORM with PostgreSQL — schema, migrations, and Drizzle Studio
- Todos feature with full CRUD API routes
- Clerk authentication end-to-end — sign-in, sign-up, protected routes, JWT-secured API
- shadcn/ui (new-york style) with Tailwind CSS v4 and Lucide icons
- Sidebar layout with nav (Home, Settings) and main content area
- React Router v7 SPA routing
- Vite dev proxy (`/api` → Hono) for seamless local development
- Optional Tauri v2 desktop build wrapping the same React app
- npm workspaces monorepo (`apps/web` + `apps/api`)
- Environment configuration with `.env.example` and documented Clerk key mapping (Vite `VITE_` prefix vs Hono conventions)
- Comprehensive README with setup instructions, troubleshooting, and architecture rationale

[0.2.0]: https://github.com/switch-dimension/launch-kit-spa-desktop-switchdimension/releases/tag/v0.2.0
[0.1.0]: https://github.com/switch-dimension/launch-kit-spa-desktop-switchdimension/releases/tag/v0.1.0

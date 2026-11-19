# Project Log

## [2026-11-19] — Dependency refresh and security hardening

### Summary
Upgraded every dependency to current releases, fixed several security issues, and smoothed new-user setup. See CHANGELOG 0.2.0 for the full list. Highlights: todos are scoped per user (migration 0002), `/api/users` (leaked all emails) replaced with `/api/me`, `@hono/clerk-auth` replaced with a `requireAuth` middleware on `@clerk/backend` v3, CORS locked to `ALLOWED_ORIGINS`, Tauri CSP added, Docker Postgres via `npm run db:up`.

### Current State
[x] Working

### Next Steps
1. Verify the full sign-in flow in a browser with real Clerk keys (API auth was verified with locally signed tokens).
2. Verify the Tauri CSP in a real desktop window, especially with a Clerk production instance.
3. Optionally add Clerk webhooks to populate the (currently unused) `users` table.

### Context
- Node 22.12+ required (Vite 8). TypeScript is pinned to 6.0 because typescript-eslint doesn't support TS 7 yet. React Router stays on v7 (v8 needs Node 22.22+).
- Routes must stay chained in `apps/api/src/index.ts` for RPC types to flow to the web app.
- `npm audit` is clean. The root `overrides` entry forces `@esbuild-kit/core-utils` (pulled in by drizzle-kit) onto esbuild 0.25. Drop it once drizzle-kit stops depending on `@esbuild-kit`.

## [2026-03-10] — Clerk authentication added to starter kit

### Summary
Added end-to-end Clerk authentication to the Launch Kit SPA Desktop starter. The frontend uses `@clerk/react` with `ClerkProvider`, protected routes, sign-in/sign-up pages, and a `UserButton` in the sidebar. The API uses `@hono/clerk-auth` middleware to verify JWTs and protect `/api/todos` and `/api/users`. A `useApi()` hook sends the Clerk session token as a Bearer header on all authenticated API calls. A "Clerk not configured" setup screen guides new users when keys are missing.

### Current State
[x] Working
[ ] In progress
[ ] Blocked
[ ] Broken

### Next Steps
1. Remove the `[Clerk config]` debug logging from `apps/web/src/main.tsx` once confident the setup flow is clear (it only runs in dev, so low priority).
2. Consider associating todos with `userId` from Clerk so each user sees only their own data (extend `apps/api/src/lib/db/schema.ts` with a `userId` column).
3. Add the `CLERK_SECRET_KEY` to the deployed environment when deploying the API (Railway, Render, etc.).
4. Optionally add Clerk webhook integration to sync user data to the database (`apps/api/src/routes/` + Clerk dashboard webhook config).
5. Optionally customise the Clerk appearance to match the app's dark theme (via `appearance` prop on `ClerkProvider` or individual components).

### Context
- **Stack**: React 19, Vite 7, Hono, Drizzle + PostgreSQL, Clerk, Tailwind CSS v4, shadcn/ui, Tauri v2 (optional)
- **Key files changed**:
  - `apps/web/src/main.tsx` — ClerkProvider wrapper + "not configured" guard
  - `apps/web/src/app/routes.tsx` — `/sign-in`, `/sign-up` routes + ProtectedRoute wrapper
  - `apps/web/src/app/ProtectedRoute.tsx` — Auth guard with loading timeout
  - `apps/web/src/app/ClerkSetupRequired.tsx` — Setup instructions screen
  - `apps/web/src/pages/SignInPage.tsx` / `SignUpPage.tsx` — Clerk auth pages
  - `apps/web/src/app/layout/Sidebar.tsx` — UserButton (signed in) / sign-in links (signed out)
  - `apps/web/src/shared/lib/use-api.ts` — Authenticated API client hook
  - `apps/web/src/shared/lib/api-client.ts` — Added `createApiClient()` factory + `ApiClient` type
  - `apps/web/vite.config.ts` — Added `envDir` pointing to monorepo root so Vite reads root `.env`
  - `apps/api/src/index.ts` — Added `clerkMiddleware()` on `/api/*`
  - `apps/api/src/routes/todos.ts` — `getAuth(c)` + 401 guard
  - `apps/api/src/routes/users.ts` — `getAuth(c)` + 401 guard
  - `.env.example` — `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
  - `README.md` — Full Clerk setup docs, auth architecture, troubleshooting
- **Packages added**: `@clerk/react` (web), `@hono/clerk-auth` + `@clerk/backend` (api)
- **Environment**: `.env` must be in the **monorepo root** (not `apps/web/`). Vite reads it via `envDir: '../..'` in `vite.config.ts`. The API reads it via `dotenv/config`.
- **Known gotcha**: `tsc -b` loses the Hono client type for `useApi()` due to workspace package resolution. Three `@ts-expect-error` comments exist in `TodosPage.tsx` for this; runtime types are correct.
- **Build**: `npm run build` passes (web + API).

---

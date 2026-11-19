# 🚀 Launch Kit SPA Desktop SwitchDimension

Everything you need to ship a full-stack single-page app and optional desktop build. A modern starter for React + Vite + Hono with shadcn/ui, designed for AI-assisted refactors and deploy-anywhere flexibility.

## Tech Stack

- **Framework:** React 19 with Vite 8
- **Language:** TypeScript 6
- **Auth:** Clerk (sign-in, sign-up, protected routes, session-verified API)
- **UI Library:** shadcn/ui (new-york style) + Lucide React icons
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7 (SPA)
- **Backend:** Hono (Node runtime; portable to Cloudflare Workers, Deno, Bun)
- **Validation:** Zod (request validation that also types the client)
- **Database:** PostgreSQL with Drizzle ORM
- **Desktop (optional):** Tauri v2
- **Monorepo:** npm workspaces (`apps/web` + `apps/api`)

## Features

- ✅ **React 19 + Vite 8** — Fast SPA with HMR and simple build pipeline
- ✅ **Hono API** — Type-safe backend with RPC-style types flowing to the frontend
- ✅ **Drizzle + PostgreSQL** — Type-safe ORM with migrations and Drizzle Studio
- ✅ **One-command local database** — `npm run db:up` starts Postgres in Docker
- ✅ **Tailwind CSS v4** — Utility-first styling with a single config
- ✅ **shadcn/ui + Lucide** — Button, theme variables, `cn()` utility; add more with `npx shadcn@latest add <name>`
- ✅ **Sidebar layout** — Ready-made app shell with nav (Home, Todos, Settings) and main content area
- ✅ **Typed API client** — End-to-end types via Hono RPC; no codegen
- ✅ **Clerk authentication** — Sign-in, sign-up, protected routes; API verifies Clerk session tokens
- ✅ **Per-user data** — Example todos feature where each user only sees and edits their own rows
- ✅ **Secure defaults** — Locked-down CORS, security headers, request size limits, input validation, desktop CSP
- ✅ **Deploy anywhere** — Node runs on Railway, Render, Fly, and most hosts; same API can target Workers
- ✅ **Optional desktop** — Tauri v2 for a native shell around the same React app
- ✅ **One repo, two apps** — AI (and you) get a full view of frontend and backend; deploy together or separately

## Prerequisites

- **Node.js 22.12 or newer** (Node 24 LTS recommended; there's an `.nvmrc`, so `nvm use` works) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** — either **Docker** (easiest: `npm run db:up` starts one for you) or a hosted database (Neon, Supabase, Railway, etc.)
- **A free [Clerk](https://clerk.com) account** for authentication
- **Rust + system libraries** (only if you use Tauri) — [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

```bash
node --version   # v22.12.0 or higher
```

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> my-app
cd my-app
npm install
```

### 2. Create your `.env`

```bash
cp .env.example .env
```

The `.env` file lives in the **project root** (next to `package.json`). Both the web app and the API read it from there. Don't create one inside `apps/web/` or `apps/api/`.

### 3. Set up the database

**Option A: local Postgres in Docker (recommended for getting started)**

```bash
npm run db:up        # starts Postgres on localhost:5433 (see docker-compose.yml)
```

The default `DATABASE_URL` in `.env.example` already points at this database, so there's nothing to change.

**Option B: hosted or existing Postgres.** Paste your connection string into `DATABASE_URL` in `.env`:

- **NeonDB:** Create a project at [neon.tech](https://neon.tech) (or ask your AI agent to use the [Neon CLI](https://neon.tech/docs/reference/cli-install)) and copy the connection string.
- **Supabase:** Create a project at [supabase.com](https://supabase.com), go to **Connect**, and copy the URI connection string.
- **Local Postgres:** `postgresql://user:password@localhost:5432/your_db`

Then create the tables:

```bash
npm run db:migrate
```

### 4. Set up Clerk (authentication)

Without Clerk keys, the app shows a "Clerk not configured" screen with setup instructions.

1. Create a free account at [clerk.com](https://clerk.com) and create an application. When prompted for a framework, pick **React**.
2. In the Clerk Dashboard, open **API Keys**. The dashboard shows Next.js-style names; copy the **values** into `.env` like this:

   | Clerk Dashboard shows | Set in `.env` as |
   |---|---|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...` | `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` |
   | `CLERK_SECRET_KEY=sk_test_...` | `CLERK_SECRET_KEY=sk_test_...` |

   The `VITE_` prefix is what lets Vite expose the publishable key to the browser. The API reads the same variable, so you only set it once. If the secret key is hidden, click **Reveal** (only account Admins can see it).
3. When you deploy, add your production URL to the Clerk application's allowed origins/redirect URLs, and to `ALLOWED_ORIGINS` in the API's environment.

> **First run:** click **Sign up** to create an account. There are no users until you register one.

### 5. Run the app

```bash
npm run dev
```

- **Web app:** [http://localhost:5167](http://localhost:5167)
- **API:** [http://localhost:3834](http://localhost:3834) (try [http://localhost:3834/api/health](http://localhost:3834/api/health))

In development the web app proxies `/api` to the API, so the browser only talks to one origin.

### 6. (Optional) Run the desktop app

With Rust and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) installed:

```bash
npm run tauri
```

Tauri starts the web app and opens a native window. Build a production desktop binary with `npm run tauri:build` (see [Desktop app](#desktop-app-tauri) for production notes).

## Scripts (from repo root)

| Command | What it does |
|---------|----------------|
| `npm run dev` | Runs the web app (5167) and API (3834) together. |
| `npm run dev:web` / `npm run dev:api` | Run just one side. |
| `npm run build` | Builds the web app (`apps/web/dist`) and API (`apps/api/dist`). |
| `npm start` | Runs the built API (`node apps/api/dist/index.js`). |
| `npm run lint` | Lints the frontend. |
| `npm run typecheck` | Type-checks the API and web app. |
| `npm run db:up` / `npm run db:down` | Starts / stops the local Docker Postgres (data is kept in a Docker volume). |
| `npm run db:generate` | Generates a SQL migration from changes to the Drizzle schema. |
| `npm run db:migrate` | Applies pending migrations. |
| `npm run db:push` | Pushes the schema straight to the DB without a migration (prototyping only). |
| `npm run db:studio` | Opens Drizzle Studio. |
| `npm run tauri` | Starts the Tauri dev window (loads the app from 5167). |
| `npm run tauri:build` | Builds the desktop app. |

## Project Structure

```
├── apps/
│   ├── web/                 # Frontend SPA
│   │   ├── src/
│   │   │   ├── app/         # Layout, sidebar, route config, auth guard
│   │   │   ├── shared/      # Shared hooks and lib (e.g. API client)
│   │   │   ├── components/  # shadcn/ui components
│   │   │   └── pages/       # Route-level pages
│   │   └── ...
│   └── api/                 # Hono API
│       ├── src/
│       │   ├── routes/      # Route modules (health, todos, me)
│       │   ├── middleware/  # requireAuth (Clerk session verification)
│       │   └── lib/         # env loading, validation helper, db/ (Drizzle schema + client)
│       ├── drizzle/         # Generated SQL migrations
│       └── drizzle.config.ts
├── src-tauri/               # Tauri desktop app (optional)
├── .agents/skills/          # Agent skills (canonical path per [Cursor](https://cursor.com/docs/skills) / [Agent Skills](https://agentskills.io))
├── docker-compose.yml       # Local Postgres for development
├── package.json             # Workspaces + root scripts
└── tsconfig.base.json
```

- **`.agents/skills/`** — Project-level agent skills (each subdir has `SKILL.md`).
- **`app/`** — Shell: layout, sidebar, and routing. Change once, everything updates.
- **`features/`** (create as needed) — Domain or product features; each can own components, hooks, and state.
- **`shared/`** — Reusable UI and utilities; no imports from `features` or `pages`.
- **`pages/`** — Thin route components that compose features.

## Building for Production

```bash
npm run build
```

- **Frontend:** deploy `apps/web/dist` to any static host or CDN. Configure the host to serve `index.html` for unknown paths (SPA fallback). If the API lives on a different domain, set `VITE_API_URL` at build time.
- **API:** run `npm start` (or `node apps/api/dist/index.js`) with `DATABASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ALLOWED_ORIGINS` (your web app's URL) and `NODE_ENV=production` set in the host's environment. Run `npm run db:migrate` as part of each deploy.

You can also run both in a single Railway (or similar) container.

## Why This Stack

| Piece | Choice | Why |
|-------|--------|-----|
| **Build** | Vite | Fast dev server and builds; works the same for web and Tauri. |
| **UI** | React 19 + TypeScript | Familiar, strong ecosystem; TypeScript keeps the app and API in sync. |
| **Styling** | Tailwind CSS v4 | Utility-first, quick to refactor; one config for the whole UI. |
| **Routing** | React Router v7 | SPA routing with a simple, stable API. |
| **API** | Hono | Small, fast, type-safe; runs on Node now and can move to Cloudflare Workers, Deno, or Bun with a different adapter. |
| **Database** | Drizzle + PostgreSQL | Type-safe schema and queries; migrations via Drizzle Kit; works with any Postgres (local, Neon, Supabase, etc.). |
| **Auth** | Clerk | Hosted auth with prebuilt UI components; the API verifies session tokens with `@clerk/backend`. |
| **Types** | Hono RPC + Zod | The API exports its route types; the frontend gets a typed `api` client with no codegen. |
| **Desktop** | Tauri v2 | Same HTML/JS/CSS as the web app; small binaries and system access when you need it. |
| **UI components** | shadcn/ui | Copy-paste components (Radix primitives + Tailwind); theme via CSS variables. |
| **Icons** | Lucide React | Consistent icon set; used by shadcn and across the app. |

The repo is a **monorepo** (npm workspaces): frontend and API are separate packages so you can deploy or scale them independently, while still sharing types and running everything with one `npm run dev`.

## Opinions on the stack

I usually reach for Next.js, but I find myself building more and more single-page applications. Next is excellent at static rendering and has a rich ecosystem, but it comes with a lot of APIs and opinions. I want to refactor quickly with AI, host and store the app anywhere, and often ship a desktop build—and I don’t always need the serverless model Next optimizes for. For those cases, a lean SPA fits better.

On the **frontend**, we use React, Vite, Tailwind, and shadcn/ui. These are widely understood by AI tools and have a strong, predictable developer experience, so refactors and feature work stay fast.

On the **backend**, we use **Hono** instead of Express. Hono’s typing and design make it very well suited to working with modern AI: the codebase is easy for models to reason about, and the RPC-style types flow cleanly to the client. We run it on **Node** for maximum compatibility—Railway, Render, Fly, and almost every other host support it, so you can deploy the API wherever you like. Because Hono is runtime-agnostic, you can later move the same app to **Cloudflare Workers** (or other edges) for a very cheap, globally distributed backend if that fits your product.

Everything lives in **one repository** with two clear folders (`apps/web` and `apps/api`). You can deploy them separately—frontend to a CDN or static host, API to Node or Workers—or run both in a single Railway (or similar) container: one process serves the API, another serves the built frontend, and they talk over the network. Keeping both sides in one repo means an AI assistant has a complete view of the application and can change frontend and backend together. It also means the API can evolve into a standalone service: other clients (another app, an MCP server, or an agent) can talk to the same backend without being tied to this UI. In an agent-first world, having a first-class, deployable API that isn’t locked to a single framework is important.


## UI: shadcn/ui + Lucide

The app uses **shadcn/ui** (new-york style, Radix) and **Lucide React** for icons. Theme variables live in `apps/web/src/index.css` (dark by default; add class `light` on `<html>` for light mode).

- **Add components:** From `apps/web`, run `npx shadcn@latest add <component>` (e.g. `button`, `card`, `dialog`). Components go into `src/components/ui/`.
- **Use components:** `import { Button } from "@/components/ui/button"`.
- **Use icons:** `import { House, Settings } from "lucide-react"`.
- **`cn()` helper:** `import { cn } from "@/lib/utils"` to merge Tailwind classes.

## Authentication (Clerk)

The app ships with Clerk wired end-to-end:

- **Frontend:** `ClerkProvider` wraps the app in `main.tsx`. Routes `/sign-in` and `/sign-up` render Clerk's prebuilt components. All other routes are wrapped in a `ProtectedRoute` that redirects signed-out users to `/sign-in`. The sidebar shows a `UserButton` when signed in.
- **API:** `requireAuth` (`apps/api/src/middleware/auth.ts`) verifies the Clerk session token sent as `Authorization: Bearer <token>`, using `@clerk/backend`. It checks the token's signature, expiry, and that it was issued for one of your `ALLOWED_ORIGINS`, then exposes the user ID as `c.var.userId`. Protected routes return `401` otherwise. `/api/health` is public.
- **Authenticated API calls:** Use the `useApi()` hook from `@/shared/lib/use-api`. It returns a typed Hono RPC client that attaches the session token automatically.

Protecting a new route:

```ts
import { Hono } from 'hono';
import { requireAuth, type AuthEnv } from '../middleware/auth.js';

export const projectsRoute = new Hono<AuthEnv>()
  .use('/projects', requireAuth)
  .get('/projects', (c) => {
    const userId = c.var.userId; // always scope queries to the signed-in user
    // ...
  });
```

### Environment variables

| Variable | Used by | Required |
|----------|---------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Web app and API | Yes. Without it the app shows the setup screen. |
| `CLERK_SECRET_KEY` | API | Yes for protected routes. Without it they return `401`. |
| `CLERK_JWT_KEY` | API | Optional. PEM public key for verifying tokens without a network call. |
| `CLERK_PUBLISHABLE_KEY` | API | Optional. Overrides `VITE_CLERK_PUBLISHABLE_KEY` for the API if you deploy it separately. |
| `ALLOWED_ORIGINS` | API | Optional locally (defaults to `http://localhost:5167`). **Required in production**: your web app's URL(s). |

## Using the typed API client

The API exports its type; the frontend gets a typed client with no codegen:

```ts
// Unauthenticated client (for public routes like /api/health)
import { api } from '@/shared/lib/api-client';
const res = await api.api.health.$get();
const data = await res.json(); // { status: string }, typed
```

```ts
// Authenticated client (for protected routes; use inside React components)
import { useApi } from '@/shared/lib/use-api';

function MyComponent() {
  const api = useApi(); // attaches the Clerk session token
  // ...
  const res = await api.api.todos.$post({ json: { title: 'Ship it' } }); // input is type-checked
}
```

Add routes in `apps/api/src/routes/` and mount them in `apps/api/src/index.ts`. **Keep the `.route()` calls chained.** That chain is what carries route types into `AppType` and the frontend client. Validate inputs with the `validate()` helper (`apps/api/src/lib/validate.ts`) and a Zod schema; this also types the client's input.

## Database (Drizzle + PostgreSQL)

The API uses **Drizzle ORM** with PostgreSQL. Schema lives in `apps/api/src/lib/db/schema.ts`; the client is in `apps/api/src/lib/db/index.ts`.

- **Schema:** Edit `schema.ts` and add tables with `pgTable`, `serial`, `text`, `timestamp`, etc.
- **Migrations:** `npm run db:generate` creates a SQL migration in `apps/api/drizzle/`; review it, then `npm run db:migrate` to apply. Commit migrations to git. `npm run db:push` skips migrations and is meant for throwaway prototyping only.
- **Studio:** `npm run db:studio` opens Drizzle Studio to inspect or edit data.
- **In routes:** Import `db` from `../lib/db/index.js`. See `apps/api/src/routes/todos.ts` for a full CRUD example scoped to the signed-in user.

## Desktop app (Tauri)

The same React app runs in a Tauri window. There's no separate desktop UI. Config lives in `src-tauri/tauri.conf.json` (dev URL, build commands, icons, security).

For production desktop builds:

- **API URL:** the desktop app has no Vite proxy, so build with `VITE_API_URL` set to your deployed API, and add the desktop origins (`tauri://localhost`, and `http://tauri.localhost` on Windows) to the API's `ALLOWED_ORIGINS`.
- **Content Security Policy:** `app.security.csp` in `tauri.conf.json` allows Clerk development instances (`*.clerk.accounts.dev`) and a local API (`http://localhost:3834`). Add your Clerk production Frontend API domain (e.g. `https://clerk.yourdomain.com`) and your API URL to `script-src` / `connect-src` before shipping.
- **Clerk:** check Clerk's docs for current desktop/native support before relying on it for production desktop sign-in.

## Security notes

What the template does for you:

- Every todo query is filtered by the signed-in user's ID, so users can't read or change each other's data.
- The API only accepts Clerk session tokens issued for `ALLOWED_ORIGINS`, and CORS only allows those origins.
- Request bodies are capped at 100 KB and validated with Zod. Errors return a generic `500` without stack traces.
- Security headers via Hono's `secureHeaders()`, and a CSP for the desktop build.
- `.env` is git-ignored. Only `VITE_`-prefixed variables are exposed to the browser, so never put secrets in a `VITE_` variable.

When you build on it: scope every new query to `c.var.userId`, validate every input, and keep `ALLOWED_ORIGINS` limited to your real front-end URLs.

## Using this as a starter for new apps

1. **Clone or fork** this repo and rename it (e.g. `my-product`).
2. **Search and replace** the project name in:
   - `package.json`, `apps/web/package.json`, `apps/api/package.json` (names and workspace scripts)
   - `apps/web/index.html` (title)
   - `src-tauri/tauri.conf.json` (productName, identifier, window title)
3. **Set up `.env`**: database and Clerk keys (see [Getting Started](#getting-started)).
4. **Customize** the sidebar in `apps/web/src/app/layout/Sidebar.tsx` (nav items, branding).
5. **Add routes** in `apps/web/src/app/routes.tsx` and `apps/api/src/routes/`, and use `useApi()` for authenticated calls.
6. **Optionally remove Tauri** if you only need web: delete `src-tauri/`, drop `@tauri-apps/api` from the web app and `@tauri-apps/cli` from the root, and remove the `tauri` / `tauri:build` scripts.

## Ports

| Service | Port | Override |
|---------|------|----------|
| Web (Vite) | 5167 | `server.port` in `apps/web/vite.config.ts` |
| API (Hono) | 3834 | `PORT` in `.env` |
| Postgres (Docker) | 5433 | `ports` in `docker-compose.yml` (and `DATABASE_URL`) |

If you change the API port, update the proxy in `apps/web/vite.config.ts` too. If you change the web port, update `ALLOWED_ORIGINS`.

## Troubleshooting

**`npm install` or `npm run dev` fails with an engine or syntax error**

- Check `node --version`. You need 22.12 or newer (`nvm use` picks the right version from `.nvmrc`).

**Port already in use (EADDRINUSE)**

- Another process is using 5167 or 3834. Stop other dev servers or kill the process:
  ```bash
  lsof -ti:5167 | xargs kill
  lsof -ti:3834 | xargs kill
  ```

**"DATABASE_URL is not set" or connection refused**

- Make sure `.env` exists in the project root with `DATABASE_URL` set.
- Using Docker? Run `npm run db:up` and check `docker compose ps` shows the database as healthy.
- Then run `npm run db:migrate` so the tables exist.

**"Clerk not configured" screen**

- Set `VITE_CLERK_PUBLISHABLE_KEY` in the root `.env` to your real publishable key (starts with `pk_test_` followed by more characters).
- **Restart the dev server** after editing `.env`. Vite only reads env files at startup.
- The browser console shows a `[Clerk config]` log with what the app received.

**Todos page says the API rejected your session (401)**

- Set `CLERK_SECRET_KEY` in `.env` and restart `npm run dev`.
- Check the API terminal: it logs why a token was rejected (in development). If it mentions the authorized party, add your web app's origin to `ALLOWED_ORIGINS`.

**API types not resolving in the frontend**

- Run `npm install` from the repo root so the `@launch-kit-spa-desktop-switchdimension/api` workspace is linked.
- Make sure routes in `apps/api/src/index.ts` are mounted with chained `.route()` calls.

**Tauri dev/build fails**

- Install Rust and the platform libraries from the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) (on Linux: `libwebkit2gtk-4.1-dev`, `librsvg2-dev`, and friends).
- Make sure the web app builds: `npm run build -w @launch-kit-spa-desktop-switchdimension/web`.

## Additional resources

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/docs)
- [Tauri](https://v2.tauri.app/)
- [React Router](https://reactrouter.com/)

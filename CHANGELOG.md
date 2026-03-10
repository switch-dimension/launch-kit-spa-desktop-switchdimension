# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.0]: https://github.com/switch-dimension/launch-kit-spa-desktop-switchdimension/releases/tag/v0.1.0

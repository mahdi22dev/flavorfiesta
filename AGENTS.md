<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cut & Sear (flavorfiesta)

Recipe/guide site **cutandsear.com**. Next.js 16.2.2 + React 19 + pnpm + Cloudflare D1/R2.

## Commands

| command | what |
|---|---|
| `pnpm dev` | dev server (OpenNext Cloudflare wrapper, requires initOpenNextCloudflareForDev in next.config.mjs) |
| `pnpm build` | `next build` |
| `pnpm preview` | `opennextjs-cloudflare build && opennextjs-cloudflare preview --remote` |
| `pnpm deploy` | `opennextjs-cloudflare build && opennextjs-cloudflare deploy` |
| `pnpm lint` | ESLint 9 flat config (`eslint.config.mjs`) |

No tests exist. No typecheck-only script — errors surface during `next build`.

## Architecture

- **Stack**: Next.js App Router → `@opennextjs/cloudflare` → Cloudflare Workers. D1 for DB, R2 for asset CDN (`assets.shortinx.xyz`).
- **DB access**: `queryD1()` helper in `db/db.ts` — wraps `getCloudflareContext().env.DB_RECIPES`. Requires the wrangler D1 binding. Works locally via OpenNext dev mode.
- **Content**: recipe/guide body JSON stored on R2 CDN, fetched at request time by server API routes.
- **Images**: `cdnUrl()` helper transforms DB keys (e.g. `recipes/foo/hero-wide.webp`) to `https://assets.shortinx.xyz/<key>`.
- **Schema**: `db/recipes_shema.ts` — tables: `pillars`, `recipes`, `recipe_images`, `comments`, `newsletter`. SQLite dialect via Drizzle, but DB is D1 (not a local SQLite file).
- **Migrations**: Drizzle config (`drizzle.config.ts`) outputs to `drizzle/migrations/`, driver `d1-http` (runs against remote D1).

## Key paths

| path | purpose |
|---|---|
| `app/page.tsx` | home page — fetches featured, trending, category sections |
| `app/recipes/[slug]/page.tsx` | recipe detail (server component, fetches from internal API) |
| `app/guides/[slug]/page.tsx` | guide detail (server component, fetches from internal API) |
| `app/api/recipes/route.ts` | GET paginated recipe search |
| `app/api/recipes/[slug]/route.ts` | GET single recipe metadata + CDN JSON |
| `app/api/categories/route.ts` | GET distinct recipe categories |
| `app/api/comments/route.ts` | GET/POST/DELETE comments (no auth on DELETE) |
| `actions/comments.ts` | server action for submit/get |
| `actions/newsletter.ts` | server action for email subscribe |
| `components/` | 21 components, mix of server and client (`"use client"`) |
| `components/section/CategorySection.tsx` | category grids on home page |
| `lib/constante.tsx` | `FEATURED_CATEGORIES` array + inline SVG icons |
| `lib/types.ts` | shared TS types |

## Conventions

- **Server-first**: pages are server components by default. Client components explicitly marked `"use client"`.
- **Path alias**: `@/*` → project root (e.g. `@/db/db`, `@/components/Header`).
- **Tailwind CSS v4** — `@import "tailwindcss"` in globals.css, `@tailwindcss/postcss` plugin (v4 PostCSS plugin, not the v3 `@tailwindcss/postcss` config approach).
- **CSS theme** uses `@theme inline {}` block for CSS variable tokens.
- **Fonts**: Inter (`--font-inter`, sans) + Playfair Display (`--font-playfair`, serif). Applied by `font-sans` / `font-serif` classes.
- **ESLint**: flat config at `eslint.config.mjs`, extends `eslint-config-next/core-web-vitals` + typescript.
- **No CI/CD** in repo (no `.github/` workflows). Deployment is manual via `pnpm deploy`.

## Gotchas

- **No local SQLite file development** — D1 queries only work through OpenNext Cloudflare dev context. Run `pnpm dev` (not raw `next dev`).
- **Comments system**: submitted comments start `approved = 0`. GET only returns `approved = 1`. DELETE endpoint is unprotected.
- **Schema file has a typo**: `db/recipes_shema.ts` (shema → schema). Do not fix unless asked — existing code and migrations depend on the filename.
- **`test.ts` is throwaway debug output** (wakatime test), not real tests. No test framework is set up.
- **`scripts/.env` duplicates root `.env`** — keep them in sync if modifying env vars.
- **`.env` with secrets is already committed** — do not re-commit exposed credentials or add more secrets.

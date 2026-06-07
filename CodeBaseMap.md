Codebase Map for Cut & Sear (flavorfiesta)

Purpose
- High-level map of the project: routes, API surface, key components, database schema, and notes for maintainers.

Repository layout (important files and folders)
- app/ — Next.js App Router pages and API routes (server components by default)
  - layout.tsx — Root layout, fonts, global scripts, CookieBanner, Top loader
  - page.tsx — Home page (fetches featured, trending, categories)
  - recipes/ — Recipes list and individual recipe pages
    - page.tsx — Recipes listing (SearchClient)
    - [slug]/page.tsx — Recipe detail page (server component)
    - [slug]/print/page.tsx — Print-friendly recipe render
  - guides/ — Guides list and individual guide pages
    - page.tsx — Guides listing (GuidesList)
    - [slug]/page.tsx — Guide detail page (server component)
  - api/ — App-router API routes (Next serverless functions)
    - recipes/route.ts — GET paginated recipes/search
    - recipes/[slug]/route.ts — GET single recipe metadata + fetch JSON from CDN
    - guides/route.ts — GET list of guides (pillars)
    - guides/[slug]/route.ts — GET single guide metadata + CDN fetch
    - guides/categories/route.ts — GET distinct guide categories
    - categories/route.ts — GET distinct recipe categories
    - comments/route.ts — GET/POST/DELETE comments (with validation)

- components/ — Reusable React components (client and server components)
  - Header.tsx — site header & mobile menu (client)
  - Footer.tsx — site footer with newsletter form (client)
  - Hero.tsx, RecipeCard.tsx, ResponsiveImage.tsx, ShareButtons.tsx, etc.
  - section/CategorySection.tsx — category grid used on home page

- actions/ — server actions and helper functions used by components
  - actions.ts — sitemap generator (getDynamicSitemapEntries)
  - comments.ts — server actions for submitting/fetching comments
  - newsletter.ts — server action to subscribe emails

- db/ — database helpers and schema
  - db.ts — queryD1 helper using OpenNext Cloudflare context and D1 binding (DB_RECIPES)
  - recipes_shema.ts — Drizzle schema for pillars, recipes, recipe_images, comments, newsletter
  - seed.ts — example script to seed D1 via queryD1

- lib/ — small utilities and types
  - constante.tsx — category icons and FEATURED_CATEGORIES constant
  - types.ts — shared TypeScript types (Recipe, PaginationData)

- public/ — static assets (icons, author image)
- tmp/ and scripts/ — transient scripts and checks (S3 purge, image checks)
- open-next.config.ts, next.config.mjs — OpenNext/Cloudflare dev config and Next config
- package.json, pnpm-workspace.yaml, pnpm-lock.yaml — dependencies and scripts

Runtime & Platform
- Next.js app router (Next 16.2.2) with React 19 and TypeScript.
- Uses @opennextjs/cloudflare integrations to run on Cloudflare D1 + R2 (assets CDN: https://assets.shortinx.xyz)
- Server code uses Server Components and explicit "use server" actions where needed.

Routing and API surface
- Pages are implemented under app/ following Next App Router conventions.
- Public API endpoints live in app/api/* and return JSON via NextResponse.
- Key APIs:
  - GET /api/recipes?page&limit&search&category — paginated search
  - GET /api/recipes/:slug — returns recipe metadata merged with JSON from CDN (s3_key)
  - GET /api/guides and /api/guides/:slug — similar flow for guides (pillar JSON fetched from CDN)
  - /api/comments — GET (list), POST (create pending comment), DELETE (admin hard-delete)
  - /api/categories and /api/guides/categories — distinct categories lists

Data flow and content storage
- Metadata (recipes, pillars, recipe_images, comments) stored in Cloudflare D1 (SQLite dialect via Drizzle schema).
- Full content (rich JSON for recipes/guides) stored on an assets CDN (R2-like) and fetched by server API routes using s3_key or slug-based file lookup.
- Images are resolved by mapping DB keys to CDN URLs via cdnUrl helper (assets.shortinx.xyz).

Database schema (high level)
- pillars: hub for guides; fields: id, slug, title, description, s3_key, outline, tags, category, created_at
- recipes: core recipe metadata; fields: id, pillar_id, pillar_slug, title, slug (unique), description, s3_key, prep_time, cook_time, total_time, servings, tags, created_at
- recipe_images: optional hero/texture/flatlay URLs associated to recipe or pillar
- comments: id, recipe_slug, recipe_id, author_name, author_email, body, approved, created_at
- newsletter: id, email

Noteworthy patterns and conventions
- Server-first: pages are server components by default; client behavior limited to components with "use client".
- Defensive JSON parsing: many API routes handle D1 returning JSON strings (e.g., tags) and parse safely.
- CDN-first content: recipe/guide body content and many images are fetched from the assets CDN by the server routes; CDN failures are handled gracefully by returning metadata and empty content arrays.
- queryD1 helper centralizes D1 access and uses getCloudflareContext to support local dev via OpenNext.
- The project prefers minimal helper functions in-place instead of many cross-cutting abstractions — pragmatic and readable.

Pain points / risks / TODOs (quick list)
- Secrets/bindings: db.ts expects env.DB_RECIPES from OpenNext Cloudflare context — local dev requires wrangler/open-next config to provide this.
- No auth on admin endpoints: DELETE /api/comments is unprotected. Add auth or admin-only checks before production use.
- CDN fetch errors are returned as 200 with an error field in some routes; consider using non-200 to better signal failures to callers.
- Some file paths and image keys are normalized heuristically; edge cases may cause missing images. Consider centralizing normalization/resolution logic.
- Tests: repository has no automated tests. Add unit tests for actions and API routes where logic matters (comments validation, parsing).

Suggested next steps (options)
1. Add a short CONTRIBUTING.md describing how to run locally (wrangler/open-next, env bindings) and seed the D1 database.
2. Protect admin endpoints and add a simple migrations/seed path using drizzle migrations (drizzle/migrations present via config).
3. Add basic integration tests for APIs (comments flow) and unit tests for parsing helpers.

Files I inspected to produce this map
- app/layout.tsx, app/page.tsx, app/recipes/[slug]/page.tsx, app/guides/[slug]/page.tsx
- app/api/* (recipes, guides, categories, comments)
- db/db.ts, db/recipes_shema.ts, drizzle.config.ts
- components/Header.tsx, Footer.tsx, RecipeCard.tsx, section/CategorySection.tsx
- actions/* and lib/*

If you want, I can:
- Rename the file to REPO_MAP.md or ARCHITECTURE.md (I can pick one — REPO_MAP.md recommended).
- Create a short CONTRIBUTING.md showing how to run locally (wrangler/open-next + env vars + seeding).
- Start hardening API endpoints (add auth middleware) or add tests for the comments flow.

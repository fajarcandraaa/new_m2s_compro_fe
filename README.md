# Mind2Screen Company Profile: Frontend

Next.js 15 (App Router, TypeScript strict) for the public site (Bahasa Indonesia) and the CMS at `/admin`.
Backend: `fajarcandraaa/new_m2s_compro_be` (Go). The API contract is `docs/openapi.yaml` (contract v1.0).

## Stack
Next.js 15 · React 19 · Tailwind CSS v4 · `motion` · TanStack Query · react-hook-form + zod · Tiptap 3 ·
`openapi-typescript` + `openapi-fetch`. Fonts are loaded with `next/font` (Poppins 400/500/600).

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Development server on :3000 |
| `npm run build` | Production build (`output: 'standalone'`) |
| `npm start` | Runs the production build (`next start`) |
| `npm run lint` | ESLint (next/core-web-vitals + typescript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run gen:api` | Regenerates `src/lib/api/schema.d.ts` from `docs/openapi.yaml` |

API types are generated and never written by hand. `src/lib/api/types.ts` only re-exports aliases of
the generated `components["schemas"]`. When the contract changes (only through the PM), run
`npm run gen:api` and commit both files.

## Environment
Copy `.env.example` to `.env.local`.

| Variable | When | Purpose |
|---|---|---|
| `BACKEND_URL` | build and runtime | Internal BE origin, e.g. `http://be:8080`. The `/api/*` and `/uploads/*` rewrites are resolved **at build time**, and Server Components call it directly at runtime. |
| `REVALIDATE_SECRET` | runtime | Must match the BE. The BE sends it as `X-Revalidate-Secret` to `POST /api/revalidate`. |
| `NEXT_PUBLIC_SITE_URL` | build | Public origin used for canonical URLs, sitemap, Open Graph and the CMS SEO preview. |
| `SITE_URL` | runtime (optional) | Server-side override of the public origin (the BE compose file sets this). |

## Local development
```bash
npm ci
cp .env.example .env.local      # BACKEND_URL=http://localhost:8080, REVALIDATE_SECRET=<same as BE>
npm run dev
```
Open the site at **http://localhost:3000** (not 127.0.0.1). Next normalises loopback hosts to
`localhost` in middleware redirects, so the CMS session cookie only matches when you use `localhost`.
CMS: http://localhost:3000/admin (credentials come from the BE's `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

Without a BE you can point `BACKEND_URL` at a Prism mock of `docs/openapi.yaml`. The mock is never
part of the app.

## Architecture
- **One origin for the browser.** `next.config.ts` rewrites `/api/:path*` and `/uploads/:path*` to
  `BACKEND_URL`. Route handlers under `app/api` (only `/api/revalidate`) take precedence over the rewrite.
- **Public pages** are Server Components using `src/lib/api/public.ts`. Every fetch is tagged
  (`site`, `services`, `case-studies`, `articles`, `promos`, `testimonials`, `client-logos`) with `revalidate: 300`.
- **Revalidation:** `POST /api/revalidate` with header `X-Revalidate-Secret` and body `{"tags": ["articles"]}`.
  The special tag `"*"` revalidates every page.
- **Browser calls** use `src/lib/api/browser.ts`: same-origin `/api/v1`, `credentials: 'include'`,
  and the CSRF header `X-Requested-With: m2s-cms` on every request. `ApiRequestError` plus
  `applyFieldErrors()` map the contract's dot-path `error.fields` (`packages.0.priceValue`) onto
  react-hook-form fields.
- **The `/diskusi` lead form** posts from the browser to `/api/v1/leads`, which the BE requires for
  rate limiting by client IP. It has a hidden honeypot field `website`.
- **CMS auth:** `src/middleware.ts` redirects `/admin/*` to `/admin/login` when the `m2s_session`
  cookie is missing. The admin shell then verifies the session with `GET /api/v1/auth/me` and
  gates the menu by role. Editors never see Info Perusahaan or Pengguna. Lead edits and CSV export
  are admin-only.

### Builds without a reachable backend
`next build` must not depend on the BE, because Docker and Dokploy build before the BE is up. During the
build phase (`NEXT_PHASE=phase-production-build`) a failed API request resolves to `null`, and
pages render their empty or fallback state (company info falls back to the seed values). Those
pages are ISR pages (`revalidate = 300`) whose fetches already carry their cache tags, so they
regenerate at runtime. This happens on the first request after 5 minutes, on any CMS change (the BE
calls `/api/revalidate`), or right away if you run:
```bash
curl -X POST https://<site>/api/revalidate -H "X-Revalidate-Secret: $REVALIDATE_SECRET" \
     -H "Content-Type: application/json" -d '{"tags":["*"]}'
```
At runtime, failed requests **throw**, so ISR keeps serving the last good page and never caches an
empty one. Detail pages use `generateStaticParams`, which returns an empty list when the BE is down,
plus `dynamicParams`, so they render on first request. `/artikel` reads `?tag=` and `?page=`, so it
renders on demand, but its API calls still go through the tagged Data Cache.
`/diskusi` reads its query parameters on the client, so it stays static.

## Docker
```bash
docker build \
  --build-arg BACKEND_URL=http://be:8080 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://mindtoscreen.com \
  -t m2s-fe .
docker run -p 3000:3000 -e BACKEND_URL=http://be:8080 -e REVALIDATE_SECRET=... m2s-fe
```
The image is multi-stage on `node:22-alpine`, runs the standalone `server.js` as a non-root user
(`nextjs`, uid 1001) and has a healthcheck on `/robots.txt`. The BE repo's `docker-compose.yml`
builds this repo as the `fe` service (`context: ../new_m2s_compro_fe`).

## Dokploy
- Create an **Application** from this repo using the Dockerfile.
- Build args: `BACKEND_URL` (the BE service's internal URL on the Dokploy network, e.g.
  `http://<be-service>:8080`) and `NEXT_PUBLIC_SITE_URL` (the public domain).
- Runtime env: `BACKEND_URL` (same value), `REVALIDATE_SECRET` (same as the BE) and optionally `SITE_URL`.
- Set the BE's `FRONTEND_URL` to an origin from which the BE can reach this app, so it can call `/api/revalidate`.
- Port 3000. After the first deploy, call `/api/revalidate` with `{"tags":["*"]}` (see above), or wait 5 minutes.
- The site must be served over HTTPS in production, because the BE marks the session cookie as `Secure`.

## Project layout
```
src/app/(site)/        public pages (layout = Header + Footer + Organization JSON-LD)
src/app/admin/         CMS (login, (panel)/* screens)
src/app/api/revalidate on-demand ISR endpoint
src/components/ui      design-system primitives (Button, Tag, Field, Card, StatusBadge, Filter)
src/components/brand   BrandScreen, BrandStar, DotField, HeroVisual (motion), WaveField (canvas)
src/components/site    public components (Header, Footer, PageHero, cards, forms)
src/components/admin   CMS components (shell, dialogs, toasts, editor, uploads)
src/lib/api            generated schema, typed server/browser clients
docs/qa                Playwright screenshots used for the Figma comparison
```

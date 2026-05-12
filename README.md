# Pete Jenkins — Portfolio

Editorial portfolio for Pete Jenkins (Nottingham, UK) — photography, video, web.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Sanity (embedded Studio at `/studio`) · Vercel.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Create a Sanity project (one-time)
#    Sign up at https://sanity.io, then:
npx sanity@latest init --create-project "Pete Jenkins Portfolio" --dataset production --template clean
#    When prompted to write configs into the project, choose "no" — this repo
#    already has them. You only need the project ID + dataset name.

# 3. Configure env
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_READ_TOKEN, SANITY_API_WRITE_TOKEN
# (create tokens at https://sanity.io/manage → your project → API → Tokens)

# 4. Seed placeholder content (uploads stock images + creates sample docs)
npm run seed

# 5. Start dev server
npm run dev
```

Visit:
- **Site**: http://localhost:3000
- **Studio**: http://localhost:3000/studio

---

## Environment variables

| Variable | Required | Where to get it | If missing |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | sanity.io/manage → project → Project ID | Site/build crashes immediately |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Usually `production` | Site/build crashes immediately |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Defaults to `2025-01-01` | Falls back to default |
| `SANITY_API_READ_TOKEN` | Recommended | sanity.io/manage → API → Tokens (Viewer) | Draft mode previews fail silently — published content still works |
| `SANITY_API_WRITE_TOKEN` | Seed only | sanity.io/manage → API → Tokens (Editor) | `npm run seed` will refuse to run |
| `SANITY_PREVIEW_SECRET` | Optional | Generate any random string | Studio "Preview" buttons return 401 |
| `SANITY_REVALIDATE_SECRET` | Optional | Match the value in your Sanity webhook | Cache won't auto-invalidate on content changes; ISR still works |
| `NEXT_PUBLIC_SITE_URL` | Recommended | `https://petejenkins.uk` (or your custom domain) | OG/sitemap absolute URLs default to a placeholder |
| `RESEND_API_KEY` | Future | resend.com → API Keys | Contact form logs to console only (TODO is in `app/api/contact/route.ts`) |
| `CONTACT_TO_EMAIL` | Future | Your inbox | Same as above |

---

## Sanity content model

The Studio at `/studio` exposes four document types:

- **Site Settings** (singleton — name, tagline, hero image, headshot, about text, contact email, social links, current role text)
- **Project** (title, slug, category [photo/video/web], cover image, gallery, description rich text, year, role, client, featured boolean, externalUrl, videoUrl)
- **Journal Post** (title, slug, cover image, excerpt, body portable text, publishedAt)
- **Service** (title, description, order)

All schemas live in `sanity/schemas/`. Queries are typed in `sanity/queries.ts` + `sanity/types.ts`.

---

## Live preview (draft mode)

Editors can preview unpublished changes before publishing.

**Setup once:**
1. Set `SANITY_PREVIEW_SECRET` in `.env.local` (any random string).
2. In Sanity Studio, add a "Preview" action to your project/journal documents pointing at:
   - `https://your-domain/api/draft-mode/enable?secret=YOUR_SECRET&type=project&slug={slug.current}`
   - `https://your-domain/api/draft-mode/enable?secret=YOUR_SECRET&type=journalPost&slug={slug.current}`

**While in draft mode**, a black "Draft mode" bar shows at the top of the site. Click "Exit draft" to leave.

---

## Cache invalidation via webhook

After deploying, configure a Sanity webhook so published changes refresh the site immediately (instead of waiting for Next.js's cache to expire).

1. **manage.sanity.io** → API → Webhooks → **Add webhook**
2. URL: `https://your-domain/api/revalidate`
3. Trigger: Create / Update / Delete
4. Filter: `_type in ["project", "journalPost", "service", "siteSettings"]`
5. Projection: `{ "_type": _type }`
6. Secret: matches `SANITY_REVALIDATE_SECRET` in your Vercel env vars
7. HTTP method: POST

---

## Deploy to Vercel

```bash
# First time: link the repo
npx vercel link

# Set env vars (or paste them in the Vercel dashboard under Settings → Environment Variables)
npx vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
npx vercel env add NEXT_PUBLIC_SANITY_DATASET
# … etc

# Deploy
npx vercel --prod
```

**Don't forget:**
- Add your Vercel preview/production URL to Sanity's CORS settings (manage.sanity.io → API → CORS Origins → Allow credentials). Without this the Studio at `/studio` won't be able to read/write.
- Optional: `npm run studio:deploy` deploys the Studio to a `*.sanity.studio` subdomain too — handy if you want editors to log in without going through your live site.

---

## Useful scripts

```bash
npm run dev            # Dev server
npm run build          # Production build
npm run start          # Run production build locally
npm run lint           # Next.js lint
npm run typecheck      # TypeScript check
npm run seed           # Populate Sanity with placeholder content (idempotent)
npm run studio:deploy  # Deploy Studio to *.sanity.studio
```

---

## Project structure

```
app/
  (site)/              ← Public site routes (use Header/Footer)
    page.tsx           ← Homepage
    about/
    portfolio/
      page.tsx
      [slug]/page.tsx
    journal/
      page.tsx
      [slug]/page.tsx
    contact/
  studio/              ← Embedded Sanity Studio (no site chrome)
    [[...tool]]/page.tsx
  api/
    contact/           ← Contact form handler (Zod validation)
    draft-mode/        ← Preview enable/disable
    revalidate/        ← Sanity webhook → revalidateTag()
  sitemap.ts           ← Auto sitemap from Sanity
  robots.ts
  opengraph-image.tsx  ← Default OG image
  layout.tsx           ← Root (fonts + globals)
  globals.css          ← Theme tokens + editorial type system

components/            ← UI building blocks
sanity/
  lib/                 ← Sanity client, image, fetch helpers
  schemas/             ← Document schemas
  queries.ts           ← GROQ queries
  types.ts             ← TypeScript types matching the queries
  env.ts               ← Env var validation
sanity.config.ts       ← Studio config
sanity.cli.ts          ← Sanity CLI config
scripts/seed.ts        ← Placeholder content seeder
```

---

## License

© Pete Jenkins. All rights reserved.

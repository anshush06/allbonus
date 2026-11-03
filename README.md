# AllBonus — referral bonus apps website

Static, SEO-first site built with **Astro 7 + Tailwind 4**, edited through a
git-based admin panel (**Sveltia CMS**) at `/admin/`. Layout follows the
reference site allnewyonoapps.com (620px column, red gradient header, icon nav,
numbered app cards); design screens live in Google Stitch project
`5200100925793553032`.

## Run it

Requires Node 22 (pinned in `.nvmrc`; system Node 20 is too old).

```bash
nvm use            # switches to Node 22 for this folder
npm install
npm run dev        # http://localhost:4321  (admin: /admin/)
npm run build      # outputs static site to dist/
npm run preview    # serve dist/ locally
npx astro check    # type-check
```

## Editing content (admin panel)

Open `/admin/` and pick a sign-in method:

| Method | When |
|---|---|
| **Work with Local Repository** | Local editing in Chrome/Edge. Pick this project folder; changes are written straight to the files. Rebuild to see them. |
| **Sign In Using Access Token** | On the live site. Create a GitHub fine-grained token with *Contents: read & write* on this repo. Each save is a commit → Cloudflare rebuilds in ~1 min. |
| Sign In with GitHub | Optional one-click login; needs an OAuth app + the `sveltia-cms-auth` Cloudflare Worker. |

What you can edit:

- **Site Settings → Brand, colours, menu & footer** — name, header title, domain, logo, all colours, icon menu, floating Telegram/WhatsApp button, footer links, disclosure, GA4 ID, Search Console code.
- **Site Settings → Homepage** — title, promo strip, tab labels, content sections (Markdown), FAQ.
- **Apps** — per app: referral link & code, icon, bonus lines, tab (New/Other), position, stats row, steps, content sections, terms, FAQs, show/hide, SEO overrides.
- **Categories**, **Pages** (About, Contact, Privacy, Disclaimer), **Blog**.

The admin saves to `anshush06/allbonus` (set in `src/pages/admin/config.json.ts`).

## How it fits together

```
src/content/            ← all editable content (JSON / Markdown)
  settings/site.json    ← brand, colours, nav, domain (also feeds astro.config.mjs)
  settings/home.json    ← homepage
  apps/*.json           ← one file per app
  categories/*.json, pages/*.md, posts/*.md
src/content.config.ts   ← schema; build fails on invalid content
src/pages/admin/config.json.ts ← admin panel field definitions (keep in sync with schema)
src/lib/content.ts      ← the only place that reads content / builds URLs
src/lib/schema.ts       ← JSON-LD builders
src/lib/icons.ts        ← SVG icon set (also the admin's icon dropdown)
```

### URLs

| URL | Page |
|---|---|
| `/` | Homepage with New/Other tabs |
| `/<category>/` | Category listing (e.g. `/payments/`) |
| `/<category>/<app>/` | App detail page (e.g. `/payments/paytm/`) |
| `/go/<app>/` | Referral redirect — the **only** place a referral URL appears (noindex, blocked in robots.txt) |
| `/blog/`, `/blog/<post>/` | Guides |
| `/<page>/` | About, Contact, Privacy Policy, Disclaimer |

Categories and pages share `/<slug>/`; the build fails if two collide or use a
reserved slug (`blog`, `go`, `admin`, `images`).

### SEO built in

sitemap-index.xml, robots.txt, canonical + Open Graph + Twitter tags, unique
title/description per page (auto-generated, overridable per entry), JSON-LD
(WebSite, BreadcrumbList, FAQPage, SoftwareApplication, Article), breadcrumbs,
related-app internal links, `rel="sponsored nofollow"` on referral links.
Lighthouse mobile: Performance 99, Accessibility 95–96, Best Practices 100, SEO 100.

## Deploy

**Live now (free):** https://anshush06.github.io/allbonus/ — GitHub Pages,
repo `anshush06/allbonus`. `.github/workflows/deploy.yml` rebuilds and
redeploys on every push to `main`, including saves from `/admin/`
(~1–2 min). The workflow sets `SITE_URL`/`BASE_PATH` so links work under the
`/allbonus/` sub-folder; always link internally through `withBase()`.

### Moving to Cloudflare Pages + your own domain (later)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `dist`, env var `NODE_VERSION=22`.
4. Add your custom domain, then update **Site Settings → Website address**.
5. Add the site to Google Search Console and submit `/sitemap-index.xml`.

## Before going live

- Replace every `https://example.com/referral/...` with your real referral links.
- Replace placeholder bonus amounts with each app's **current** official offer.
- Upload real app icons (use the icon the brand provides for affiliates).
- Update the contact email in `src/content/pages/contact.md`.

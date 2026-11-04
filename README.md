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

Open `/admin/` → **Sign In with Email** → enter the admin email and password.

How it works: `functions/api/auth.ts` (a Cloudflare Pages Function at
`/api/auth`) checks the email/password and hands the CMS a fine-grained GitHub
token that only the server knows. Each save is a commit → Cloudflare rebuilds in
~1 min. The access-token option is hidden (`auth_methods: ['oauth']`).

Login settings are GitHub repo secrets (Settings → Secrets → Actions); the
deploy workflow copies them to Cloudflare on every deploy:

| Secret | Value |
|---|---|
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (use 12+ characters) |
| `ADMIN_GITHUB_TOKEN` | Fine-grained token: only repo `anshush06/allbonus`, *Contents: read & write* |

To change the password: update `ADMIN_PASSWORD`, then Actions → Deploy → *Run
workflow*. Changing the password does not sign out browsers that are already
signed in; to force that, regenerate `ADMIN_GITHUB_TOKEN`.

Local editing: on `localhost` the admin also shows **Work with Local
Repository** (Chrome/Edge). The email login only works on the live site.

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

**Live (free):** https://allbonus.pages.dev — Cloudflare Pages project `allbonus`,
repo `anshush06/allbonus`. `.github/workflows/deploy.yml` builds and deploys
with wrangler on every push to `main`, including saves from `/admin/` (~1 min).
Needs repo secrets `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit)
and `CLOUDFLARE_ACCOUNT_ID`. `public/_headers` sets long caching on `/_astro/*`
and `noindex` on `/admin/*`.

The site is served at the domain root; `withBase()` still supports a sub-folder
via the `BASE_PATH` env var if ever needed.

### Removing an app or category

Add the old URL to `public/_redirects` with a 301 to the closest live page.
Cloudflare keeps files from earlier deploys at its edge for about a week, so
without a redirect a deleted page keeps showing its old content.

### Own domain later

Cloudflare dashboard → Workers & Pages → `allbonus` → Custom domains → add it,
then update **Site Settings → Website address** and re-submit the sitemap in
Search Console.

### Google Search Console

1. Add property → URL prefix → `https://allbonus.pages.dev/`.
2. HTML tag method → paste only the `content` value into **Site Settings →
   Google Search Console verification code** → save, wait for the deploy, Verify.
3. Sitemaps → submit `sitemap-index.xml`.

## Before going live

- Replace every `https://example.com/referral/...` with your real referral links.
- Replace placeholder bonus amounts with each app's **current** official offer.
- Upload real app icons (use the icon the brand provides for affiliates).
- Update the contact email in `src/content/pages/contact.md`.

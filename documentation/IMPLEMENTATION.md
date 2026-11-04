# Implementation log

## 2026-11-03 — Initial build

**Purpose:** A fast, SEO-friendly website that promotes legal Indian apps
(Paytm, PhonePe, Google Pay, CRED, Groww, Upstox, Swiggy) through referral
links, with a layout like allnewyonoapps.com and an admin panel to edit every
text, image, colour and referral link.

**What was done**

1. **Stack** — Astro 7.4 + Tailwind 4 + @astrojs/sitemap, Node 22 via nvm
   (user-level; system default left on Node 20; `.nvmrc` pins 22 here).
2. **Design** — Google Stitch project `5200100925793553032`. First screen
   (indigo fintech) was rejected by the user; second screen follows the
   reference site's layout and colours. Implemented in `src/styles/global.css`
   with colours driven by `site.json → theme`.
   Deliberately *not* copied from the reference: fake ratings/votes, keyword
   "Queries" cloud, fake "SEO 90%" badge, gambling content.
3. **Content model** — `src/content.config.ts` (zod-validated): site, home,
   categories, apps, pages, posts. Starter content for 7 apps, 4 categories,
   4 legal pages, 1 blog post. Bonus amounts and referral URLs are placeholders.
4. **Pages** — home (tabs), category, app detail, `/go/` referral redirect,
   blog, static pages, 404, robots.txt.
5. **SEO** — canonical/OG/Twitter, JSON-LD builders in `src/lib/schema.ts`,
   breadcrumbs, sitemap (excludes /go/ and 404).
6. **Admin** — Sveltia CMS 0.257.0 at `/admin/`; config generated from code in
   `src/pages/admin/config.json.ts` so icon dropdowns match the site.
7. **Performance** — inline SVG icons (no icon font), self-hosted Inter
   (Google Fonts link was render-blocking: perf 89 → 99).

**Verified:** `astro check` 0 errors; build 26 pages; Lighthouse mobile
99 / 95–96 / 100 / 100; admin loads config (local repo, GitHub, token sign-in).

**Known trade-off:** the reference's `#ff0000` red on white fails WCAG AA
contrast (3.99:1). Kept on request; changing *Header gradient end* to `#dc2626`
in the admin fixes it.

**Open items:** real referral links, real offer amounts, app icons, domain,
Cloudflare Pages project (optional, once a domain is bought).

## 2026-11-03 — Free deployment (GitHub Pages)

**Purpose:** Put the site online for free so it can be reviewed.

**What was done:** Added base-path support (`withBase()` / `absoluteUrl()` in
`src/lib/content.ts`; every internal href goes through it) because GitHub
Pages serves under `/allbonus/`. Added `.github/workflows/deploy.yml`.
Created public repo `anshush06/allbonus`, enabled Pages (workflow build).

**Live:** https://anshush06.github.io/allbonus/ — all routes 200, 404 page works,
admin at `/admin/` (sign in with a GitHub token).

## 2026-11-03 — Moved to Cloudflare Pages

**Purpose:** GitHub Pages served the site under `/allbonus/`, where robots.txt
is not honoured and the URL is weak for SEO. Cloudflare Pages serves it at the
root of `allbonus.pages.dev` with a real robots.txt and custom headers.

**What was done:** Workflow switched to wrangler (`pages project create` on
first run, then `pages deploy dist`); `site.json → url` set to
`https://allbonus.pages.dev`; added `public/_headers`; `cred.txt` added to
`.gitignore`. GitHub Pages disabled to avoid duplicate content.

**Note:** the very first run failed with wrangler's "reading
'compatibility_date'" because the deploy ran seconds after the project was
created; a re-run succeeded. Later runs skip creation, so it does not recur.

**Verified:** all routes 200, unknown path 404, canonical/sitemap/robots use
`https://allbonus.pages.dev`, `/admin/` sends `X-Robots-Tag: noindex`.

## 2026-11-04 — Admin email + password login

**Purpose:** Editors sign in to `/admin/` with an email and password instead of
GitHub.

**What was done:**
- `functions/api/auth.ts` is a Cloudflare Pages Function at `/api/auth`. It
  shows a login form and checks email and password against secrets, using a
  constant-time compare and a 2 s delay on failure. On success it posts a
  server-held fine-grained GitHub token to the CMS through Sveltia's OAuth
  popup handshake (`authorizing:github` → `authorization:github:success:{token}`).
- In the admin config, the backend has `base_url` set to the site origin,
  `auth_endpoint: 'api/auth'` and `auth_methods: ['oauth']`, which hides the
  token sign-in.
- `public/admin/index.html` renames "Sign In with GitHub" to "Sign In with
  Email". Sveltia wraps the host name in U+2068/U+2069 marks, which are
  stripped before matching.
- The deploy workflow syncs `ADMIN_EMAIL`, `ADMIN_PASSWORD` and
  `ADMIN_GITHUB_TOKEN` from GitHub secrets to Cloudflare Pages
  (`wrangler pages secret bulk`) and fails if any is missing.

**Verified locally** (`wrangler pages dev` plus Playwright):
- The button reads "Sign In with Email" and opens the popup form.
- A wrong password is rejected with a 401 after 2 s.
- A correct login closes the popup and the CMS calls the GitHub API with the
  server-held token.
- Email matching ignores case and surrounding spaces.

**Limits:**
- One shared admin account.
- No lockout after repeated attempts; only the delay plus a strong password.
- After login the token is stored in the editor's browser until they sign out.

## 2026-11-04 — Desktop layout like the reference

**Purpose:** On a desktop browser the site should look like allnewyonoapps.com
(a wide centred page), while phones keep the mobile layout.

**What was done:**
- `.shell` max width raised from 620px to 1280px, the reference's desktop
  width. On phones the column was already full width, so mobile is unchanged.
- Fixed the bonus and info lines on app cards. The text sat directly in a
  flex row, so the icon was squashed and the text was clipped without "…".
  The text is now wrapped in `<span class="truncate">` and the icon is set to
  `shrink-0`.

**Verified:**
- Screenshots at 1440px and 390px of home, category, app and about pages.
- No horizontal scroll on any of those pages.
- `astro check` reports 0 errors.

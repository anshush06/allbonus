# Handover — 5 Nov 2026

Work moved from the server (`/home/user-code/anshu/www/demo`) to a local
computer. GitHub (`anshush06/allbonus`, branch `main`) is the only source of
truth; the server copy is a backup and can be deleted.

**New Claude session? Start with:**
> Read README.md, documentation/HANDOVER.md, documentation/PLAN.md and
> documentation/IMPLEMENTATION.md, then continue AllBonus work.

## Where things are

| Thing | Where |
|---|---|
| Live site | https://allbonus.pages.dev |
| Admin (email + password login) | https://allbonus.pages.dev/admin/ |
| Code | https://github.com/anshush06/allbonus |
| Hosting | Cloudflare Pages, project `allbonus`; deploys on every push to `main` (`.github/workflows/deploy.yml`) |
| Secrets | GitHub repo secrets only (list in the root README). Nothing secret is in git. |
| `cred.txt` | Gitignored, not on GitHub. Copy by hand if needed; never commit it. |
| Search Console | URL-prefix property `https://allbonus.pages.dev/` |

## Local setup (Windows)

1. Install Git, Node.js **22** (see `.nvmrc`) and, optionally, Claude Code.
2. `git clone https://github.com/anshush06/allbonus.git`, then `cd allbonus`
   and `npm ci`.
3. `npm run dev` → http://localhost:4321.
4. Always `git pull` before editing: admin saves commit to GitHub too.

The admin login does not work on localhost (it is a Cloudflare Pages
Function); content editors keep using the live admin.

A **full clone** is required: the sitemap reads `lastmod` from git history
and the build fails on a shallow clone.

## State on 5 Nov 2026

- Live pages: home, 2 categories (Payments, Investing), 3 apps (Paytm,
  Google Pay, Groww), 12 guides, about/contact/disclaimer/privacy. 23 URLs in
  the sitemap.
- Upstox exists but is hidden (`published: false`) until its real referral
  link is added.
- Search Console: sitemap submitted (`sitemap-index.xml` and `sitemap-0.xml`);
  status showed "Couldn't fetch" with an empty *Last read* (pending, not an
  error — Live test says "URL is available to Google"). Request indexing done
  for all 19 content URLs on 5 Nov (privacy/disclaimer left to the sitemap).
- IndexNow (Bing etc.) runs automatically after each deploy.
- First Performance data: 6 impressions, 1 click, average position ~70.
  Most queries were `site:` checks (owner and tools), not real searches.

## Open items (owner first)

| Item | Who |
|---|---|
| Re-check Sitemaps (expect *Success*, 21 pages) and Indexing → Pages around 10–12 Nov; send any "not indexed" reason to Claude | Owner |
| Buy the domain on Cloudflare Registrar. Recommended `allbonushub.com` (free on 5 Nov); avoid names with app or bank trademarks (e.g. "yono" = SBI) | Owner |
| After purchase: connect domain, move canonical/sitemap/admin `base_url`, 301 from `pages.dev`, new Search Console property, email routing | Claude |
| Add Upstox referral link, Telegram channel link, public contact email | Owner |
| 2 long-tail guides a week (check the top results first: forums/small blogs = winnable) | Owner / friend / Claude |
| Promotion: Quora/Reddit answers, WhatsApp/Telegram shares | Owner |
| Optional: separate admin login for the friend (multiple email/password pairs) — offered, not started | Claude, on request |
| GA4 — postponed by owner until there is traffic | Later |

## Rules for anyone editing content

- Legal apps only. No rummy, betting, Yono or other real-money games.
- Paste referral links exactly as the app gives them; test once on the live site.
- Write in your own words; no copied text.
- Reload the admin (Ctrl+Shift+R) before editing.
- Before deleting an app or category, add a 301 for its old URL in
  `public/_redirects` (see README).

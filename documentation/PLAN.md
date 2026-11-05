# AllBonus — project plan

Last updated: 4 Nov 2026 (evening). This is the single place for **what was agreed, what
is done, and what is next**. Technical change history is in
[IMPLEMENTATION.md](IMPLEMENTATION.md).

---

## 1. Goal

A fast, SEO-friendly **static** website that promotes **legal Indian apps**
(Paytm, PhonePe, Google Pay, CRED, Groww, Upstox, Swiggy) through referral
links. No gambling or rummy apps.

- **Design:** same layout and colours as allnewyonoapps.com (red header,
  icon menu, numbered app cards), without its fake ratings, keyword stuffing
  or gambling content.
- **Editing:** everything (texts, titles, images, colours, referral links)
  can be edited from an admin panel, with no coding.

## 2. Decisions taken

| Topic | Decision | Why |
|---|---|---|
| Framework | Astro 7 + Tailwind 4, static HTML | Fastest pages, best for SEO (Lighthouse mobile 99 / 95 / 100 / 100) |
| Hosting | Cloudflare Pages (free) | Free, fast in India, real robots.txt, custom headers |
| Code storage | GitHub repo `anshush06/allbonus` | Free; every edit is saved with full history and can be undone |
| Admin panel | Sveltia CMS at `/admin/` | Free, edits saved as files in GitHub |
| Admin login | **Email + password** (GitHub login and token login removed) | Editor never needs a GitHub account |
| GitHub token | Separate fine-grained token, **only** `allbonus`, Contents read and write | The website needs permission to save files; limited so a leak can't touch other repos |
| Address now | `https://allbonus.pages.dev` | Free; already indexed by Google |
| Final domain | **Buy a `.com` at Cloudflare** (≈ ₹1,000/year, same price every renewal) | Trust and clicks; switching early means almost no ranking to lose |
| More websites later | All **static**; same domain via subdomains, all free | Only the domain costs money (≈ ₹1,000/year in total) |
| Same-topic content | Folders on the main site (`/loans/`), **not** subdomains | Subdomains rank separately; near-copy subdomain sites look like doorway pages |
| Old GitHub Pages copy | Switched off | Avoid duplicate content in Google |

## 3. Done ✅

1. Website built: home (New/Other tabs), category pages, app pages, blog,
   About / Contact / Privacy / Disclaimer, 404.
2. **SEO:**
   - sitemap and robots.txt
   - canonical, Open Graph and Twitter tags
   - unique title and description per page
   - JSON-LD for WebSite, Breadcrumb, FAQ, SoftwareApplication and Article
   - breadcrumbs and related-app links
   - `rel="sponsored nofollow"` on referral links
3. **Referral links** all go through `/go/<app>/` (hidden from Google). Change
   a link once in the admin and it updates everywhere.
4. **Deployed** to Cloudflare Pages. Every push or admin save rebuilds the site
   in about 1 minute.
5. **Google Search Console** verified; homepage already indexed
   (`site:allbonus.pages.dev`).
6. **Admin email and password login** live. Secrets in GitHub
   (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_GITHUB_TOKEN`, `CLOUDFLARE_*`).

## 4. Next steps (in order)

| # | Task | Who | Status |
|---|---|---|---|
| 1 | Test admin login and one save (change a word, check the site after about 2 min) | You | ✅ |
| 2 | Choose a **broad** domain name (it will carry future sites too) and buy the `.com` at Cloudflare → Domain Registration; **turn on auto-renew**. Suggested `allbonushub.com` (free on 5 Nov) | You | ⏳ |
| 3 | Connect the domain; move canonical, sitemap and admin login to it; **301 redirect** `allbonus.pages.dev` to it | Claude | waiting on #2 |
| 4 | Add the new domain to Search Console (verification code, then submit `sitemap-index.xml`) | You + Claude | waiting on #3 |
| 5 | Create GA4 property, send the Measurement ID (`G-…`) | You | ⏳ |
| 6 | Add GA4 visitor stats plus a **`download_click` event per app** | Claude | ✅ code done — activates when the GA4 ID is added in Site Settings; then register custom dimension `app_name` in GA4 |
| 7 | Bonus lines rewritten from the apps' official referral terms (no unverifiable amounts); Upstox **hidden** until its referral link is added; Telegram button **off** until a channel exists; wrong `hello@allbonus.com` (someone else's domain) removed | Claude | ✅ 4 Nov |
| 7b | Add Upstox referral link, then tick *Show on website* · Telegram channel link, then enable the floating button · public contact email · app icons for Paytm/Groww | You | ⏳ |
| 7a | Unique 800+ word content for each app page; 2 long-tail blog posts; title/description lengths fixed | Claude | ✅ done 4 Nov |
| 8 | Search Console → URL Inspection → **Request indexing** for each page (about 10/day) | You | ✅ 5 Nov on `pages.dev`; repeat on the new domain after #3 |
| 9 | Promote: Telegram, WhatsApp, YouTube, Instagram, Quora answers (links from other places help ranking) | You | ongoing |
| 10 | Optional: Cloudflare Web Analytics (free visitor counts, no code) | You | optional |
| 11 | Optional: free email `contact@yourdomain.com` via Cloudflare Email Routing (forwards to Gmail) | Claude | after #2 |

## 5. Costs

| Item | Cost |
|---|---|
| `.com` domain at Cloudflare | ≈ $11 (≈ ₹950–1,000) per year, same at renewal |
| Hosting, SSL, subdomains, admin, GitHub, GA4, Search Console, email forwarding | Free |

Other registrars compared on 4 Nov 2026 (approximate, plus 18% GST):

| Registrar | 1st year | Renewal per year | Catch |
|---|---|---|---|
| GoDaddy India | ₹1 | ≈ ₹1,599 | Must buy 3 years upfront (≈ ₹3,200) |
| BigRock | ≈ ₹749 | ≈ ₹749–1,479 | Check the live price |
| Namecheap | ≈ ₹570–1,060 | ≈ ₹1,100–1,240 | Billed in USD |
| Hostinger | ≈ ₹1,499 | ≈ ₹900–1,499 | Cheap only with a hosting bundle |

`allbonus.com`, `allbonus.in` and `allbonusapps.com` are **taken**.
`allreferralapps.com`, `allbonusapp.in` and `referralbonusapps.in` were
available on 4 Nov 2026.

## 6. Limits to remember

- **Cloudflare free plan, shared by all your sites:**
  - about 100 websites
  - **500 deploys a month** (every admin save = 1 deploy)
  - 100,000 login requests a day
- **Domain expiry** takes **every** site on it offline, so keep auto-renew on.
- **GitHub token expiry** (if not "No expiration"): admin saves stop working.
  Create a new token and update `ADMIN_GITHUB_TOKEN`, then redeploy.
- **Admin login:**
  - one shared account
  - no lockout after wrong passwords (only a 2-second delay), so use a long,
    unique password
  - changing the password doesn't sign out open browsers; regenerate the
    token to force that
- **Analytics:**
  - ad blockers hide some visitors from GA4
  - clicks on your site are **not installs**; compare with each app's
    referral dashboard
- **Ranking:**
  - competitive terms like "paytm referral" take months
  - your brand name and long-tail searches come first

## 7. Useful links

- Live site: https://allbonus.pages.dev (until the new domain)
- Admin: https://allbonus.pages.dev/admin/
- Repo: https://github.com/anshush06/allbonus
- Secrets: https://github.com/anshush06/allbonus/settings/secrets/actions
- Deploy runs: https://github.com/anshush06/allbonus/actions
- Search Console: https://search.google.com/search-console
- Cloudflare: https://dash.cloudflare.com

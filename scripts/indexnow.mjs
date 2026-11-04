// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) which pages are new
// or changed in this deploy, so they recrawl them within a day or two.
//
// Usage: node scripts/indexnow.mjs <previous-sitemap.xml>
//   Compares dist/sitemap-0.xml (this build) with the sitemap that was live before
//   the deploy and submits URLs that are new or have a newer <lastmod>.
//   An empty or missing previous sitemap submits every URL.
// DRY_RUN=1 prints the request instead of sending it.
import { existsSync, readFileSync } from 'node:fs';

const KEY_FILE = 'indexnow.txt'; // served at https://<host>/indexnow.txt (public/indexnow.txt)
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const parse = (xml) =>
  new Map([...xml.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(([, loc, lastmod]) => [loc, lastmod]));

const current = parse(readFileSync('dist/sitemap-0.xml', 'utf8'));
if (!current.size) throw new Error('dist/sitemap-0.xml has no <url> entries; run the build first');

const prevPath = process.argv[2];
const previous = prevPath && existsSync(prevPath) ? parse(readFileSync(prevPath, 'utf8')) : new Map();
const urlList = [...current].filter(([loc, lastmod]) => previous.get(loc) !== lastmod).map(([loc]) => loc);

if (!urlList.length) {
  console.log('IndexNow: no new or changed pages.');
  process.exit(0);
}

const host = new URL(urlList[0]).host;
const body = { host, key: readFileSync(`public/${KEY_FILE}`, 'utf8').trim(), keyLocation: `https://${host}/${KEY_FILE}`, urlList };
console.log(`IndexNow: submitting ${urlList.length} URL(s):\n  ${urlList.join('\n  ')}`);

if (process.env.DRY_RUN) {
  console.log(JSON.stringify({ ...body, key: '<hidden>' }, null, 2));
  process.exit(0);
}

const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
// 200 = accepted, 202 = accepted while the key file is being verified.
if (res.status === 200 || res.status === 202) console.log(`IndexNow: accepted (HTTP ${res.status}).`);
else {
  console.error(`IndexNow: rejected (HTTP ${res.status}) ${await res.text()}`);
  process.exit(1);
}

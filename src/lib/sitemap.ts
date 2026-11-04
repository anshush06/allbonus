// Sitemap entries with real "last modified" dates, served by
// src/pages/sitemap-0.xml.ts. A page's lastmod is the newest of:
//   - the last git commit of each content file the page is built from
//     (every admin save is a commit, so this tracks real edits), and
//   - dates the editor sets: an app's "Offer last checked", a post's date/updated.
import { execFileSync } from 'node:child_process';
import { getEntry } from 'astro:content';
import { getApps, getCategories, getPages, getPosts, appPath, categoryPath, pagePath, postPath, absoluteUrl, type App } from './content';

export interface SitemapEntry { loc: string; lastmod: Date }

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();

let checkedHistory = false;
/** Date of the last commit that touched `file`; a file not yet committed counts as changed now. */
function committedAt(file: string | undefined): Date {
  if (!file) throw new Error('Content entry has no file path; cannot compute its sitemap date');
  if (!checkedHistory) {
    // A shallow clone gives every file the date of the latest commit, which would mark the
    // whole site as changed on every deploy. Fail loudly instead (CI: fetch-depth: 0).
    if (git('rev-parse', '--is-shallow-repository') === 'true') {
      throw new Error('Sitemap dates need full git history; this checkout is shallow (set fetch-depth: 0).');
    }
    checkedHistory = true;
  }
  const iso = git('log', '-1', '--format=%cI', '--', file);
  return iso ? new Date(iso) : new Date();
}

const newest = (...dates: Date[]) => new Date(Math.max(...dates.map((d) => d.getTime())));

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [apps, categories, pages, posts, home] = await Promise.all([
    getApps(), getCategories(), getPages(), getPosts(), getEntry('home', 'home'),
  ]);
  if (!home) throw new Error('Missing src/content/settings/home.json');

  const appDate = new Map(apps.map((app) => [app.id, newest(committedAt(app.filePath), app.data.last_verified)]));
  const datesOf = (list: App[]) => list.map((app) => appDate.get(app.id)!);
  const postDates = posts.map((post) => newest(committedAt(post.filePath), post.data.updated ?? post.data.date));

  return [
    // Home lists every app card, so an app edit changes the homepage too.
    { loc: absoluteUrl('/'), lastmod: newest(committedAt(home.filePath), ...datesOf(apps)) },
    ...categories.map((c) => ({
      loc: absoluteUrl(categoryPath(c.id)),
      lastmod: newest(committedAt(c.filePath), ...datesOf(apps.filter((a) => a.data.category.id === c.id))),
    })),
    ...apps.map((app) => ({ loc: absoluteUrl(appPath(app)), lastmod: appDate.get(app.id)! })),
    ...pages.map((p) => ({ loc: absoluteUrl(pagePath(p)), lastmod: committedAt(p.filePath) })),
    ...(posts.length ? [{ loc: absoluteUrl('/blog/'), lastmod: newest(...postDates) }] : []),
    ...posts.map((post, i) => ({ loc: absoluteUrl(postPath(post)), lastmod: postDates[i] })),
  ];
}

const escapeXml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export const xmlResponse = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });

export const urlsetXml = (entries: SitemapEntry[]) =>
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((e) => `  <url><loc>${escapeXml(e.loc)}</loc><lastmod>${e.lastmod.toISOString()}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`;

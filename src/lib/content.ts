// Single place for reading content and building URLs. Pages and components
// must use these helpers instead of calling getCollection / hand-building paths.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type App = CollectionEntry<'apps'>;
export type Category = CollectionEntry<'categories'>;
export type Page = CollectionEntry<'pages'>;
export type Post = CollectionEntry<'posts'>;

// Top-level path segments owned by fixed routes. A category or page using one
// of these would be shadowed, so the build fails loudly instead.
const RESERVED_SLUGS = new Set(['blog', 'go', 'admin', 'images', '404']);

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.json');
  return entry.data;
}

export async function getHome() {
  const entry = await getEntry('home', 'home');
  if (!entry) throw new Error('Missing src/content/settings/home.json');
  return entry.data;
}

export async function getCategories(): Promise<Category[]> {
  const all = await getCollection('categories');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getApps(): Promise<App[]> {
  const all = await getCollection('apps', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => data.published);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPages(): Promise<Page[]> {
  return getCollection('pages');
}

/** Categories and pages share the top-level /<slug>/ namespace. */
export async function assertTopLevelSlugsUnique() {
  const seen = new Map<string, string>();
  const entries = [
    ...(await getCategories()).map((c) => ['category', c.id] as const),
    ...(await getPages()).map((p) => ['page', p.id] as const),
  ];
  for (const [kind, id] of entries) {
    if (RESERVED_SLUGS.has(id)) throw new Error(`${kind} "${id}" uses a reserved URL slug`);
    if (seen.has(id)) throw new Error(`URL /${id}/ is used by both a ${seen.get(id)} and a ${kind}`);
    seen.set(id, kind);
  }
}

export const categoryPath = (categoryId: string) => `/${categoryId}/`;
export const appPath = (app: App) => `/${app.data.category.id}/${app.id}/`;
export const goPath = (app: App) => `/go/${app.id}/`;
export const postPath = (post: Post) => `/blog/${post.id}/`;
export const pagePath = (page: Page) => `/${page.id}/`;

// Site-relative paths ("/payments/paytm/") are logical; the site can be served
// under a sub-folder (GitHub Pages: /allbonus/). withBase() turns a logical path
// into a real href; external links pass through unchanged.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (href: string) => (href.startsWith('/') && !href.startsWith('//') ? BASE + href : href);

/** Full URL for canonical tags, sitemaps and JSON-LD. */
export const absoluteUrl = (path: string) => new URL(withBase(path), import.meta.env.SITE).href;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

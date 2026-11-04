// Sitemap index (the URL submitted in Search Console and listed in robots.txt).
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/content';
import { getSitemapEntries, xmlResponse } from '../lib/sitemap';

export const GET: APIRoute = async () => {
  const entries = await getSitemapEntries();
  const lastmod = new Date(Math.max(...entries.map((e) => e.lastmod.getTime()))).toISOString();
  return xmlResponse(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${absoluteUrl('/sitemap-0.xml')}</loc><lastmod>${lastmod}</lastmod></sitemap>\n</sitemapindex>\n`,
  );
};

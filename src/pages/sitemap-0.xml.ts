// All indexable pages with last-modified dates (see src/lib/sitemap.ts).
import type { APIRoute } from 'astro';
import { getSitemapEntries, urlsetXml, xmlResponse } from '../lib/sitemap';

export const GET: APIRoute = async () => xmlResponse(urlsetXml(await getSitemapEntries()));

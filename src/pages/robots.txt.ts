import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/content';

export const GET: APIRoute = async () => {
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /go/', 'Disallow: /admin/', '', `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

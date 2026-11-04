// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import site from './src/content/settings/site.json' with { type: 'json' };

// The domain comes from the admin-editable site settings. SITE_URL / BASE_PATH
// are set only by the GitHub Pages workflow, which serves the site at
// https://<user>.github.io/<repo>/ until a custom domain is connected.
export default defineConfig({
  site: process.env.SITE_URL || site.url,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  // Sitemap: src/pages/sitemap-index.xml.ts (with real last-modified dates).
});

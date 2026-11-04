// Admin panel (Sveltia CMS) configuration, served at /admin/config.json.
// Generated from code so dropdowns (icons) stay in sync with the site.
// Field names here MUST match src/content.config.ts.
import type { APIRoute } from 'astro';
import { ICON_NAMES } from '../../lib/icons';
import { absoluteUrl } from '../../lib/content';

// Set to "<github-user>/<repo>" once the repo is pushed to GitHub.
const GITHUB_REPO = 'anshush06/allbonus';

const str = (name: string, label: string, extra: object = {}) => ({ name, label, widget: 'string', ...extra });
const text = (name: string, label: string, extra: object = {}) => ({ name, label, widget: 'text', ...extra });
const mdField = (name: string, label: string) => ({ name, label, widget: 'markdown' });
const optional = { required: false };
const icon = (name = 'icon', label = 'Icon') => ({ name, label, widget: 'select', options: ICON_NAMES, default: 'info' });
const color = (name: string, label: string) => ({ name, label, widget: 'color' });
const image = (name: string, label: string) => ({ name, label, widget: 'image', required: false });
const link = [str('label', 'Label'), str('href', 'Link (e.g. /about/ or https://...)')];
const faqList = (name: string, label: string) => ({
  name, label, widget: 'list', label_singular: 'question', summary: '{{fields.question}}',
  fields: [str('question', 'Question'), text('answer', 'Answer')],
});
const sectionList = (name: string, label: string) => ({
  name, label, widget: 'list', label_singular: 'section', summary: '{{fields.title}}',
  fields: [str('title', 'Heading'), icon(), mdField('body', 'Text')],
});
const seo = {
  name: 'seo', label: 'SEO (optional — leave blank to auto-generate)', widget: 'object', collapsed: true, required: false,
  fields: [str('title', 'Google title', optional), text('description', 'Google description', optional)],
};

const buildConfig = (siteUrl: string) => ({
  backend: {
    name: 'github', repo: GITHUB_REPO, branch: 'main',
    // Email + password login served by functions/api/auth.ts (same site).
    // 'oauth' only = hide the "Sign In Using Access Token" button.
    base_url: new URL(siteUrl).origin, auth_endpoint: 'api/auth', auth_methods: ['oauth'],
  },
  // Leave empty optional fields out of saved files. Without this, an empty
  // optional object (e.g. SEO) is written as null and fails the content schema.
  output: { omit_empty_optional_fields: true },
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  site_url: siteUrl,
  collections: [
    {
      name: 'settings', label: 'Site Settings', icon: 'settings', files: [
        {
          name: 'site', label: 'Brand, colours, menu & footer', file: 'src/content/settings/site.json', format: 'json',
          fields: [
            str('name', 'Site name'),
            str('header_title', 'Header title'),
            str('url', 'Website address (https://...)'),
            text('default_description', 'Default Google description'),
            image('logo', 'Logo (square)'),
            image('og_image', 'Social share image (1200×630)'),
            {
              name: 'theme', label: 'Colours', widget: 'object', fields: [
                color('header_from', 'Header gradient start'), color('header_to', 'Header gradient end / tabs / bonus text'),
                color('accent', 'Accent (numbers, icons, links)'), color('button', 'Download button'),
                color('button_hover', 'Download button hover'), color('promo_from', 'Promo strip start'), color('promo_to', 'Promo strip end'),
              ],
            },
            { name: 'nav', label: 'Icon menu', widget: 'list', summary: '{{fields.label}}', fields: [...link, icon()] },
            {
              name: 'float_button', label: 'Floating button (Telegram/WhatsApp)', widget: 'object', fields: [
                { name: 'enabled', label: 'Show it', widget: 'boolean' }, str('label', 'Label'), str('href', 'Link'), icon(),
              ],
            },
            { name: 'footer_links', label: 'Footer links', widget: 'list', summary: '{{fields.label}}', fields: link },
            text('disclosure', 'Affiliate disclosure (footer)'),
            str('copyright', 'Copyright line'),
            str('ga4_id', 'Google Analytics 4 ID (G-XXXX)', optional),
            str('gsc_verification', 'Google Search Console verification code', optional),
          ],
        },
        {
          name: 'home', label: 'Homepage', file: 'src/content/settings/home.json', format: 'json',
          fields: [
            seo,
            str('main_title', 'Main title'),
            text('promo_text', 'Promo strip text'),
            str('list_title', 'App list heading'),
            {
              name: 'tabs', label: 'Tabs', widget: 'object', fields: [
                str('new_label', 'Tab 1 label'), icon('new_icon', 'Tab 1 icon'),
                str('other_label', 'Tab 2 label'), icon('other_icon', 'Tab 2 icon'),
              ],
            },
            str('card_button_label', 'Card button text'),
            sectionList('sections', 'Content sections below the list'),
            { name: 'faq', label: 'FAQ', widget: 'object', fields: [str('title', 'Heading'), faqList('items', 'Questions')] },
          ],
        },
      ],
    },
    {
      name: 'apps', label: 'Apps', label_singular: 'App', icon: 'apps',
      folder: 'src/content/apps', format: 'json', extension: 'json', create: true,
      identifier_field: 'name', slug: '{{slug}}',
      summary: '{{name}} — {{tab}} tab', sortable_fields: ['order', 'name'],
      fields: [
        str('name', 'App name'),
        { name: 'category', label: 'Category', widget: 'relation', collection: 'categories', value_field: '{{slug}}', search_fields: ['name'], display_fields: ['name'] },
        { name: 'tab', label: 'Homepage tab', widget: 'select', options: [{ label: 'Tab 1 (New)', value: 'new' }, { label: 'Tab 2 (Other)', value: 'other' }] },
        { name: 'order', label: 'Position (1 = top)', widget: 'number', value_type: 'int', default: 100 },
        { name: 'published', label: 'Show on website', widget: 'boolean', default: true },
        str('referral_url', 'Referral link (https://...)'),
        str('referral_code', 'Referral code (optional)', optional),
        image('icon', 'App icon (square)'),
        color('icon_color', 'Icon tile colour (used when no icon image)'),
        str('icon_text', 'Icon tile text (used when no icon image)'),
        str('bonus_line', 'Bonus line (red)'),
        str('info_line', 'Second line (black)'),
        str('download_label', 'Big download button text'),
        {
          name: 'stats', label: 'Stats row (up to 4)', widget: 'list', max: 4, summary: '{{fields.value}} {{fields.label}}',
          fields: [str('value', 'Value'), str('label', 'Label')],
        },
        text('intro', 'About the app'),
        { name: 'steps', label: 'How to claim (steps)', widget: 'list', field: str('step', 'Step') },
        sectionList('sections', 'Extra content sections'),
        { name: 'terms', label: 'Offer terms', widget: 'list', field: str('term', 'Term'), required: false },
        faqList('faqs', 'FAQs'),
        { name: 'last_verified', label: 'Offer last checked', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' },
        seo,
      ],
    },
    {
      name: 'categories', label: 'Categories', label_singular: 'Category', icon: 'category',
      folder: 'src/content/categories', format: 'json', extension: 'json', create: true,
      identifier_field: 'name', slug: '{{slug}}', summary: '{{name}}',
      fields: [str('name', 'Name'), text('description', 'Description'), { name: 'order', label: 'Position', widget: 'number', value_type: 'int', default: 100 }, seo],
    },
    {
      name: 'pages', label: 'Pages', label_singular: 'Page', icon: 'description',
      folder: 'src/content/pages', extension: 'md', format: 'frontmatter', create: true,
      identifier_field: 'title', slug: '{{slug}}', summary: '{{title}}',
      fields: [str('title', 'Title'), text('description', 'Google description'), mdField('body', 'Content')],
    },
    {
      name: 'posts', label: 'Blog', label_singular: 'Post', icon: 'article',
      folder: 'src/content/posts', extension: 'md', format: 'frontmatter', create: true,
      identifier_field: 'title', slug: '{{slug}}', summary: '{{title}} ({{date}})', sortable_fields: ['date', 'title'],
      fields: [
        str('title', 'Title'), text('description', 'Google description'),
        { name: 'date', label: 'Published', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' },
        { name: 'updated', label: 'Updated', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD', required: false },
        image('cover', 'Cover image'),
        { name: 'related_apps', label: 'Apps mentioned', widget: 'relation', collection: 'apps', value_field: '{{slug}}', search_fields: ['name'], display_fields: ['name'], multiple: true, required: false },
        { name: 'published', label: 'Published', widget: 'boolean', default: true },
        mdField('body', 'Content'),
      ],
    },
  ],
});

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(buildConfig(absoluteUrl('/')), null, 2), { headers: { 'Content-Type': 'application/json' } });
};

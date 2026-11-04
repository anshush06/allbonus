// Content model. Every editable piece of the site lives in src/content/ and is
// validated here at build time. The admin panel (public/admin/config.yml) edits
// these same files — keep the two in sync when adding a field.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICON_NAMES } from './lib/icons';

const icon = z.enum(ICON_NAMES);
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex colour like #fb3737');
const faq = z.object({ question: z.string(), answer: z.string() });
// A titled block of Markdown text, rendered as a white card.
const section = z.object({ title: z.string(), icon: icon.default('info'), body: z.string() });
// The admin writes null for an empty SEO box when the editor's tab still has the
// pre-#1 config loaded; null means "not set", same as a missing key.
const seo = z
  .object({ title: z.string().optional(), description: z.string().optional() })
  .nullish()
  .transform((v) => v ?? {});
const link = z.object({ label: z.string(), href: z.string() });

// Global settings: brand, colours, navigation, floating button, footer, analytics.
const site = defineCollection({
  loader: glob({ pattern: 'site.json', base: './src/content/settings' }),
  schema: z.object({
    name: z.string(),
    header_title: z.string(),
    url: z.url(),
    default_description: z.string(),
    logo: z.string().optional(),
    og_image: z.string().optional(),
    theme: z.object({
      header_from: hex,
      header_to: hex,
      accent: hex,
      button: hex,
      button_hover: hex,
      promo_from: hex,
      promo_to: hex,
    }),
    nav: z.array(link.extend({ icon })),
    float_button: z.object({ enabled: z.boolean(), label: z.string(), href: z.string(), icon }),
    footer_links: z.array(link),
    disclosure: z.string(),
    copyright: z.string(),
    ga4_id: z.string().optional(),
    gsc_verification: z.string().optional(),
  }),
});

// Homepage: title, promo strip, tabs, content blocks, FAQ.
const home = defineCollection({
  loader: glob({ pattern: 'home.json', base: './src/content/settings' }),
  schema: z.object({
    seo,
    main_title: z.string(),
    promo_text: z.string(),
    list_title: z.string(),
    tabs: z.object({
      new_label: z.string(),
      new_icon: icon,
      other_label: z.string(),
      other_icon: icon,
    }),
    card_button_label: z.string(),
    sections: z.array(section),
    faq: z.object({ title: z.string(), items: z.array(faq) }),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    order: z.number().default(100),
    seo,
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    category: reference('categories'),
    tab: z.enum(['new', 'other']),
    order: z.number().default(100),
    published: z.boolean().default(true),
    icon: z.string().optional(),
    icon_color: hex,
    icon_text: z.string(),
    bonus_line: z.string(),
    info_line: z.string(),
    referral_url: z.url(),
    referral_code: z.string().optional(),
    download_label: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(4),
    intro: z.string(),
    steps: z.array(z.string()),
    sections: z.array(section).default([]),
    terms: z.array(z.string()).default([]),
    faqs: z.array(faq).default([]),
    last_verified: z.coerce.date(),
    seo,
  }),
});

// About, Contact, Privacy, Disclaimer, etc.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    cover: z.string().optional(),
    related_apps: z.array(reference('apps')).default([]),
    published: z.boolean().default(true),
  }),
});

export const collections = { site, home, categories, apps, pages, posts };

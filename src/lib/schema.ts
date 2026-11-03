// JSON-LD builders (schema.org). Pages pass the results to BaseLayout's `schema` prop.
export type Crumb = { name: string; url: string };

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
});

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const websiteSchema = (name: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  url,
});

export const articleSchema = (a: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  publisher: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.headline,
  description: a.description,
  mainEntityOfPage: a.url,
  datePublished: a.datePublished.toISOString(),
  dateModified: (a.dateModified ?? a.datePublished).toISOString(),
  author: { '@type': 'Organization', name: a.publisher },
  publisher: { '@type': 'Organization', name: a.publisher },
  ...(a.image ? { image: a.image } : {}),
});

// No aggregateRating on purpose: we don't collect reviews, and invented ratings
// violate Google's structured-data policy.
export const softwareAppSchema = (a: { name: string; description: string; url: string; category: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: a.name,
  description: a.description,
  url: a.url,
  applicationCategory: a.category,
  operatingSystem: 'Android, iOS',
});

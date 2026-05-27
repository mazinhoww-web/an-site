import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurimarnogueira.com.br';

const STATIC_PAGES = [
  '',
  '/sobre',
  '/trajetoria',
  '/eventos',
  '/skills',
  '/skills/como-usar',
  '/contato',
] as const;

const EVENT_SLUGS = [
  'summit-sicredi-2026',
  'embedded-credit-cubo-itau',
  'inclusao-produtiva-segundo-voo',
] as const;

const SKILL_SLUGS = [
  'gtm-engineering',
  'gtm-automation-ai-agents',
  'metodo-jet-ski',
  'gsd2-methodology',
  'automation-data-platforms',
  'revops-gtm-strategy',
  'customer-success-operations',
  'product-management-digital',
  'agile-project-management',
  'data-engineering-senior',
  'innovation2business',
  'latam-deck-template',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_PAGES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const eventEntries = EVENT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/eventos/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const skillEntries = SKILL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/skills/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...eventEntries, ...skillEntries];
}

import type { MetadataRoute } from 'next';
import { db } from '@/db';
import { skills, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAllPalestras } from '@/lib/palestras';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurimarnogueira.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/sobre`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/palestras`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/eventos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/skills`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/skills/como-usar`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacidade`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/agora`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const publishedSkills = await db
    .select({ slug: skills.slug, updatedAt: skills.updatedAt })
    .from(skills)
    .where(eq(skills.published, true));

  const skillEntries: MetadataRoute.Sitemap = publishedSkills.map((s) => ({
    url: `${BASE_URL}/skills/${s.slug}`,
    lastModified: s.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const publishedEvents = await db
    .select({ slug: events.slug, updatedAt: events.updatedAt })
    .from(events)
    .where(eq(events.published, true));

  const eventEntries: MetadataRoute.Sitemap = publishedEvents.map((e) => ({
    url: `${BASE_URL}/eventos/${e.slug}`,
    lastModified: e.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const palestras = await getAllPalestras();

  const palestraEntries: MetadataRoute.Sitemap = palestras.map((p) => ({
    url: `${BASE_URL}/palestras/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...skillEntries, ...eventEntries, ...palestraEntries];
}

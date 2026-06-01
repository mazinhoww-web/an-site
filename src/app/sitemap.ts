import type { MetadataRoute } from 'next';
import { db } from '@/db';
import { skills, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAllPalestras } from '@/lib/palestras';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurimarnogueira.com.br';

// Gerado a pedido (nao no build): evita falha de prerender quando o banco nao
// esta disponivel no ambiente de build. Em producao roda com o DB presente.
export const dynamic = 'force-dynamic';

// Best-effort: se o banco falhar, o sitemap degrada para as paginas estaticas
// em vez de quebrar o build/deploy.
async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (error) {
    console.error('[SITEMAP] query falhou, degradando', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/sobre`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/palestras`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/eventos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/skills`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/skills/como-usar`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/imersoes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/imersoes/lovable`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/imersoes/claude`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contato`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacidade`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/agora`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const publishedSkills = await safe(() =>
    db.select({ slug: skills.slug, updatedAt: skills.updatedAt }).from(skills).where(eq(skills.published, true)),
  );

  const skillEntries: MetadataRoute.Sitemap = publishedSkills.map((s) => ({
    url: `${BASE_URL}/skills/${s.slug}`,
    lastModified: s.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const publishedEvents = await safe(() =>
    db.select({ slug: events.slug, updatedAt: events.updatedAt }).from(events).where(eq(events.published, true)),
  );

  const eventEntries: MetadataRoute.Sitemap = publishedEvents.map((e) => ({
    url: `${BASE_URL}/eventos/${e.slug}`,
    lastModified: e.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const palestras = await safe(() => getAllPalestras());

  const palestraEntries: MetadataRoute.Sitemap = palestras.map((p) => ({
    url: `${BASE_URL}/palestras/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...skillEntries, ...eventEntries, ...palestraEntries];
}

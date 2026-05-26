'use server';

import { db } from '@/db';
import { skills, news, projects, events } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

type SearchResult = {
  type: 'skill' | 'noticia' | 'projeto' | 'evento';
  title: string;
  slug: string;
  excerpt: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];
  const pattern = `%${query}%`;
  const results: SearchResult[] = [];

  try {
    const skillRows = await db.select({ name: skills.name, slug: skills.slug, description: skills.description })
      .from(skills)
      .where(sql`(${skills.name} ILIKE ${pattern} OR ${skills.description} ILIKE ${pattern}) AND ${skills.published} = true`)
      .limit(5);
    for (const r of skillRows) results.push({ type: 'skill', title: r.name, slug: `/skills/${r.slug}`, excerpt: r.description.slice(0, 120) });

    const newsRows = await db.select({ title: news.title, slug: news.slug, excerpt: news.excerpt })
      .from(news)
      .where(sql`(${news.title} ILIKE ${pattern} OR ${news.excerpt} ILIKE ${pattern}) AND ${news.status} = 'published'`)
      .limit(5);
    for (const r of newsRows) results.push({ type: 'noticia', title: r.title, slug: `/noticias/${r.slug}`, excerpt: r.excerpt.slice(0, 120) });

    const projectRows = await db.select({ title: projects.title, slug: projects.slug, summary: projects.summary })
      .from(projects)
      .where(sql`(${projects.title} ILIKE ${pattern} OR ${projects.summary} ILIKE ${pattern}) AND ${projects.isPublished} = true`)
      .limit(5);
    for (const r of projectRows) results.push({ type: 'projeto', title: r.title, slug: `/projetos/${r.slug}`, excerpt: r.summary.slice(0, 120) });

    const eventRows = await db.select({ title: events.title, slug: events.slug, topic: events.topic })
      .from(events)
      .where(sql`(${events.title} ILIKE ${pattern} OR ${events.topic} ILIKE ${pattern}) AND ${events.published} = true`)
      .limit(5);
    for (const r of eventRows) results.push({ type: 'evento', title: r.title, slug: `/eventos/${r.slug}`, excerpt: r.topic.slice(0, 120) });
  } catch {
    // DB not available
  }

  return results;
}

'use server';

import { db } from '@/db';
import { skills, events } from '@/db/schema';
import { sql } from 'drizzle-orm';

type SearchResult = {
  type: 'skill' | 'evento';
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

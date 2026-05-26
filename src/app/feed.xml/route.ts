import { db } from '@/db';
import { news } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurimarnogueira.com.br';

  let items: (typeof news.$inferSelect)[] = [];
  try {
    items = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.publishedAt)).limit(20);
  } catch {
    // DB not available
  }

  const rssItems = items.map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${siteUrl}/noticias/${item.slug}</link>
      <description><![CDATA[${item.excerpt}]]></description>
      <pubDate>${item.publishedAt ? new Date(item.publishedAt).toUTCString() : ''}</pubDate>
      <guid isPermaLink="true">${siteUrl}/noticias/${item.slug}</guid>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AN. Aurimar Nogueira</title>
    <link>${siteUrl}</link>
    <description>Loyalty, fintech e inovação aplicada em ecossistemas regulados.</description>
    <language>pt-BR</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

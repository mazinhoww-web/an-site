export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurimarnogueira.com.br';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AN. Aurimar Nogueira</title>
    <link>${siteUrl}</link>
    <description>Loyalty, fintech e inovação aplicada em ecossistemas regulados.</description>
    <language>pt-BR</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

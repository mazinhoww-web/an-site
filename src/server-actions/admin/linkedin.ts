'use server';

import { db } from '@/db';
import { news, linkedinPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

type ActionResult = { success: boolean; error?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function postToLinkedIn(newsId: string): Promise<ActionResult> {
  await requireAdmin();

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    return { success: false, error: 'LinkedIn não configurado (LINKEDIN_ACCESS_TOKEN e LINKEDIN_PERSON_URN)' };
  }

  try {
    const rows = await db.select().from(news).where(eq(news.id, newsId)).limit(1);
    const item = rows[0];
    if (!item) return { success: false, error: 'Notícia não encontrada' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurimarnogueira.com.br';
    const postUrl = `${siteUrl}/noticias/${item.slug}`;

    const body = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `${item.title}\n\n${item.excerpt}\n\n${postUrl}`,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              originalUrl: postUrl,
              title: { text: item.title },
              description: { text: item.excerpt },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('LinkedIn API error:', err);
      return { success: false, error: `LinkedIn API: ${res.status}` };
    }

    const data = await res.json();

    await db.insert(linkedinPosts).values({
      newsId,
      linkedinPostId: data.id ?? null,
      status: 'posted',
      postedAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error('LinkedIn post error:', err);
    return { success: false, error: 'Erro ao publicar no LinkedIn' };
  }
}

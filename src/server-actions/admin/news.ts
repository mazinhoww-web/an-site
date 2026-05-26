'use server';

import { db } from '@/db';
import { news } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { newsSchema } from '@/lib/validators/news';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string; id?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function createNews(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    contentMd: formData.get('contentMd'),
    status: formData.get('status') || 'draft',
    imageUrl: formData.get('imageUrl') || undefined,
  };

  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const result = await db.insert(news).values({
      ...parsed.data,
      publishedAt: parsed.data.status === 'published' ? new Date() : null,
    }).returning({ id: news.id });

    revalidatePath('/noticias');
    revalidatePath('/admin/noticias');
    return { success: true, id: result[0]?.id };
  } catch (err) {
    console.error('Create news error:', err);
    return { success: false, error: 'Erro ao criar notícia' };
  }
}

export async function updateNews(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    contentMd: formData.get('contentMd'),
    status: formData.get('status') || 'draft',
    imageUrl: formData.get('imageUrl') || undefined,
  };

  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await db.update(news).set({
      ...parsed.data,
      publishedAt: parsed.data.status === 'published' ? new Date() : null,
    }).where(eq(news.id, id));

    revalidatePath('/noticias');
    revalidatePath('/admin/noticias');
    return { success: true };
  } catch (err) {
    console.error('Update news error:', err);
    return { success: false, error: 'Erro ao atualizar notícia' };
  }
}

export async function deleteNews(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(news).where(eq(news.id, id));
    revalidatePath('/noticias');
    revalidatePath('/admin/noticias');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao deletar notícia' };
  }
}

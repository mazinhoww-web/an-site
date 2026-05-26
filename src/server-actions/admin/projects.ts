'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { projectSchema } from '@/lib/validators/project';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string; id?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const tagsRaw = formData.get('tags') as string;
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    contentMd: formData.get('contentMd') || undefined,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
    year: formData.get('year') ? Number(formData.get('year')) : undefined,
    externalUrl: formData.get('externalUrl') || '',
    imageUrl: formData.get('imageUrl') || undefined,
    isFeatured: formData.get('isFeatured') === 'true',
    isPublished: formData.get('isPublished') === 'true',
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const result = await db.insert(projects).values({
      ...parsed.data,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    }).returning({ id: projects.id });

    revalidatePath('/projetos');
    revalidatePath('/admin/projetos');
    return { success: true, id: result[0]?.id };
  } catch (err) {
    console.error('Create project error:', err);
    return { success: false, error: 'Erro ao criar projeto' };
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const tagsRaw = formData.get('tags') as string;
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    contentMd: formData.get('contentMd') || undefined,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
    year: formData.get('year') ? Number(formData.get('year')) : undefined,
    externalUrl: formData.get('externalUrl') || '',
    imageUrl: formData.get('imageUrl') || undefined,
    isFeatured: formData.get('isFeatured') === 'true',
    isPublished: formData.get('isPublished') === 'true',
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await db.update(projects).set({
      ...parsed.data,
      publishedAt: parsed.data.isPublished ? new Date() : null,
      updatedAt: new Date(),
    }).where(eq(projects.id, id));

    revalidatePath('/projetos');
    revalidatePath('/admin/projetos');
    return { success: true };
  } catch (err) {
    console.error('Update project error:', err);
    return { success: false, error: 'Erro ao atualizar projeto' };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/projetos');
    revalidatePath('/admin/projetos');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao deletar projeto' };
  }
}

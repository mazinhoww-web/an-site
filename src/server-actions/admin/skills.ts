'use server';

import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { skillSchema } from '@/lib/validators/skill';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string; id?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function createSkill(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    category: formData.get('category'),
    version: formData.get('version') || '1.0.0',
    published: formData.get('published') === 'true',
  };

  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const file = formData.get('file') as File | null;
    let blobUrl = '';

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Arquivo máximo: 5MB' };
      const blob = await put(`skills/${parsed.data.slug}.skill`, file, { access: 'public' });
      blobUrl = blob.url;
    }

    const result = await db.insert(skills).values({
      ...parsed.data,
      blobUrl,
    }).returning({ id: skills.id });

    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    return { success: true, id: result[0]?.id };
  } catch (err) {
    console.error('Create skill error:', err);
    return { success: false, error: 'Erro ao criar skill' };
  }
}

export async function updateSkill(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    category: formData.get('category'),
    version: formData.get('version') || '1.0.0',
    published: formData.get('published') === 'true',
  };

  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const file = formData.get('file') as File | null;
    const updateData: Record<string, unknown> = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Arquivo máximo: 5MB' };
      const blob = await put(`skills/${parsed.data.slug}.skill`, file, { access: 'public' });
      updateData.blobUrl = blob.url;
    }

    await db.update(skills).set(updateData).where(eq(skills.id, id));
    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (err) {
    console.error('Update skill error:', err);
    return { success: false, error: 'Erro ao atualizar skill' };
  }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(skills).where(eq(skills.id, id));
    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (err) {
    console.error('Delete skill error:', err);
    return { success: false, error: 'Erro ao deletar skill' };
  }
}

export async function toggleSkillPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.update(skills).set({ published }).where(eq(skills.id, id));
    revalidatePath('/skills');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao alterar visibilidade' };
  }
}

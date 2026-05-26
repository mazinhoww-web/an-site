'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { eventSchema } from '@/lib/validators/event';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: boolean; error?: string; id?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const tagsRaw = formData.get('tags') as string;
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    eventType: formData.get('eventType'),
    role: formData.get('role'),
    topic: formData.get('topic'),
    descriptionShort: formData.get('descriptionShort'),
    descriptionMd: formData.get('descriptionMd') || undefined,
    eventDate: formData.get('eventDate'),
    city: formData.get('city') || undefined,
    state: formData.get('state') || undefined,
    organizer: formData.get('organizer'),
    audienceSize: formData.get('audienceSize') ? Number(formData.get('audienceSize')) : undefined,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
    published: formData.get('published') === 'true',
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const result = await db.insert(events).values({
      ...parsed.data,
      eventDate: new Date(parsed.data.eventDate),
      tags: parsed.data.tags,
    }).returning({ id: events.id });

    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
    return { success: true, id: result[0]?.id };
  } catch (err) {
    console.error('Create event error:', err);
    return { success: false, error: 'Erro ao criar evento' };
  }
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const tagsRaw = formData.get('tags') as string;
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    eventType: formData.get('eventType'),
    role: formData.get('role'),
    topic: formData.get('topic'),
    descriptionShort: formData.get('descriptionShort'),
    descriptionMd: formData.get('descriptionMd') || undefined,
    eventDate: formData.get('eventDate'),
    city: formData.get('city') || undefined,
    state: formData.get('state') || undefined,
    organizer: formData.get('organizer'),
    audienceSize: formData.get('audienceSize') ? Number(formData.get('audienceSize')) : undefined,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
    published: formData.get('published') === 'true',
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await db.update(events).set({
      ...parsed.data,
      eventDate: new Date(parsed.data.eventDate),
      tags: parsed.data.tags,
      updatedAt: new Date(),
    }).where(eq(events.id, id));

    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
    return { success: true };
  } catch (err) {
    console.error('Update event error:', err);
    return { success: false, error: 'Erro ao atualizar evento' };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao deletar evento' };
  }
}

'use server';

import { db } from '@/db';
import { subscribers, contacts } from '@/db/schema';
import { eq, sql, desc, like, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

type ActionResult = { success: boolean; error?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Não autorizado');
}

export async function getSubscribers(filter?: string, search?: string) {
  await requireAdmin();

  const conditions = [];
  if (filter === 'confirmed') conditions.push(eq(subscribers.confirmed, true));
  if (filter === 'unconfirmed') conditions.push(eq(subscribers.confirmed, false));
  if (search) conditions.push(like(subscribers.email, `%${search}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(subscribers).where(where).orderBy(desc(subscribers.createdAt));
}

export async function exportSubscribersCsv(): Promise<string> {
  await requireAdmin();
  const rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));

  const header = 'email,nome,newsletter,confirmado,fonte,criado_em';
  const lines = rows.map(r =>
    `${r.email},${r.name ?? ''},${r.consentNewsletter ? 'sim' : 'não'},${r.confirmed ? 'sim' : 'não'},${r.source ?? ''},${r.createdAt?.toISOString() ?? ''}`,
  );

  return [header, ...lines].join('\n');
}

export async function softDeleteSubscriber(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.update(subscribers).set({
      email: `deleted_${id}@removed.local`,
      name: null,
      phone: null,
      confirmed: false,
      consentNewsletter: false,
      consentWhatsapp: false,
    }).where(eq(subscribers.id, id));
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao apagar dados' };
  }
}

export async function getContacts() {
  await requireAdmin();
  return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function markContactRead(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.update(contacts).set({ status: 'read' }).where(eq(contacts.id, id));
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Erro ao marcar como lido' };
  }
}

export async function getDashboardStats() {
  await requireAdmin();
  const [subsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers).where(eq(subscribers.confirmed, true));
  const [downloadsCount] = await db.select({ count: sql<number>`coalesce(sum(downloads),0)::int` }).from(sql`skills`);
  const [unreadCount] = await db.select({ count: sql<number>`count(*)::int` }).from(contacts).where(eq(contacts.status, 'new'));

  return {
    subscribers: subsCount?.count ?? 0,
    downloads: downloadsCount?.count ?? 0,
    unreadMessages: unreadCount?.count ?? 0,
  };
}

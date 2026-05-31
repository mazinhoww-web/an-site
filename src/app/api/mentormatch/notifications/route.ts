import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmNotification } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { mmNotificationPatchSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

// GET — current user's notifications (newest first, capped).
export async function GET() {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const rows = await db
    .select()
    .from(mmNotification)
    .where(eq(mmNotification.userId, user.id))
    .orderBy(desc(mmNotification.createdAt))
    .limit(50);
  return NextResponse.json(rows);
}

// PATCH — mark one ({id}) or all ({all:true}) of the user's notifications read.
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmNotificationPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  try {
    if (parsed.data.all) {
      await db
        .update(mmNotification)
        .set({ read: true })
        .where(eq(mmNotification.userId, user.id));
    } else {
      await db
        .update(mmNotification)
        .set({ read: true })
        .where(and(eq(mmNotification.id, parsed.data.id!), eq(mmNotification.userId, user.id)));
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'notifications#PATCH', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

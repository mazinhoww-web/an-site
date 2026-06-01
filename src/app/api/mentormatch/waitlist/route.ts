import { NextResponse } from 'next/server';
import { and, asc, eq, gt, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { mmUser, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { runSerializable } from '@/lib/mentormatch/tx';
import { mmWaitlistDeleteSchema, mmWaitlistReorderSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// GET — the mentor's own waitlist, ordered, enriched with mentee basics.
export async function GET() {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const entries = await db
    .select()
    .from(mmWaitlistEntry)
    .where(eq(mmWaitlistEntry.mentorId, user.id))
    .orderBy(asc(mmWaitlistEntry.position));

  const menteeIds = entries.map((e) => e.menteeId);
  const mentees = menteeIds.length
    ? await db.select().from(mmUser).where(inArray(mmUser.id, menteeIds))
    : [];
  const byId = new Map(mentees.map((m) => [m.id, m]));

  const result = entries.map((e) => {
    const m = byId.get(e.menteeId);
    return {
      id: e.id,
      position: e.position,
      mentee: m ? { id: m.id, name: m.name, headline: m.headline, image: m.image } : null,
    };
  });
  return NextResponse.json(result);
}

// PATCH — reorder (R8: only the owning mentor). Validates every entry belongs
// to the caller before applying positions, atomically.
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmWaitlistReorderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { entries } = parsed.data;

  try {
    const result = await runSerializable<{ status: number; body: unknown }>(async (tx) => {
      const ids = entries.map((e) => e.id);
      const owned = await tx.select().from(mmWaitlistEntry).where(inArray(mmWaitlistEntry.id, ids));
      if (owned.length !== ids.length || owned.some((e) => e.mentorId !== user.id)) {
        return { status: 403, body: { error: 'Entradas de outro mentor' } };
      }
      for (const e of entries) {
        await tx
          .update(mmWaitlistEntry)
          .set({ position: e.position })
          .where(eq(mmWaitlistEntry.id, e.id));
      }
      return { status: 200, body: { ok: true } };
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    alert5xx('waitlist#PATCH', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE — remove (R9: owning mentor OR the mentee themselves); keep positions
// contiguous afterwards (R7).
export async function DELETE(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmWaitlistDeleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { id } = parsed.data;

  try {
    const result = await runSerializable<{ status: number; body: unknown }>(async (tx) => {
      const rows = await tx.select().from(mmWaitlistEntry).where(eq(mmWaitlistEntry.id, id)).limit(1);
      const entry = rows[0];
      if (!entry) return { status: 404, body: { error: 'Entrada nao encontrada' } };
      if (entry.mentorId !== user.id && entry.menteeId !== user.id) {
        return { status: 403, body: { error: 'Sem permissao' } };
      }
      await tx.delete(mmWaitlistEntry).where(eq(mmWaitlistEntry.id, id));
      await tx
        .update(mmWaitlistEntry)
        .set({ position: sql`${mmWaitlistEntry.position} - 1` })
        .where(and(eq(mmWaitlistEntry.mentorId, entry.mentorId), gt(mmWaitlistEntry.position, entry.position)));
      return { status: 200, body: { ok: true } };
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    alert5xx('waitlist#DELETE', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

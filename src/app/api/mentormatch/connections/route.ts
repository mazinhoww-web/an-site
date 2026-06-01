import { NextResponse } from 'next/server';
import { and, asc, desc, eq, gt, inArray, or, sql } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { runSerializable } from '@/lib/mentormatch/tx';
import { createNotification, type MmTx } from '@/lib/mentormatch/notifications';
import { mmConnectionRequestSchema, mmConnectionRespondSchema } from '@/lib/mentormatch/validators';
import {
  emailMenteeAccepted,
  emailMenteeRejected,
  emailMenteeWaitlistPromoted,
  emailMentorNewRequest,
} from '@/lib/mentormatch/notify-email';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

type ApiResult = { status: number; body: unknown };

// R6/R7: when a slot frees (REJECT/COMPLETE/CANCEL), pull the first waitlist
// entry into a PENDING connection, notify the mentee, remove the entry and
// keep the remaining positions contiguous.
async function promoteFromWaitlist(tx: MmTx, mentorId: string, tenantId: string): Promise<string | null> {
  const first = await tx
    .select()
    .from(mmWaitlistEntry)
    .where(eq(mmWaitlistEntry.mentorId, mentorId))
    .orderBy(asc(mmWaitlistEntry.position))
    .limit(1);
  const entry = first[0];
  if (!entry) return null;

  await tx.insert(mmConnection).values({
    mentorId,
    menteeId: entry.menteeId,
    tenantId,
    status: 'PENDING',
    message: 'Promovido da lista de espera',
  });
  await createNotification(
    {
      userId: entry.menteeId,
      tenantId,
      type: 'WAITLIST_PROMOTED',
      title: 'Voce foi promovido da fila',
      message: 'Um mentor abriu uma vaga e sua solicitacao avancou.',
      metadata: { mentorId },
    },
    tx,
  );
  await tx.delete(mmWaitlistEntry).where(eq(mmWaitlistEntry.id, entry.id));
  await tx
    .update(mmWaitlistEntry)
    .set({ position: sql`${mmWaitlistEntry.position} - 1` })
    .where(and(eq(mmWaitlistEntry.mentorId, mentorId), gt(mmWaitlistEntry.position, entry.position)));
  return entry.menteeId;
}

// GET — connections of the current user (as mentor or mentee). ?status filter.
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const status = new URL(req.url).searchParams.get('status');
  const mine = or(eq(mmConnection.mentorId, user.id), eq(mmConnection.menteeId, user.id));
  const where = status ? and(mine, eq(mmConnection.status, status)) : mine;

  const rows = await db
    .select()
    .from(mmConnection)
    .where(where)
    .orderBy(desc(mmConnection.createdAt));
  return NextResponse.json(rows);
}

// POST — request mentorship (single path; R1/R2/R3/R10). Serializable (D-09).
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  if (user.role !== 'MENTEE' || user.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Apenas mentees aprovados podem solicitar' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mmConnectionRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { mentorId, message } = parsed.data;
  const post: { fn: (() => Promise<void>) | null } = { fn: null };

  try {
    const result = await runSerializable<ApiResult>(async (tx) => {
      const mentorRows = await tx.select().from(mmUser).where(eq(mmUser.id, mentorId)).limit(1);
      const mentor = mentorRows[0];
      if (!mentor || mentor.role !== 'MENTOR' || mentor.status !== 'APPROVED' || !mentor.tenantId) {
        return { status: 404, body: { error: 'Mentor nao encontrado' } };
      }
      if (mentor.tenantId !== user.tenantId) {
        return { status: 403, body: { error: 'Mentor de outro tenant' } };
      }

      // R3 — anti-duplicate.
      const dup = await tx
        .select()
        .from(mmConnection)
        .where(
          and(
            eq(mmConnection.mentorId, mentorId),
            eq(mmConnection.menteeId, user.id),
            inArray(mmConnection.status, ['PENDING', 'ACCEPTED']),
          ),
        )
        .limit(1);
      if (dup[0]) return { status: 409, body: { error: 'Ja existe uma solicitacao ativa' } };

      const wl = await tx
        .select()
        .from(mmWaitlistEntry)
        .where(and(eq(mmWaitlistEntry.mentorId, mentorId), eq(mmWaitlistEntry.menteeId, user.id)))
        .limit(1);
      if (wl[0]) return { status: 409, body: { error: 'Voce ja esta na fila deste mentor' } };

      // R1 — capacity (per-mentor limit).
      const accepted = await tx.$count(
        mmConnection,
        and(eq(mmConnection.mentorId, mentorId), eq(mmConnection.status, 'ACCEPTED')),
      );
      const limit = mentor.maxMentees;

      if (accepted < limit) {
        const inserted = await tx
          .insert(mmConnection)
          .values({ mentorId, menteeId: user.id, tenantId: mentor.tenantId, status: 'PENDING', message })
          .returning();
        await createNotification(
          {
            userId: mentorId,
            tenantId: mentor.tenantId,
            type: 'CONNECTION_REQUEST',
            title: 'Nova solicitacao de mentoria',
            message: `${user.name ?? 'Um mentee'} solicitou mentoria.`,
            metadata: { connectionId: inserted[0]!.id },
          },
          tx,
        );
        const reqTenantId = mentor.tenantId;
        const menteeName = user.name;
        post.fn = () => emailMentorNewRequest(mentorId, reqTenantId, menteeName);
        return { status: 201, body: { connection: inserted[0] } };
      }

      // R2 — full: append to waitlist.
      const last = await tx
        .select()
        .from(mmWaitlistEntry)
        .where(eq(mmWaitlistEntry.mentorId, mentorId))
        .orderBy(desc(mmWaitlistEntry.position))
        .limit(1);
      const position = (last[0]?.position ?? 0) + 1;
      await tx.insert(mmWaitlistEntry).values({ mentorId, menteeId: user.id, position });
      return { status: 201, body: { waitlisted: true, position } };
    });

    if (result.status < 300 && post.fn) await post.fn().catch(() => {});
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    alert5xx('connections#POST', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PATCH — respond (ACCEPTED/REJECTED, mentor only) or finish (COMPLETED/
// CANCELLED, either party). Single path; R4/R5/R6/R10. Serializable (D-09).
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmConnectionRespondSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { connectionId, status } = parsed.data;
  const post: { jobs: (() => Promise<void>)[] } = { jobs: [] };

  try {
    const result = await runSerializable<ApiResult>(async (tx) => {
      const rows = await tx.select().from(mmConnection).where(eq(mmConnection.id, connectionId)).limit(1);
      const conn = rows[0];
      if (!conn) return { status: 404, body: { error: 'Conexao nao encontrada' } };

      if (status === 'ACCEPTED' || status === 'REJECTED') {
        if (conn.mentorId !== user.id) {
          return { status: 403, body: { error: 'Apenas o mentor responde' } }; // R5
        }
        if (status === 'ACCEPTED') {
          // R4 — recheck capacity.
          const accepted = await tx.$count(
            mmConnection,
            and(eq(mmConnection.mentorId, conn.mentorId), eq(mmConnection.status, 'ACCEPTED')),
          );
          if (accepted >= user.maxMentees) {
            return { status: 409, body: { error: 'Capacidade maxima atingida' } };
          }
          await tx
            .update(mmConnection)
            .set({ status: 'ACCEPTED', startedAt: new Date(), updatedAt: new Date() })
            .where(eq(mmConnection.id, connectionId));
          await createNotification(
            {
              userId: conn.menteeId,
              tenantId: conn.tenantId,
              type: 'CONNECTION_ACCEPTED',
              title: 'Mentoria aceita',
              message: 'Sua solicitacao de mentoria foi aceita.',
              metadata: { connectionId },
            },
            tx,
          );
          post.jobs.push(() => emailMenteeAccepted(conn.menteeId, conn.tenantId));
          return { status: 200, body: { ok: true } };
        }
        // REJECTED
        await tx
          .update(mmConnection)
          .set({ status: 'REJECTED', updatedAt: new Date() })
          .where(eq(mmConnection.id, connectionId));
        await createNotification(
          {
            userId: conn.menteeId,
            tenantId: conn.tenantId,
            type: 'CONNECTION_REJECTED',
            title: 'Mentoria recusada',
            message: 'Sua solicitacao de mentoria foi recusada.',
            metadata: { connectionId },
          },
          tx,
        );
        post.jobs.push(() => emailMenteeRejected(conn.menteeId, conn.tenantId));
        const promotedR = await promoteFromWaitlist(tx, conn.mentorId, conn.tenantId); // R6
        if (promotedR) post.jobs.push(() => emailMenteeWaitlistPromoted(promotedR, conn.tenantId));
        return { status: 200, body: { ok: true } };
      }

      // COMPLETED | CANCELLED — either party.
      if (conn.mentorId !== user.id && conn.menteeId !== user.id) {
        return { status: 403, body: { error: 'Sem permissao' } };
      }
      await tx
        .update(mmConnection)
        .set({ status, endedAt: new Date(), updatedAt: new Date() })
        .where(eq(mmConnection.id, connectionId));
      const promotedC = await promoteFromWaitlist(tx, conn.mentorId, conn.tenantId); // R6
      if (promotedC) post.jobs.push(() => emailMenteeWaitlistPromoted(promotedC, conn.tenantId));
      return { status: 200, body: { ok: true } };
    });

    if (result.status < 300) for (const j of post.jobs) await j().catch(() => {});
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    alert5xx('connections#PATCH', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

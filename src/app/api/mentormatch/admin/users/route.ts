import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import {
  mmConnection,
  mmInvitation,
  mmLibraryItem,
  mmNotification,
  mmTenant,
  mmUser,
  mmUserSkill,
  mmWaitlistEntry,
} from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { runSerializable } from '@/lib/mentormatch/tx';
import { createNotification } from '@/lib/mentormatch/notifications';
import { sendAccountApprovedEmail } from '@/lib/mentormatch/email';
import { mmUserDeleteSchema, mmUserStatusPatchSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

// GET ?tenantId&status?&q? — users of a tenant (ADMIN/SUPER).
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const params = new URL(req.url).searchParams;
  const tenantId = params.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  const status = params.get('status');
  const q = params.get('q')?.trim();
  const conditions = [eq(mmUser.tenantId, tenantId)];
  if (status) conditions.push(eq(mmUser.status, status));
  if (q) {
    const like = `%${q}%`;
    const text = or(ilike(mmUser.name, like), ilike(mmUser.email, like));
    if (text) conditions.push(text);
  }
  const rows = await db
    .select()
    .from(mmUser)
    .where(and(...conditions))
    .orderBy(desc(mmUser.createdAt));
  return NextResponse.json(
    rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    })),
  );
}

// PATCH {userId,status} — approve/reject/suspend (R14). On APPROVED: email +
// notification. Cross-tenant edits are blocked (D-06/D-07).
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmUserStatusPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { userId, status } = parsed.data;

  try {
    const rows = await db.select().from(mmUser).where(eq(mmUser.id, userId)).limit(1);
    const target = rows[0];
    if (!target || !target.tenantId) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });
    if (!canAdminTenant(user, target.tenantId)) {
      return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
    }

    const tenantRows = await db.select().from(mmTenant).where(eq(mmTenant.id, target.tenantId)).limit(1);
    const tenantName = tenantRows[0]?.name ?? 'MentorMatch';

    await runSerializable(async (tx) => {
      await tx.update(mmUser).set({ status, updatedAt: new Date() }).where(eq(mmUser.id, userId));
      if (status === 'APPROVED') {
        await createNotification(
          {
            userId,
            tenantId: target.tenantId!,
            type: 'ACCOUNT_APPROVED',
            title: 'Conta aprovada',
            message: `Sua conta em ${tenantName} foi aprovada.`,
          },
          tx,
        );
      }
    });

    if (status === 'APPROVED') {
      await sendAccountApprovedEmail(target.email, target.name, tenantName);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'admin/users#PATCH', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE {userId,tenantId} — exclusao definitiva do usuario (direito ao
// esquecimento, LGPD). Admin do tenant (ou SUPER). Remove em transacao todas as
// dependencias (conexoes, fila, notificacoes, skills) e anonimiza a autoria de
// material/convites (set null), entao apaga o usuario. Cross-tenant bloqueado.
export async function DELETE(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmUserDeleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { userId, tenantId } = parsed.data;

  if (!canAdminTenant(user, tenantId)) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }
  if (userId === user.id) {
    return NextResponse.json({ error: 'Nao e possivel excluir a propria conta aqui' }, { status: 400 });
  }

  try {
    const rows = await db.select().from(mmUser).where(eq(mmUser.id, userId)).limit(1);
    const target = rows[0];
    if (!target || target.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });
    }

    await runSerializable(async (tx) => {
      // Conexoes e fila onde o usuario aparece como mentor OU mentorado.
      await tx
        .delete(mmConnection)
        .where(or(eq(mmConnection.mentorId, userId), eq(mmConnection.menteeId, userId)));
      await tx
        .delete(mmWaitlistEntry)
        .where(or(eq(mmWaitlistEntry.mentorId, userId), eq(mmWaitlistEntry.menteeId, userId)));
      // Notificacoes e skills do usuario (FK cascade tambem cobre, mas explicito).
      await tx.delete(mmNotification).where(eq(mmNotification.userId, userId));
      await tx.delete(mmUserSkill).where(eq(mmUserSkill.userId, userId));
      // Anonimiza autoria preservando o conteudo do tenant (FKs nullable).
      await tx.update(mmLibraryItem).set({ uploadedById: null }).where(eq(mmLibraryItem.uploadedById, userId));
      await tx.update(mmInvitation).set({ invitedById: null }).where(eq(mmInvitation.invitedById, userId));
      // Finalmente, o usuario.
      await tx.delete(mmUser).where(eq(mmUser.id, userId));
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'admin/users#DELETE', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

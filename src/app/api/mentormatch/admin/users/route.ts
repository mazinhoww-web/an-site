import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { runSerializable } from '@/lib/mentormatch/tx';
import { createNotification } from '@/lib/mentormatch/notifications';
import { sendAccountApprovedEmail } from '@/lib/mentormatch/email';
import { mmUserStatusPatchSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

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
    alert5xx('admin/users#PATCH', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

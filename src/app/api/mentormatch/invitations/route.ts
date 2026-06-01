import { NextResponse } from 'next/server';
import { and, desc, eq, gt } from 'drizzle-orm';
import { db } from '@/db';
import { mmInvitation, mmTenant } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { sendInvitationEmail } from '@/lib/mentormatch/email';
import { mmInvitationCreateSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// GET ?tenantId — invitations of a tenant (ADMIN/SUPER).
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  const rows = await db
    .select()
    .from(mmInvitation)
    .where(eq(mmInvitation.tenantId, tenantId))
    .orderBy(desc(mmInvitation.createdAt));
  return NextResponse.json(
    rows.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      used: i.used,
      expiresAt: i.expiresAt,
      expired: i.expiresAt.getTime() < Date.now(),
    })),
  );
}

// POST {email,role,tenantId?} — create invitation (R15). No duplicate pending.
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmInvitationCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  const tenantId = parsed.data.tenantId ?? user.tenantId;
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  const email = parsed.data.email.toLowerCase();

  try {
    const dup = await db
      .select()
      .from(mmInvitation)
      .where(
        and(
          eq(mmInvitation.email, email),
          eq(mmInvitation.tenantId, tenantId),
          eq(mmInvitation.used, false),
          gt(mmInvitation.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (dup[0]) return NextResponse.json({ error: 'Convite pendente ja existe' }, { status: 409 });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS);
    const inserted = await db
      .insert(mmInvitation)
      .values({ email, tenantId, role: parsed.data.role, token, expiresAt, invitedById: user.id })
      .returning();

    const tenantRows = await db.select().from(mmTenant).where(eq(mmTenant.id, tenantId)).limit(1);
    await sendInvitationEmail(email, token, tenantRows[0]?.name ?? 'MentorMatch', parsed.data.role);

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    alert5xx('invitations#POST', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE ?id — revoke an invitation (ADMIN/SUPER of its tenant).
export async function DELETE(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });

  const rows = await db.select().from(mmInvitation).where(eq(mmInvitation.id, id)).limit(1);
  const invite = rows[0];
  if (!invite) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });
  if (!canAdminTenant(user, invite.tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  await db.delete(mmInvitation).where(eq(mmInvitation.id, id));
  return NextResponse.json({ ok: true });
}

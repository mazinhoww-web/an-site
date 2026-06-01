import { NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmInvitation, mmUser } from '@/lib/mentormatch/db/schema';
import { runSerializable } from '@/lib/mentormatch/tx';
import { rateLimit } from '@/lib/rate-limit';
import { mmRegisterSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

const BCRYPT_COST = 10;

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd ? fwd.split(',')[0]!.trim() : 'unknown';
}

// Public registration (R11).
// - With a valid invitation (exists, !used, !expired, email matches): the user
//   is created APPROVED with the invite's role + tenantId, and the invite is
//   marked used (atomic). Conflict checked by (email, invite.tenantId) — D-05.
// - Without an invitation: PENDING, no role/tenant; conflict by (email, tenantId
//   IS NULL). Tenant is assigned later at complete-profile.
export async function POST(req: Request) {
  try {
    await rateLimit(`mm-register:${clientIp(req)}`, 10, 600);
  } catch {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mmRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  }
  const { name, password, invitationToken } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const hash = await bcrypt.hash(password, BCRYPT_COST);

    if (invitationToken) {
      const inviteRows = await db
        .select()
        .from(mmInvitation)
        .where(eq(mmInvitation.token, invitationToken))
        .limit(1);
      const invite = inviteRows[0];
      if (
        !invite ||
        invite.used ||
        invite.expiresAt.getTime() < Date.now() ||
        invite.email.toLowerCase() !== email
      ) {
        return NextResponse.json({ error: 'Convite invalido' }, { status: 400 });
      }

      const dup = await db
        .select()
        .from(mmUser)
        .where(and(eq(mmUser.email, email), eq(mmUser.tenantId, invite.tenantId)))
        .limit(1);
      if (dup[0]) return NextResponse.json({ error: 'Email ja cadastrado' }, { status: 409 });

      const user = await runSerializable(async (tx) => {
        const inserted = await tx
          .insert(mmUser)
          .values({
            name,
            email,
            password: hash,
            status: 'APPROVED',
            role: invite.role,
            tenantId: invite.tenantId,
          })
          .returning();
        await tx.update(mmInvitation).set({ used: true }).where(eq(mmInvitation.id, invite.id));
        return inserted[0]!;
      });
      return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
    }

    // No invitation.
    const existing = await db
      .select()
      .from(mmUser)
      .where(and(eq(mmUser.email, email), isNull(mmUser.tenantId)))
      .limit(1);
    if (existing[0]) {
      return NextResponse.json({ error: 'Email ja cadastrado' }, { status: 409 });
    }
    const inserted = await db
      .insert(mmUser)
      .values({ name, email, password: hash, status: 'PENDING' })
      .returning();
    const user = inserted[0]!;
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    alert5xx('auth/register', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

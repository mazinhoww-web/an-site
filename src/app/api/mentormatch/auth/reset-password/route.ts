import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmUser, mmVerificationToken } from '@/lib/mentormatch/db/schema';
import { mmResetPasswordSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

const BCRYPT_COST = 10;

// POST {token,password} — consumes a reset token (R18). Expired → delete + 400.
// identifier holds the userId (set by forgot-password).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = mmResetPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  try {
    const rows = await db
      .select()
      .from(mmVerificationToken)
      .where(eq(mmVerificationToken.token, parsed.data.token))
      .limit(1);
    const vt = rows[0];
    if (!vt) return NextResponse.json({ error: 'Token invalido' }, { status: 400 });

    if (vt.expires.getTime() < Date.now()) {
      await db.delete(mmVerificationToken).where(eq(mmVerificationToken.id, vt.id));
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 });
    }

    const hash = await bcrypt.hash(parsed.data.password, BCRYPT_COST);
    await db.update(mmUser).set({ password: hash, updatedAt: new Date() }).where(eq(mmUser.id, vt.identifier));
    await db.delete(mmVerificationToken).where(eq(mmVerificationToken.id, vt.id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'auth/reset-password', error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

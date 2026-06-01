import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { rateLimit } from '@/lib/rate-limit';
import { mmChangePasswordSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

const BCRYPT_COST = 10;

// POST — troca a senha do usuario logado (R19 / D023.8). Confere a senha atual
// (hash) antes de trocar. Rate-limit por usuario. A sessao e JWT, entao o
// proprio cookie continua valido; o login seguinte ja usa a nova senha.
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  if (!user.password) {
    return NextResponse.json({ error: 'Conta sem senha definida' }, { status: 400 });
  }

  try {
    await rateLimit(`mm-pwd:${user.id}`, 5, 900);
  } catch {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mmChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dados invalidos' }, { status: 400 });
  }
  const { currentPassword, newPassword } = parsed.data;

  try {
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });

    const hash = await bcrypt.hash(newPassword, BCRYPT_COST);
    await db.update(mmUser).set({ password: hash, updatedAt: new Date() }).where(eq(mmUser.id, user.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    alert5xx('users/me/password#POST', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

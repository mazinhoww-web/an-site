import { NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmUser } from '@/lib/mentormatch/db/schema';
import { mmRegisterSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

const BCRYPT_COST = 10;

// Public registration. No invitation flow yet (Fase 12): the user is created
// PENDING with no role/tenant; the tenant is assigned at complete-profile.
// Conflict is checked by (email, tenantId IS NULL) — NOT email-global (D-05),
// so the same email can still onboard into different tenants later.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = mmRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  }
  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await db
      .select()
      .from(mmUser)
      .where(and(eq(mmUser.email, email), isNull(mmUser.tenantId)))
      .limit(1);
    if (existing[0]) {
      return NextResponse.json({ error: 'Email ja cadastrado' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, BCRYPT_COST);
    const inserted = await db
      .insert(mmUser)
      .values({ name, email, password: hash, status: 'PENDING' })
      .returning();
    const user = inserted[0]!;
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'auth/register', error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

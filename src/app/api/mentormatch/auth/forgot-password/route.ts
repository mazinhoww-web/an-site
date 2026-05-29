import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant, mmUser, mmVerificationToken } from '@/lib/mentormatch/db/schema';
import { sendPasswordResetEmail } from '@/lib/mentormatch/email';
import { mmForgotPasswordSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

const RESET_TTL_MS = 60 * 60 * 1000; // 60 min

// POST {email} — ALWAYS 200 (never reveals whether the email exists). Scopes to
// a tenant via the mm-tenant cookie when present (email is unique per tenant —
// D-05); the reset token's identifier is the userId (unambiguous on reset).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = mmForgotPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true }); // do not reveal

  const email = parsed.data.email.toLowerCase();
  try {
    const jar = await cookies();
    const slug = jar.get('mm-tenant')?.value;

    let user;
    if (slug) {
      const t = await db.select().from(mmTenant).where(eq(mmTenant.slug, slug)).limit(1);
      if (t[0]) {
        const rows = await db
          .select()
          .from(mmUser)
          .where(and(eq(mmUser.email, email), eq(mmUser.tenantId, t[0].id)))
          .limit(1);
        user = rows[0];
      }
    }
    if (!user) {
      const rows = await db.select().from(mmUser).where(eq(mmUser.email, email)).limit(1);
      user = rows[0];
    }

    if (user) {
      const token = crypto.randomUUID();
      await db
        .insert(mmVerificationToken)
        .values({ identifier: user.id, token, expires: new Date(Date.now() + RESET_TTL_MS) });
      await sendPasswordResetEmail(user.email, token);
    }
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'auth/forgot-password', error });
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmInvitation } from '@/lib/mentormatch/db/schema';

export const dynamic = 'force-dynamic';

// GET — validate an invitation token (public; used by the register page to
// pre-fill and confirm). Returns { valid } and, if valid, email/role/tenantId.
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const rows = await db.select().from(mmInvitation).where(eq(mmInvitation.token, params.token)).limit(1);
  const invite = rows[0];
  if (!invite || invite.used || invite.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({
    valid: true,
    email: invite.email,
    role: invite.role,
    tenantId: invite.tenantId,
  });
}

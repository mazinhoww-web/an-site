import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmInvitation } from '@/lib/mentormatch/db/schema';

export const dynamic = 'force-dynamic';

// GET — validate an invitation token (public). LGPD/hardening: endpoint publico
// nao expoe PII nem dados internos. Retorna apenas { valid }; e, quando valido,
// o `role` (nao-PII) para a UI exibir "convidado como X". Email e tenantId NAO
// sao retornados (um link vazado nao deve revelar o email do convidado nem o id
// interno do tenant). O cadastro casa email/tenant server-side no register.
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const rows = await db.select().from(mmInvitation).where(eq(mmInvitation.token, params.token)).limit(1);
  const invite = rows[0];
  if (!invite || invite.used || invite.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true, role: invite.role });
}

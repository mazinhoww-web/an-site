import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmSkill, mmUser } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { toCsv } from '@/lib/mentormatch/csv';

export const dynamic = 'force-dynamic';

// GET ?type=users|connections|skills&tenantId — CSV export (ADMIN/SUPER), BOM included.
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const params = new URL(req.url).searchParams;
  const tenantId = params.get('tenantId');
  const type = params.get('type');
  if (!tenantId || !type) return NextResponse.json({ error: 'Parametros obrigatorios' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  let csv: string;
  if (type === 'users') {
    const rows = await db.select().from(mmUser).where(eq(mmUser.tenantId, tenantId));
    csv = toCsv(
      ['id', 'name', 'email', 'role', 'status', 'createdAt'],
      rows.map((r) => [r.id, r.name ?? '', r.email, r.role ?? '', r.status, r.createdAt?.toISOString() ?? '']),
    );
  } else if (type === 'connections') {
    const rows = await db.select().from(mmConnection).where(eq(mmConnection.tenantId, tenantId));
    csv = toCsv(
      ['id', 'mentorId', 'menteeId', 'status', 'createdAt'],
      rows.map((r) => [r.id, r.mentorId, r.menteeId, r.status, r.createdAt?.toISOString() ?? '']),
    );
  } else if (type === 'skills') {
    const rows = await db.select().from(mmSkill).where(eq(mmSkill.tenantId, tenantId));
    csv = toCsv(
      ['id', 'name', 'category', 'usageCount', 'isActive'],
      rows.map((r) => [r.id, r.name, r.category ?? '', r.usageCount, r.isActive ? 'true' : 'false']),
    );
  } else {
    return NextResponse.json({ error: 'type invalido' }, { status: 400 });
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mentormatch-${type}.csv"`,
    },
  });
}

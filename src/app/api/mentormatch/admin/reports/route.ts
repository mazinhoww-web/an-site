import { NextResponse } from 'next/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmSkill, mmUser, mmUserSkill } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';

export const dynamic = 'force-dynamic';

// GET ?tenantId — tenant metrics (ADMIN/SUPER). Aggregations done in JS over
// full-row selects to avoid partial-select inference issues.
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  const users = await db.select().from(mmUser).where(eq(mmUser.tenantId, tenantId));
  const connections = await db.select().from(mmConnection).where(eq(mmConnection.tenantId, tenantId));

  const totalUsers = users.length;
  const totalMentors = users.filter((u) => u.role === 'MENTOR').length;
  const totalMentees = users.filter((u) => u.role === 'MENTEE').length;
  const activeConnections = connections.filter((c) => c.status === 'ACCEPTED').length;

  // Connections per month (last 6 months, YYYY-MM).
  const now = new Date();
  const buckets: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, count: 0 });
  }
  const bucketByMonth = new Map(buckets.map((b) => [b.month, b]));
  for (const c of connections) {
    if (!c.createdAt) continue;
    const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, '0')}`;
    const b = bucketByMonth.get(key);
    if (b) b.count += 1;
  }

  // Acceptance rate (accepted / responded).
  const responded = connections.filter((c) => ['ACCEPTED', 'REJECTED'].includes(c.status)).length;
  const acceptanceRate = responded > 0 ? Math.round((activeConnections / responded) * 100) : 0;

  // Top teaching skills in this tenant.
  const tenantSkills = await db.select().from(mmSkill).where(eq(mmSkill.tenantId, tenantId));
  const skillIds = tenantSkills.map((s) => s.id);
  const links = skillIds.length
    ? await db
        .select()
        .from(mmUserSkill)
        .where(and(inArray(mmUserSkill.skillId, skillIds), eq(mmUserSkill.isTeaching, true)))
    : [];
  const countBySkill = new Map<string, number>();
  for (const l of links) countBySkill.set(l.skillId, (countBySkill.get(l.skillId) ?? 0) + 1);
  const topSkills = tenantSkills
    .map((s) => ({ name: s.name, count: countBySkill.get(s.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return NextResponse.json({
    totalUsers,
    totalMentors,
    totalMentees,
    activeConnections,
    connectionsByMonth: buckets,
    acceptanceRate,
    topSkills,
  });
}

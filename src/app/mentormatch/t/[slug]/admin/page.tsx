import { notFound } from 'next/navigation';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { AdminDashboardView, type AdminMetric } from '@/components/mentormatch/admin/AdminDashboardView';

export const dynamic = 'force-dynamic';

// Metricas do programa (D021 item 6). Guard ADMIN/SUPER vem do layout.
export default async function AdminDashboardPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  const users = await db.select().from(mmUser).where(eq(mmUser.tenantId, tenant.id));
  const connections = await db.select().from(mmConnection).where(eq(mmConnection.tenantId, tenant.id));

  const mentors = users.filter((u) => u.role === 'MENTOR' && u.status === 'APPROVED');
  const acceptedByMentor = new Map<string, number>();
  for (const c of connections) {
    if (c.status === 'ACCEPTED') acceptedByMentor.set(c.mentorId, (acceptedByMentor.get(c.mentorId) ?? 0) + 1);
  }
  const mentorsAvailable = mentors.filter((m) => (acceptedByMentor.get(m.id) ?? 0) < m.maxMentees).length;
  const mentorsFull = mentors.length - mentorsAvailable;

  const mentorIds = mentors.map((m) => m.id);
  const waitlistTotal = mentorIds.length
    ? (await db.select().from(mmWaitlistEntry).where(inArray(mmWaitlistEntry.mentorId, mentorIds))).length
    : 0;

  const metrics: AdminMetric[] = [
    { key: 'activeUsers', label: 'Usuarios ativos', value: users.filter((u) => u.status === 'APPROVED').length },
    { key: 'requestsSent', label: 'Solicitacoes enviadas', value: connections.length },
    { key: 'matchesAccepted', label: 'Matches aceitos', value: connections.filter((c) => c.status === 'ACCEPTED').length },
    { key: 'mentorsAvailable', label: 'Mentores disponiveis', value: mentorsAvailable },
    { key: 'mentorsFull', label: 'Mentores lotados', value: mentorsFull },
    { key: 'waitlist', label: 'Na fila de espera', value: waitlistTotal },
  ];

  return <AdminDashboardView tenantId={tenant.id} brandColor={tenant.brandColor} theme={theme} metrics={metrics} />;
}

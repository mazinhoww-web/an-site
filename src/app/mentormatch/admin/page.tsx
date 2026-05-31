import { db } from '@/db';
import { mmConnection, mmPlan } from '@/lib/mentormatch/db/schema';
import { getTenantsOverview } from '@/lib/mentormatch/admin-stats';
import { SuperAdminView } from '@/components/mentormatch/admin/SuperAdminView';

export const dynamic = 'force-dynamic';

// Super admin panel (dark nativo + Indigo). Acesso gated a SUPER_ADMIN no layout.
export default async function SuperAdminPage() {
  const [overview, planRows, connectionsTotal] = await Promise.all([
    getTenantsOverview(),
    db.select().from(mmPlan),
    db.$count(mmConnection),
  ]);

  const tenantsActive = overview.tenants.filter((t) => t.active).length;
  const plans = planRows.map((p) => ({
    id: p.id,
    name: p.name,
    active: p.active,
    features: (p.features as string[] | null) ?? [],
    priceMonthly: p.priceMonthly,
    maxUsers: p.maxUsers,
  }));

  return (
    <SuperAdminView
      metrics={{
        tenantsActive,
        usersTotal: overview.totals.users,
        matchesTotal: overview.totals.activeConnections,
        connectionsTotal,
      }}
      tenants={overview.tenants}
      plans={plans}
    />
  );
}

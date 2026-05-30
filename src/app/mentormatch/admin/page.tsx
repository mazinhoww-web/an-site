import { db } from '@/db';
import { mmPlan } from '@/lib/mentormatch/db/schema';
import { getTenantsOverview } from '@/lib/mentormatch/admin-stats';
import { TenantsAdmin } from '@/components/mentormatch/admin/TenantsAdmin';

export const dynamic = 'force-dynamic';

// Super admin panel. Access is gated to SUPER_ADMIN by admin/layout.tsx.
export default async function SuperAdminPage() {
  const [overview, planRows] = await Promise.all([getTenantsOverview(), db.select().from(mmPlan)]);
  const plans = planRows.map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-container space-y-10 px-6 py-10">
      <h1 className="font-mmdisplay text-display-m">Super Admin</h1>
      <TenantsAdmin initial={overview} plans={plans} />
    </main>
  );
}

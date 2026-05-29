import { db } from '@/db';
import { mmConnection, mmPlan, mmTenant, mmUser } from '@/lib/mentormatch/db/schema';

// Global tenant overview for the super-admin panel. Aggregations are done in JS
// over full-row selects (avoids partial-select inference issues under the merged
// schema). NOTE: in-memory aggregation is fine for the MVP scale; optimizable
// later with SQL $count / GROUP BY if tenant/user volume grows.
export type TenantOverviewRow = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  planName: string | null;
  users: number;
  mentors: number;
  activeConnections: number;
};

export type TenantsOverview = {
  totals: { tenants: number; users: number; activeConnections: number };
  tenants: TenantOverviewRow[];
};

export async function getTenantsOverview(): Promise<TenantsOverview> {
  const [tenants, users, connections, plans] = await Promise.all([
    db.select().from(mmTenant),
    db.select().from(mmUser),
    db.select().from(mmConnection),
    db.select().from(mmPlan),
  ]);

  const planName = new Map(plans.map((p) => [p.id, p.name]));

  const usersByTenant = new Map<string, number>();
  const mentorsByTenant = new Map<string, number>();
  for (const u of users) {
    if (!u.tenantId) continue;
    usersByTenant.set(u.tenantId, (usersByTenant.get(u.tenantId) ?? 0) + 1);
    if (u.role === 'MENTOR') mentorsByTenant.set(u.tenantId, (mentorsByTenant.get(u.tenantId) ?? 0) + 1);
  }

  const activeByTenant = new Map<string, number>();
  let activeConnectionsTotal = 0;
  for (const c of connections) {
    if (c.status !== 'ACCEPTED') continue;
    activeConnectionsTotal += 1;
    activeByTenant.set(c.tenantId, (activeByTenant.get(c.tenantId) ?? 0) + 1);
  }

  const rows: TenantOverviewRow[] = tenants
    .map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      active: t.active,
      planName: t.planId ? planName.get(t.planId) ?? null : null,
      users: usersByTenant.get(t.id) ?? 0,
      mentors: mentorsByTenant.get(t.id) ?? 0,
      activeConnections: activeByTenant.get(t.id) ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    totals: {
      tenants: tenants.length,
      users: users.length,
      activeConnections: activeConnectionsTotal,
    },
    tenants: rows,
  };
}

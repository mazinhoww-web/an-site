import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getActiveTenantBySlug, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { tenantBrandStyle } from '@/lib/mentormatch/tenant-theme';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { DashboardShell } from '@/components/mentormatch/layout/DashboardShell';

// Guard: session + tenant ownership. Source of truth is the database (D-06).
// SUPER_ADMIN bypasses ownership (superset of ADMIN — D-07).
export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  // D023.1/3: sessao de outro tenant acessando /t/[slug]/* = 404 (nao 403, nao
  // redirect) — nao vaza a existencia do tenant. SUPER_ADMIN passa (D-07).
  if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenant.id) {
    notFound();
  }

  // Conta aguardando aprovacao do admin (auto-cadastro). Nao acessa o dashboard
  // ate ser aprovada; bounce para a tela de pendencia (fora deste subtree).
  if (user.role !== 'SUPER_ADMIN' && user.status === 'PENDING') {
    redirect('/mentormatch/pendente');
  }

  // Injeta a marca do tenant em runtime no subtree do app (--brand + --mm-primary).
  const theme = await resolveColorScheme();
  const dual = Boolean(user.canMentor && user.canMentee);
  return (
    <div style={tenantBrandStyle(tenant)}>
      <DashboardShell slug={params.slug} brandColor={tenant.brandColor} theme={theme} dual={dual}>
        {children}
      </DashboardShell>
    </div>
  );
}

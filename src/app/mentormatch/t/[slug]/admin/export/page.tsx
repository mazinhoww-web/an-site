import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';

export const dynamic = 'force-dynamic';

const TYPES: [string, string][] = [
  ['users', 'Usuarios'],
  ['connections', 'Conexoes'],
  ['skills', 'Habilidades'],
];

export default async function AdminExportPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-mmdisplay text-display-m">Exportar CSV</h1>
      <div className="flex flex-wrap gap-3">
        {TYPES.map(([type, label]) => (
          <a
            key={type}
            href={`/api/mentormatch/admin/export?type=${type}&tenantId=${tenant.id}`}
            className="rounded border border-mm-border px-4 py-2 text-body-s text-mm-text hover:border-mm-primary"
          >
            Exportar {label}
          </a>
        ))}
      </div>
    </main>
  );
}

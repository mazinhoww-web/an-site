import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';

export const dynamic = 'force-dynamic';

const TYPES: [string, string][] = [
  ['users', 'Usuarios'],
  ['connections', 'Conexoes'],
  ['skills', 'Habilidades'],
];

export default async function AdminExportPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return (
    <MentorMatchThemeRoot brand={tenant.brandColor} theme={theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        <div>
          <h1 className="mm-h1">Exportar CSV</h1>
          <p className="mm-body-small">Baixe os dados do programa.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {TYPES.map(([type, label]) => (
            <a
              key={type}
              href={`/api/mentormatch/admin/export?type=${type}&tenantId=${tenant.id}`}
              className="mm-btn mm-btn--secondary"
            >
              Exportar {label}
            </a>
          ))}
        </div>
      </div>
    </MentorMatchThemeRoot>
  );
}

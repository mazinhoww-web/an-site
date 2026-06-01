import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { BookOpen } from 'lucide-react';
import { db } from '@/db';
import { mmLibraryItem } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';

export const dynamic = 'force-dynamic';

// Tenant library, visible to any member of the tenant (under the ownership
// guard in t/[slug]/layout). Read-only here; creation stays ADMIN/MENTOR (Fase 8).
export default async function TenantLibraryPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  const items = await db
    .select()
    .from(mmLibraryItem)
    .where(eq(mmLibraryItem.tenantId, tenant.id))
    .orderBy(desc(mmLibraryItem.createdAt));

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 className="mm-h1">Biblioteca</h1>
      {items.length === 0 ? (
        <div className="mm-empty">
          <span className="mm-empty__icon" aria-hidden>
            <BookOpen size={28} />
          </span>
          <h3 className="mm-h3">Nenhum material disponivel</h3>
          <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
            Os materiais publicados pela organizacao aparecem aqui para download.
          </p>
        </div>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((it) => (
            <li key={it.id} className="mm-card">
              <a
                href={it.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mm-body-strong"
                style={{ color: 'var(--brand)' }}
              >
                {it.title}
              </a>{' '}
              <span className="mm-mono" style={{ color: 'var(--text-muted)' }}>
                {it.fileType}
              </span>
              {it.description && (
                <p className="mm-body-small" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                  {it.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

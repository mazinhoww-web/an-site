import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
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
    <main className="space-y-6">
      <h1 className="font-heading text-display-m">Biblioteca</h1>
      {items.length === 0 ? (
        <p className="text-body-s text-graphite">Nenhum material disponivel ainda.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="rounded border border-hairline bg-paper px-4 py-3">
              <a href={it.fileUrl} target="_blank" rel="noreferrer" className="text-body text-ink underline">
                {it.title}
              </a>{' '}
              <span className="font-mono text-mono-meta text-graphite">{it.fileType}</span>
              {it.description && <p className="mt-1 text-body-s text-graphite">{it.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

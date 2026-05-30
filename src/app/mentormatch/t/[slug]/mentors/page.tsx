import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmSkill } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { MentorSearch } from '@/components/mentormatch/dashboard/MentorSearch';

export const dynamic = 'force-dynamic';

export default async function MentorsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  const skillRows = await db
    .select()
    .from(mmSkill)
    .where(and(eq(mmSkill.tenantId, tenant.id), eq(mmSkill.isActive, true)))
    .orderBy(asc(mmSkill.name));
  const skills = skillRows.map((s) => ({ id: s.id, name: s.name }));

  return (
    <main className="space-y-8">
      <h1 className="font-mmdisplay text-display-m">Buscar mentores</h1>
      <MentorSearch slug={params.slug} tenantId={tenant.id} skills={skills} />
    </main>
  );
}

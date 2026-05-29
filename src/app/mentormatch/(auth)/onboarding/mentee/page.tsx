import { redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmSkill } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolveOnboardingTenant } from '@/lib/mentormatch/tenant';
import { OnboardingWizard } from '@/components/mentormatch/onboarding/OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function MenteeOnboardingPage() {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  if (user.onboardingDone && user.role && user.tenantId) redirect('/mentormatch/continue');

  const tenant = await resolveOnboardingTenant();
  const rows = tenant
    ? await db
        .select()
        .from(mmSkill)
        .where(and(eq(mmSkill.tenantId, tenant.id), eq(mmSkill.isActive, true)))
        .orderBy(desc(mmSkill.usageCount))
    : [];
  const skills = rows.map((s) => ({ id: s.id, name: s.name }));

  return <OnboardingWizard role="MENTEE" skills={skills} defaultName={user.name ?? ''} />;
}

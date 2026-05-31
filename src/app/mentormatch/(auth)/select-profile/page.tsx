import { redirect } from 'next/navigation';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { SelectProfile } from '@/components/mentormatch/onboarding/SelectProfile';

export const dynamic = 'force-dynamic';

export default async function SelectProfilePage() {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  // Already onboarded → straight to the dashboard (no re-pick).
  if (user.onboardingDone && user.role && user.tenantId) redirect('/mentormatch/continue');
  return <SelectProfile />;
}

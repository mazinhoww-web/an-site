import { redirect } from 'next/navigation';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';

export const dynamic = 'force-dynamic';

// Single post-auth dispatcher. login/register/onboarding all land here; the
// destination is computed server-side from the database (D-06) via the one
// resolver (D-16: no client-side routing guesswork, no /login bounce).
export default async function MmContinuePage() {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  redirect(await resolvePostLoginHref(user));
}

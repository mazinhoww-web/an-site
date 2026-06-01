import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';

// Role guard (MENTOR). Reads the database (D-06). Same source as the parent
// ownership guard, so the two never ricochet (D-16).
export default async function MentorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  // D023.8: dual-role. Acessa a visao de mentor quem e MENTOR ou tem canMentor.
  if (user.role === 'MENTOR' || user.canMentor) return <>{children}</>;
  if (user.role === 'MENTEE' || user.canMentee) redirect(`/mentormatch/t/${params.slug}/mentee`);
  redirect(await resolvePostLoginHref(user));
}

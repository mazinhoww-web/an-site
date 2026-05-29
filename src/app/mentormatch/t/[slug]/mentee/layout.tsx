import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';

// Role guard (MENTEE). Reads the database (D-06). Same source as the parent
// ownership guard, so the two never ricochet (D-16).
export default async function MenteeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  if (user.role === 'MENTEE') return <>{children}</>;
  if (user.role === 'MENTOR') redirect(`/mentormatch/t/${params.slug}/mentor`);
  redirect(await resolvePostLoginHref(user));
}

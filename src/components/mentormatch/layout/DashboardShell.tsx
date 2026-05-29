import Link from 'next/link';
import type { ReactNode } from 'react';
import { NotificationsBell } from '@/components/mentormatch/layout/NotificationsBell';

// Dashboard chrome shared by all /t/[slug] pages: a header with the brand,
// quick nav and the notifications bell. Guards live in the layout that renders this.
export function DashboardShell({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
          <Link href={`/mentormatch/t/${slug}`} className="font-heading text-h3">
            MentorMatch
          </Link>
          <NotificationsBell />
        </div>
      </header>
      <div className="mx-auto max-w-container px-6 py-10">{children}</div>
    </div>
  );
}

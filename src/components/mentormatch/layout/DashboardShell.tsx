import Link from 'next/link';
import type { ReactNode } from 'react';
import { NotificationsBell } from '@/components/mentormatch/layout/NotificationsBell';

// Dashboard chrome shared by all /t/[slug] pages: a header with the brand,
// quick nav and the notifications bell. Guards live in the layout that renders this.
export function DashboardShell({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-mm-bg text-mm-text">
      <header className="border-b border-mm-border bg-mm-card">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
          <Link href={`/mentormatch/t/${slug}`} className="font-mmdisplay text-h3">
            MentorMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/mentormatch/t/${slug}/library`}
              className="text-body-s text-mm-text hover:underline"
            >
              Biblioteca
            </Link>
            <NotificationsBell />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-container px-6 py-10">{children}</div>
    </div>
  );
}

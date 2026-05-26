import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Newspaper,
  Users,
  MessageSquare,
  Send,
  LogOut,
} from 'lucide-react';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Mark } from '@/components/brand/Mark';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin AN.' },
  robots: 'noindex, nofollow',
};

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Eventos', href: '/admin/eventos', icon: CalendarDays },
  { label: 'Skills', href: '/admin/skills', icon: FileText },
  { label: 'Noticias', href: '/admin/noticias', icon: Newspaper },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { label: 'Mensagens', href: '/admin/mensagens', icon: MessageSquare },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Send },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') ?? [];
  if (!adminEmails.includes(session.user.email ?? '')) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-56 flex-col border-r border-hairline bg-paper md:flex">
        <div className="flex h-14 items-center px-6">
          <Mark size="sm" asLink />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-sm px-3 py-2 text-body-s text-graphite transition-colors duration-150 hover:bg-bone hover:text-ink"
              >
                <Icon size={16} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-hairline px-3 py-4">
          <Label className="mb-2 block px-3">{session.user.email}</Label>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-body-s text-smoke transition-colors duration-150 hover:bg-bone hover:text-ink"
            >
              <LogOut size={16} strokeWidth={1.5} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

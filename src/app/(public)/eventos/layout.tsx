import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Paineis, palestras e mesas em que Aurimar participou.',
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

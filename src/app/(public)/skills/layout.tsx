import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Metodologias empacotadas para Claude. Frameworks de trabalho transformados em codigo executavel.',
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

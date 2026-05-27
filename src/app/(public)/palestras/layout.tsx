import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Palestras',
  description: 'Palestras, workshops e paineis sobre loyalty, fintech, inovacao corporativa e IA aplicada.',
};

export default function PalestrasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

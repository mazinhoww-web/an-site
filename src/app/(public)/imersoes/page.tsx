import type { Metadata } from 'next';
import { ImmersionHub } from '@/components/imersoes/ImmersionHub';

export const metadata: Metadata = {
  title: 'Imersões Corporativas',
  description:
    'Programas presenciais de um dia inteiro para times que precisam dominar novas ferramentas e mudar a forma de trabalhar.',
  openGraph: {
    title: 'Imersões Corporativas · AN.',
    description:
      'Programas presenciais de um dia inteiro para times que precisam dominar novas ferramentas e mudar a forma de trabalhar.',
    type: 'website',
    url: 'https://aurimarnogueira.com.br/imersoes',
  },
};

export default function ImmersoesPage() {
  return <ImmersionHub />;
}

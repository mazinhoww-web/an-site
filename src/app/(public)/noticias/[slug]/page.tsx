import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { ShareButtons } from './ShareButtons';
import { MarkdownContent } from './MarkdownContent';
import { GiscusComments } from '@/components/GiscusComments';

type NewsItem = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
};

const NEWS: NewsItem[] = [
  {
    slug: 'summit-sicredi-2026',
    date: '22 Mai 2026',
    title: 'Painel no Summit de Inovação Sicredi Central Centro-Norte',
    excerpt:
      'Participação como speaker no Summit de Inovação da Sicredi em 21-22 de maio.',
    content:
      'O Summit de Inovação da Sicredi Central Centro-Norte reuniu cooperativas de crédito de Mato Grosso, Goiás e Distrito Federal para discutir o futuro dos serviços financeiros cooperativos. O painel "Loyalty como ativo financeiro" explorou como programas de fidelidade podem deixar de ser apenas benefícios de marketing e se tornar instrumentos financeiros com valor próprio.\n\nA apresentação mostrou casos reais de como a LATAM Pass está estruturando produtos financeiros próprios, usando a base de dados de comportamento do consumidor como matéria-prima para originação de crédito, seguros e investimentos. O modelo de profit share com parceiros financeiros foi detalhado, mostrando como cooperativas podem replicar a lógica em escala regional.',
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '11 Mai 2026',
    title: 'Painel Embedded Credit no Cubo Itaú',
    excerpt:
      'Apresentação sobre crédito embarcado e programas de fidelidade.',
    content:
      'O evento organizado pela GYRA+ no Cubo Itaú reuniu fintechs, bancos e plataformas para discutir as tendências de crédito embarcado (embedded credit) no Brasil. O painel focou em como plataformas não financeiras podem oferecer produtos de crédito integrados a sua experiência de uso.\n\nA participação abordou especificamente o papel de programas de fidelidade como originadores de valor financeiro, demonstrando como dados de comportamento do consumidor (frequência de compra, ticket médio, engajamento com o programa) podem ser transformados em sinais de crédito compatíveis com modelos de risco regulados.',
  },
];

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return NEWS.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = NEWS.find((n) => n.slug === params.slug);
  if (!item) return { title: 'Notícia não encontrada' };
  return {
    title: item.title,
    description: item.excerpt,
  };
}

export default function NoticiaDetailPage({ params }: Props) {
  const item = NEWS.find((n) => n.slug === params.slug);
  if (!item) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    author: { '@type': 'Person', name: 'Aurimar Nogueira' },
    publisher: { '@type': 'Person', name: 'Aurimar Nogueira' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/noticias" className="transition-colors hover:text-ink">NOTICIAS</Link>
            {' / '}
            <span className="text-ink">{item.title}</span>
          </p>
          <Label className="mb-4 block">{item.date}</Label>
          <h1 className="max-w-3xl font-heading text-display-l">{item.title}</h1>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-12 md:px-12 md:pb-20 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-[720px]">
            <MarkdownContent content={item.content} />
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-[720px]">
            <Hairline className="mb-6" />
            <ShareButtons title={item.title} />
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-[720px]">
            <Hairline className="mb-8" />
            <GiscusComments />
          </div>
        </div>
      </section>

      {/* Back */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-8" />
          <Link
            href="/noticias"
            className="group inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Ver todas as notícias
          </Link>
        </div>
      </section>
    </>
  );
}

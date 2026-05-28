import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllImmersions, immersions } from '@/content/imersoes';
import type { ImmersionSlug } from '@/content/imersoes/types';
import { ImmersionHero } from '@/components/imersoes/ImmersionHero';
import { WhySection } from '@/components/imersoes/WhySection';
import { ResultsGrid } from '@/components/imersoes/ResultsGrid';
import { InstructorsSection } from '@/components/imersoes/InstructorsSection';
import { ProgramSection } from '@/components/imersoes/ProgramSection';
import { DeliverySection } from '@/components/imersoes/DeliverySection';
import { AudienceSection } from '@/components/imersoes/AudienceSection';
import { PriceSection } from '@/components/imersoes/PriceSection';
import { ImmersionCTA } from '@/components/imersoes/ImmersionCTA';

type Props = {
  params: Promise<{ slug: string }>;
};

const STATIC_ROUTES: ImmersionSlug[] = ['claude', 'lovable'];

function isValidSlug(slug: string): slug is ImmersionSlug {
  return slug in immersions;
}

export async function generateStaticParams() {
  return getAllImmersions()
    .filter((i) => !STATIC_ROUTES.includes(i.slug))
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return { title: 'Imersao nao encontrada' };
  const immersion = immersions[slug];

  return {
    title: immersion.metaTitle,
    description: immersion.metaDescription,
    openGraph: {
      title: `${immersion.metaTitle} · AN.`,
      description: immersion.metaDescription,
      type: 'website',
      url: `https://aurimarnogueira.com.br/imersoes/${immersion.slug}`,
    },
  };
}

export default async function ImersaoDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();
  const immersion = immersions[slug];

  return (
    <>
      <ImmersionHero
        title={immersion.title}
        subtitle={immersion.subtitle}
        highlightWord={immersion.highlightWord}
        logo={immersion.logo}
        descriptor={immersion.descriptor}
        duration={immersion.duration}
      />
      <WhySection
        title={immersion.whyTitle}
        body={immersion.whyBody}
        accents={immersion.whyAccents}
      />
      <ResultsGrid results={immersion.results} />
      <InstructorsSection instructors={immersion.instructors} />
      <ProgramSection program={immersion.program} />
      <DeliverySection
        deliverables={immersion.deliverables}
        includes={immersion.includes}
      />
      <AudienceSection audience={immersion.audience} />
      <PriceSection prices={immersion.prices} disclaimer={immersion.priceDisclaimer} />
      <ImmersionCTA
        title={immersion.ctaTitle}
        highlight={immersion.ctaHighlight}
        logo={immersion.logo}
        body={immersion.ctaBody}
        slug={immersion.slug}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: immersion.title,
            description: immersion.metaDescription,
            provider: {
              '@type': 'Person',
              name: 'Aurimar Nogueira',
              url: 'https://aurimarnogueira.com.br',
            },
            instructor: immersion.instructors.map((i) => ({
              '@type': 'Person',
              name: i.name,
              description: i.bio,
            })),
            offers: immersion.prices.map((p) => ({
              '@type': 'Offer',
              name: p.label,
              priceCurrency: 'BRL',
              description: `${p.price} · ${p.note}`,
            })),
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'mixed',
              duration: 'PT8H',
            },
          }),
        }}
      />
    </>
  );
}

import { PageHero } from '@/components/PageHero';
import { ImmersionHubCard } from '@/components/imersoes/ImmersionHubCard';
import { getAllImmersions } from '@/content/imersoes';

export function ImmersionHub() {
  const immersions = getAllImmersions();

  return (
    <>
      <PageHero
        eyebrow="IMERSÕES CORPORATIVAS"
        title={
          <>
            Imersões{' '}
            <span className="lime-highlight">Corporativas</span>
          </>
        }
        lead="Programas presenciais de um dia inteiro para times que precisam dominar novas ferramentas e mudar a forma de trabalhar."
      />

      <section className="px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {immersions.map((immersion) => (
              <ImmersionHubCard
                key={immersion.slug}
                slug={immersion.slug}
                title={immersion.title}
                subtitle={immersion.subtitle}
                descriptor={immersion.descriptor}
                highlightWord={immersion.highlightWord}
                logo={immersion.logo}
                duration={immersion.duration}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

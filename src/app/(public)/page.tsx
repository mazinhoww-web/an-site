import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';
import { NewsletterForm } from '@/components/home/NewsletterForm';

const HIGHLIGHTS = [
  { metric: 'R$ 70B+', label: 'ATIVOS REGISTRADOS NA CERC' },
  { metric: '60%', label: 'MARKET SHARE CPR' },
  { metric: '1ª', label: 'CPR VERDE DO BRASIL' },
  { metric: '264+', label: 'RESTAURANTES (HARKHARK)' },
] as const;

const SCENARIO_CARDS = [
  {
    label: 'PRODUTOS FINANCEIROS',
    title: 'Estruturação de produtos próprios',
    description:
      'Modelagem de unit economics, escolha de stack, integração regulatória e desenho de produto para escalar dentro de ecossistema loyalty.',
  },
  {
    label: 'PARCERIAS ESTRATÉGICAS',
    title: 'Negociação com infraestrutura financeira',
    description:
      'Discovery e seleção de vendors, modelos de profit share, governança de risco e contratos estruturados para parceiros nacionais e internacionais.',
  },
  {
    label: 'INTELIGÊNCIA COMPETITIVA',
    title: 'Monitoramento contínuo de mercado',
    description:
      'Acompanhamento de programas concorrentes com metodologia proprietária, leitura de movimentos do setor e geração de insumos para decisão executiva.',
  },
] as const;

const FEATURED_SKILLS = [
  { slug: 'metodo-jet-ski', name: 'Método Jet Ski', category: 'Framework' },
  { slug: 'gsd2-methodology', name: 'GSD2', category: 'Framework' },
  { slug: 'gtm-engineering', name: 'GTM Engineering', category: 'Go-to-Market' },
  { slug: 'automation-data-platforms', name: 'Automation & Data', category: 'Data' },
] as const;

const LATEST_NEWS = [
  {
    slug: 'summit-sicredi-2026',
    date: '22 MAI 2026',
    title: 'Painel no Summit de Inovação Sicredi',
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '11 MAI 2026',
    title: 'Painel Embedded Credit no Cubo Itaú',
  },
] as const;

const PERSON_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aurimar Nogueira',
  jobTitle: 'Coordenador Sênior de Negócios Financeiros',
  worksFor: { '@type': 'Organization', name: 'LATAM Pass' },
  url: 'https://aurimarnogueira.com.br',
  sameAs: [
    'https://linkedin.com/in/aurimarnogueira',
    'https://github.com/mazinhoww-web',
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Cuiabá', addressRegion: 'MT', addressCountry: 'BR' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
      />
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col justify-center px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-container">
          <Label withTab className="mb-6 block">
            LOYALTY {'×'} FINTECH {'×'} INNOVATION
          </Label>
          <h1 className="max-w-4xl font-heading text-display-xl">
            Onde estratégia{' '}
            <span className="text-lime">vira</span> sistema.
          </h1>
          <p className="mt-6 max-w-prose text-body-l text-graphite">
            Aurimar Nogueira. Coordenador Sênior de Negócios Financeiros na LATAM Pass.
            Loyalty, fintech e inovação aplicada em ecossistemas regulados.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
            >
              CONHECER
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 border border-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:border-lime hover:text-lime"
            >
              FALAR COMIGO
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-container px-6 md:px-12 lg:px-16">
        <Hairline />
      </div>

      {/* Bloco 1: Quem sou eu */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="QUEM"
            title="Construo produto em mercados que não perdoam improviso."
          />
          <div className="max-w-prose space-y-4 text-body text-graphite">
            <p>
              Comecei em operação no agro, passei por adquirência, mercados de capitais
              e hoje trabalho na maior companhia aérea da América Latina. O que muda entre
              uma fase e outra é a indústria. O que segue igual é o triângulo: produto
              que entende o usuário, parceria que destrava capital, regulação que cabe no
              desenho.
            </p>
            <p>
              A pegada autoral começou cedo. Frameworks como Método Jet Ski, GSD2 e
              Innovation2Business foram construídos para sair da teoria e operar em squad
              real, com OKR mensurável e profit share por iniciativa.
            </p>
          </div>
          <Link
            href="/trajetoria"
            className="group mt-8 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Ler trajetória completa
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-lime transition-all duration-200 group-hover:w-full" />
          </Link>
        </div>
      </section>

      {/* Bloco 2: Cenario atual */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="AGORA"
            title="Coordenando novas frentes na LATAM Pass."
            subtitle="Trabalho na squad eLoyalty / New Business, combinando produtos financeiros próprios, parcerias estratégicas e inovação aplicada."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {SCENARIO_CARDS.map((card) => (
              <div
                key={card.label}
                className="border border-hairline bg-paper p-8 transition-colors duration-200 hover:border-lime"
              >
                <Label className="mb-3 block">{card.label}</Label>
                <h3 className="font-heading text-h3">{card.title}</h3>
                <p className="mt-3 text-body-s text-graphite">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloco 3: Em numeros */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="EM NÚMEROS"
            title="Uma década de execução."
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="border border-hairline p-6 transition-colors duration-200 hover:border-lime"
              >
                <p className="font-mono text-h1 font-bold">{item.metric}</p>
                <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/trajetoria"
            className="group mt-8 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Ver trajetória completa
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Bloco 4: Skills em destaque */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="FERRAMENTAS"
            title="Métodos transformados em código que o Claude executa."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FEATURED_SKILLS.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="group border border-hairline p-6 transition-colors duration-200 hover:border-lime"
              >
                <h3 className="font-heading text-h3">{skill.name}</h3>
                <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                  {skill.category}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/skills"
            className="group mt-8 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Ver todas as skills
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Bloco 5: Ultimas noticias */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="NOTÍCIAS"
            title="Updates recentes."
          />
          <div className="space-y-0">
            {LATEST_NEWS.map((item, i) => (
              <div key={item.slug}>
                {i > 0 && <Hairline />}
                <Link
                  href={`/noticias/${item.slug}`}
                  className="group flex items-center justify-between py-6"
                >
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                      {item.date}
                    </p>
                    <h3 className="mt-1 font-heading text-h3">{item.title}</h3>
                  </div>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.5}
                    className="flex-shrink-0 text-graphite transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
                  />
                </Link>
              </div>
            ))}
          </div>
          <Link
            href="/noticias"
            className="group mt-4 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Ver todas as notícias
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Bloco 6: Newsletter */}
      <section className="bg-ink px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label tone="lime" withTab className="mb-4 block">
            NEWSLETTER
          </Label>
          <h2 className="font-heading text-display-m text-bone">
            Recebe quando algo novo sai.
          </h2>
          <p className="mt-4 max-w-prose text-body text-smoke">
            No máximo 2 emails por mês. Skill nova, fala em evento, leitura recomendada.
          </p>
          <NewsletterForm />
          <p className="mt-6 text-body-s text-smoke">
            Seus dados ficam comigo. Não compartilho com ninguém.{' '}
            <a href="/privacidade" className="underline decoration-lime transition-colors hover:text-bone">LGPD aplicada</a>.
          </p>
        </div>
      </section>
    </>
  );
}

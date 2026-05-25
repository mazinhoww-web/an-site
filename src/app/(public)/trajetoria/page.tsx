import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = {
  title: 'Trajetoria',
  description: 'Uma decada de execucao em fintech e loyalty.',
};

const HIGHLIGHTS = [
  { metric: 'R$ 70B+', label: 'ATIVOS REGISTRADOS EM LOYALTY' },
  { metric: '60%', label: 'MARKET SHARE EM CPR' },
  { metric: '1ª', label: 'CPR VERDE BRASIL' },
  { metric: 'R$ 88M', label: 'NPV GERADO NO CASE TAG' },
  { metric: '15+', label: 'PALESTRAS E EVENTOS' },
  { metric: '40+', label: 'PROFISSIONAIS MENTORADOS' },
] as const;

const CHAPTERS = [
  {
    period: '2024 / ATUAL',
    company: 'LATAM Pass',
    role: 'Coordenador Senior de Negocios Financeiros',
    description:
      'Squad eLoyalty / New Business. Estruturacao de produtos financeiros proprios, parcerias estrategicas com infraestrutura financeira e inteligencia competitiva. Foco em transformar loyalty de beneficio de marketing em ativo financeiro.',
    tags: ['Loyalty', 'Fintech', 'Negocios'],
    current: true,
  },
  {
    period: '2022 / 2024',
    company: 'CERC',
    role: 'Head de Novos Negocios',
    description:
      'Registradora de recebiveis com R$ 70B+ em ativos. Expansao comercial com 60% de market share em CPR. Desenvolvimento da primeira CPR Verde do Brasil. Relacionamento com regulador (CVM/BCB) e originadores.',
    tags: ['Capital Markets', 'Recebiveis', 'Regulacao'],
    current: false,
  },
  {
    period: '2020 / 2022',
    company: 'TAG Investimentos',
    role: 'Gerente Comercial',
    description:
      'Estruturacao de case com NPV de R$ 88M. Gestao de carteira institucional e desenvolvimento de novos produtos de investimento. Interface entre area comercial e mesa de operacoes.',
    tags: ['Investimentos', 'Comercial', 'NPV'],
    current: false,
  },
  {
    period: '2018 / 2020',
    company: 'Agronegocio MT',
    role: 'Operacoes e Comercial',
    description:
      'Inicio da carreira em operacoes no agronegocio mato-grossense. Logistica, comercializacao de graos e gestao de contratos. Base operacional que fundamentou a visao de produto.',
    tags: ['Agro', 'Operacoes', 'Logistica'],
    current: false,
  },
] as const;

const FRAMEWORKS = [
  {
    name: 'Metodo Jet Ski',
    subtitle: 'Execucao agil de produtos em mercados regulados',
    description:
      'Framework de inovacao em 3 fases: Diagnostico da Oportunidade, Prototipacao Agil, Visao Transformadora. Aplicado em squads de inovacao corporativa.',
  },
  {
    name: 'GSD2',
    subtitle: 'Getting Shit Done Doubled',
    description:
      'Milestone, Slice, Task com spec-before-code. PROJECT.md, REQUIREMENTS.md, ROADMAP.md. Anti-context-rot para projetos com IA.',
  },
  {
    name: 'Innovation2Business',
    subtitle: 'Do ideation ao revenue da inovacao',
    description:
      'Metodologia para transformar ideias em negocios viaveis dentro de squads corporativas, conectando Discovery, Business Case e Go-to-Market.',
  },
] as const;

export default function TrajetoriaPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">TRAJETORIA</Label>
          <h1 className="max-w-3xl font-heading text-display-m">
            Uma decada de execucao em fintech e loyalty
          </h1>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead eyebrow="EM NUMEROS" title="Resultados que importam." />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
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
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead eyebrow="CAPITULOS" title="Linha do tempo profissional." />
          <div className="relative space-y-12 border-l-2 border-lime pl-8 md:pl-12">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.period} className="relative">
                <span
                  className={`absolute -left-[calc(0.5rem+9px)] top-2 h-3 w-3 ${
                    chapter.current ? 'bg-lime' : 'border border-hairline bg-bone'
                  }`}
                />
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime">
                    {chapter.period}
                  </p>
                  {chapter.current && (
                    <span className="bg-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                      ATUAL
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-heading text-h2">{chapter.company}</h3>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                  {chapter.role}
                </p>
                <p className="mt-4 max-w-prose text-body text-graphite">
                  {chapter.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="METODOS CRIADOS"
            title="Frameworks transformados em skills."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FRAMEWORKS.map((fw) => (
              <div
                key={fw.name}
                className="border border-hairline p-8 transition-colors duration-200 hover:border-lime"
              >
                <h3 className="font-heading text-h3">{fw.name}</h3>
                <p className="mt-1 text-body-s text-lime">{fw.subtitle}</p>
                <p className="mt-4 text-body-s text-graphite">{fw.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/skills"
            className="group mt-8 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Usar essas metodologias
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Quer conhecer melhor?</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
            >
              ENVIAR MENSAGEM
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 border border-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:border-lime hover:text-lime"
            >
              VER SKILLS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

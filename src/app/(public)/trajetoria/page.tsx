import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = {
  title: 'Trajetória',
  description: 'Uma década de execução em fintech e loyalty.',
};

const HIGHLIGHTS = [
  { metric: 'R$ 70B+', label: 'ATIVOS REGISTRADOS NA CERC' },
  { metric: '60%', label: 'MARKET SHARE EM CPR' },
  { metric: '1ª', label: 'CPR VERDE DO BRASIL' },
  { metric: '264+', label: 'RESTAURANTES (HARKHARK, AUS)' },
  { metric: '15+', label: 'PALESTRAS E EVENTOS' },
  { metric: '40+', label: 'PROFISSIONAIS MENTORADOS' },
] as const;

const CHAPTERS = [
  {
    period: 'AGO 2024 / ATUAL',
    company: 'LATAM Pass Brasil',
    role: 'Coordenador Sênior de Negócios Financeiros',
    location: 'São Paulo, SP (remoto Cuiabá)',
    description:
      'Squad eLoyalty / New Business. Estruturação de produtos financeiros próprios em parceria com infraestrutura nacional e internacional. Modelagem completa de unit economics. Discovery de vendors com critérios técnicos e regulatórios. Frameworks autorais aplicados no dia a dia (Método Jet Ski, GSD2, Innovation2Business).',
    result:
      'Frentes de negócio ativas em estágio avançado de validação. Pipeline de parcerias estratégicas em curso. Inteligência competitiva contínua sobre o mercado de loyalty no Brasil.',
    learning:
      'Em ecossistema regulado, parceria não é commodity. Quem entra antes na modelagem regulatória trava vantagem estrutural difícil de reverter.',
    tags: ['Loyalty', 'Fintech', 'Negócios'],
    current: true,
  },
  {
    period: 'OUT 2023 / AGO 2024',
    company: 'CRDC',
    role: 'Product Owner Recebíveis Agro',
    location: 'São Paulo, SP',
    description:
      'Registradora autorizada pelo Banco Central operando no segmento de recebíveis do agronegócio. Owner do produto de Recebíveis Agro. Discovery com bancos, traders e produtores. Especificação de requisitos funcionais e regulatórios. Coordenação de squad técnica.',
    result:
      'Produto entregue em condição de operar registro de recebíveis do agro dentro da regulação BCB vigente, com fluxo auditável e integrável a sistemas externos de bancos parceiros.',
    learning:
      'Em produtos regulados, especificação não é luxo. É o que separa entrega que opera de entrega que precisa ser refeita após auditoria.',
    tags: ['Recebíveis', 'Agro', 'Regulação'],
    current: false,
  },
  {
    period: 'MAI 2021 / SET 2023',
    company: 'CERC',
    role: 'Officer de Produtos / Product Manager Recebíveis',
    location: 'São Paulo, SP',
    description:
      'Registradora autorizada pelo BCB disputando market share contra a B3 no registro de recebíveis. Owner de produtos no eixo de recebíveis e títulos: CCB, CPR, CPR Verde, CDCA e Registro Digital. Lançamento do primeiro registro de CPR Verde do Brasil. Crescimento de market share até atingir 60% do segmento.',
    result:
      'R$ 70 bilhões em ativos registrados sob o produto CPR Registry. Market share de 60% no segmento de CPR contra a B3. Primeira CPR Verde do Brasil registrada.',
    learning:
      'Marca não vence por marketing em mercado regulado. Vence por entrega de produto que opera dentro da norma, com tempo de processamento menor e documentação rastreável.',
    tags: ['Capital Markets', 'Recebíveis', 'Regulação'],
    current: false,
  },
  {
    period: 'ABR 2019 / MAI 2021',
    company: 'Stone Pagamentos',
    role: 'Key Account Manager / Especialista em Produtos',
    location: 'São Paulo, SP',
    description:
      'Adquirente em alta velocidade de crescimento. Gestão de carteira de redes e franquias na plataforma ABC. Estruturação de produtos sob medida para grandes varejistas. Negociação de condições comerciais com redes nacionais.',
    result:
      'Carteira de redes e franquias ativa e crescente. Casos de sucesso usados internamente como referência para estruturação de novos produtos para varejistas de grande porte.',
    learning:
      'Atendimento técnico não é despesa. Em varejo de alto volume, é o que sustenta a relação além do preço.',
    tags: ['Pagamentos', 'Varejo', 'Adquirência'],
    current: false,
  },
  {
    period: '2014 / 2020',
    company: 'Início internacional e formação',
    role: 'Cuiabá MT, Brisbane Austrália, São Paulo SP',
    location: '',
    description:
      '99Taxis em Cuiabá: operação local de expansão da plataforma de mobilidade. Syngenta em Cuiabá: experiência inicial em agronegócio com foco em distribuição e operação comercial regional. HarkHark em Brisbane (Austrália): coordenação operacional de plataforma de delivery com USD 2M+ em GMV e 264+ restaurantes parceiros. Formação: graduação em Administração na UniC (Cuiabá), MBA, curso na Tera, curso na FGV, intercâmbio na IH Brisbane.',
    result: '',
    learning:
      'A combinação de operação no agro, mobilidade e marketplace internacional montou um repertório raro: regulação, distribuição física e produto digital no mesmo currículo.',
    tags: ['Agro', 'Marketplace', 'Internacional'],
    current: false,
  },
] as const;

const FRAMEWORKS = [
  {
    name: 'Método Jet Ski',
    subtitle: 'Execução ágil de produtos em mercados regulados',
    description:
      'Framework de inovação em 3 fases: Diagnóstico da Oportunidade, Prototipação Ágil, Visão Transformadora. Aplicado em squads de inovação corporativa.',
  },
  {
    name: 'GSD2',
    subtitle: 'Getting Shit Done Doubled',
    description:
      'Milestone, Slice, Task com spec-before-code. PROJECT.md, REQUIREMENTS.md, ROADMAP.md. Anti-context-rot para projetos com IA.',
  },
  {
    name: 'Innovation2Business',
    subtitle: 'Do ideation ao revenue da inovação',
    description:
      'Metodologia para transformar ideias em negócios viáveis dentro de squads corporativas, conectando Discovery, Business Case e Go-to-Market.',
  },
] as const;

export default function TrajetoriaPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Eyebrow className="mb-4 block">TRAJETÓRIA</Eyebrow>
          <h1 className="max-w-3xl font-heading text-display-m">
            Uma década de execução em fintech e loyalty
          </h1>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead eyebrow="EM NÚMEROS" title="Resultados que importam." />
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
          <SectionHead eyebrow="CAPÍTULOS" title="Linha do tempo profissional." />
          <div className="relative space-y-12 border-l-2 border-lime pl-8 md:pl-12">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.period} className="relative">
                <span
                  className={`absolute -left-[calc(0.5rem+9px)] top-2 h-3 w-3 ${
                    chapter.current ? 'bg-lime' : 'border border-hairline bg-bone'
                  }`}
                />
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-smoke">
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
                {chapter.location && (
                  <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                    {chapter.location}
                  </p>
                )}
                <p className="mt-4 max-w-prose text-body text-graphite">
                  {chapter.description}
                </p>
                {chapter.result && (
                  <div className="mt-4">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">RESULTADO</p>
                    <p className="mt-1 max-w-prose text-body-s text-graphite">{chapter.result}</p>
                  </div>
                )}
                {chapter.learning && (
                  <div className="mt-4 border-l-2 border-hairline pl-4">
                    <p className="max-w-prose text-body-s italic text-graphite">{chapter.learning}</p>
                  </div>
                )}
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
            eyebrow="MÉTODOS CRIADOS"
            title="Frameworks transformados em skills."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FRAMEWORKS.map((fw) => (
              <div
                key={fw.name}
                className="border border-hairline p-8 transition-colors duration-200 hover:border-lime"
              >
                <h3 className="font-heading text-h3">{fw.name}</h3>
                <p className="mt-1 text-body-s text-graphite">{fw.subtitle}</p>
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

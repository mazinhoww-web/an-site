import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { PhotoFrame } from '@/components/brand/PhotoFrame';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Quem é Aurimar Nogueira. Loyalty, fintech e inovação aplicada.',
};

const TIMELINE_ITEMS = [
  { year: '2024', company: 'LATAM Pass', role: 'Coordenador Sr. Negócios Financeiros', current: true as const },
  { year: '2023', company: 'CRDC', role: 'Product Owner Recebíveis Agro', current: false as const },
  { year: '2021', company: 'CERC', role: 'Officer de Produtos / PM Recebíveis', current: false as const },
  { year: '2019', company: 'Stone Pagamentos', role: 'Key Account Manager', current: false as const },
] as const;

const FRAMEWORKS = [
  { name: 'Método Jet Ski', desc: 'Execução ágil de produtos em mercados regulados.' },
  { name: 'GSD2', desc: 'Getting Shit Done Doubled. Milestone, Slice, Task.' },
  { name: 'Innovation2Business', desc: 'Do ideation ao revenue da inovação.' },
] as const;

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">SOBRE</Label>
          <h1 className="font-heading text-display-m">Quem é Aurimar Nogueira</h1>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Main content: 2 columns */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-12 md:grid-cols-12">
          {/* Left: Photo */}
          <div className="md:col-span-4">
            <PhotoFrame alt="Aurimar Nogueira" />
            <div className="mt-6 space-y-2">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Cuiabá, MT, Brasil
              </p>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Coord. Sr. Negócios Financeiros
              </p>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Onde estratégia vira sistema.
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="md:col-span-8">
            <div className="max-w-prose space-y-6 text-body text-graphite">
              <p>
                Comecei em operação no agro em Mato Grosso, passei por adquirência na Stone,
                mercados de capitais na CERC (registradora de recebíveis com R$ 70B+ em
                ativos, liderando expansão comercial e fechando 60% de market share em CPR)
                e CRDC. Hoje coordeno novas frentes de negócios financeiros na LATAM Pass,
                combinando produtos próprios, parcerias estratégicas e inovação aplicada ao
                maior programa de fidelidade da América Latina.
              </p>
              <p>
                O case do registro da primeira CPR Verde do Brasil, ainda na CERC, ilustra
                o tipo de entrega que persigo: produto que cria categoria nova dentro da
                regulação existente, com participantes alinhados desde o desenho.
              </p>
              <p>
                O fio condutor é sempre o mesmo: produto que entende o usuário, parceria
                que destrava capital, regulação que cabe no desenho. Frameworks autorais
                como Método Jet Ski, GSD2 e Innovation2Business traduzem essa visão em
                execução de squad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="MÉTODOS AUTORAIS"
            title="Frameworks que uso em projeto"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FRAMEWORKS.map((fw) => (
              <div
                key={fw.name}
                className="border border-hairline p-8 transition-colors duration-200 hover:border-lime"
              >
                <h3 className="font-heading text-h3">{fw.name}</h3>
                <p className="mt-3 text-body-s text-graphite">{fw.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/skills"
            className="group mt-8 inline-flex items-center gap-2 text-body-s text-ink"
          >
            Explorar todas
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Mini timeline */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="TRAJETÓRIA"
            title="Marcos principais"
          />
          <div className="relative space-y-8 border-l border-hairline pl-8">
            {TIMELINE_ITEMS.map((item) => (
              <div key={item.year} className="relative">
                <span
                  className={`absolute -left-[33px] top-1 h-2 w-2 ${
                    item.current ? 'bg-lime' : 'bg-hairline'
                  }`}
                />
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-lime">
                  {item.year}
                  {item.current && ' / ATUAL'}
                </p>
                <h3 className="mt-1 font-heading text-h3">{item.company}</h3>
                <p className="text-body-s text-graphite">{item.role}</p>
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

      {/* Links externos */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead eyebrow="CONECTAR" title="Onde me encontrar" />
          <div className="flex flex-wrap gap-6">
            <a
              href="https://linkedin.com/in/aurimarnogueira"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir LinkedIn em nova aba"
              className="group flex items-center gap-2 border border-hairline px-6 py-3 text-body-s text-graphite transition-colors duration-150 hover:border-lime hover:text-ink"
            >
              LinkedIn
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="https://github.com/mazinhoww-web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir GitHub em nova aba"
              className="group flex items-center gap-2 border border-hairline px-6 py-3 text-body-s text-graphite transition-colors duration-150 hover:border-lime hover:text-ink"
            >
              GitHub
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="mailto:contato@aurimarnogueira.com.br"
              aria-label="Enviar email"
              className="group flex items-center gap-2 border border-hairline px-6 py-3 text-body-s text-graphite transition-colors duration-150 hover:border-lime hover:text-ink"
            >
              Email
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Vamos conversar?</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
            >
              COMEÇAR CONVERSA
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 border border-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:border-lime hover:text-lime"
            >
              VER EVENTOS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

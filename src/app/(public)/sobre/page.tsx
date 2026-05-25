import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { PhotoFrame } from '@/components/brand/PhotoFrame';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Quem eh Aurimar Nogueira. Loyalty, fintech e inovacao aplicada.',
};

const TIMELINE_ITEMS = [
  { year: '2024', company: 'LATAM Pass', role: 'Coordenador Sr. Negocios Financeiros', current: true as const },
  { year: '2022', company: 'CERC', role: 'Head de Novos Negocios', current: false as const },
  { year: '2020', company: 'TAG Investimentos', role: 'Gerente Comercial', current: false as const },
  { year: '2018', company: 'Agronegocio MT', role: 'Operacoes e Comercial', current: false as const },
] as const;

const FRAMEWORKS = [
  { name: 'Metodo Jet Ski', desc: 'Execucao agil de produtos em mercados regulados.' },
  { name: 'GSD2', desc: 'Getting Shit Done Doubled. Milestone, Slice, Task.' },
  { name: 'Innovation2Business', desc: 'Do ideation ao revenue da inovacao.' },
] as const;

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">SOBRE</Label>
          <h1 className="font-heading text-display-m">Quem eh Aurimar Nogueira</h1>
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
                Cuiaba, MT, Brasil
              </p>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Coord. Sr. Negocios Financeiros
              </p>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Onde estrategia vira sistema.
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="md:col-span-8">
            <div className="max-w-prose space-y-6 text-body text-graphite">
              <p>
                Comecei em operacao no agro em Mato Grosso, passei por adquirencia na CERC
                (registradora de recebiveis com R$ 70B+ em ativos), liderando expansao
                comercial e fechando 60% de market share em CPR.
              </p>
              <p>
                Na TAG Investimentos, estruturei um case de NPV de R$ 88M e participei da
                primeira CPR Verde do Brasil. Hoje coordeno novas frentes de negocios
                financeiros na LATAM Pass, combinando produtos proprios, parcerias estrategicas
                e inovacao aplicada ao maior programa de fidelidade da America Latina.
              </p>
              <p>
                O fio condutor eh sempre o mesmo: produto que entende o usuario, parceria que
                destrava capital, regulacao que cabe no desenho. Frameworks autorais como Metodo
                Jet Ski, GSD2 e Innovation2Business traduzem essa visao em execucao de squad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="METODOS AUTORAIS"
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
            eyebrow="TRAJETORIA"
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
            Ver trajetoria completa
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
          <h2 className="font-heading text-display-m">Vamos conversar?</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
            >
              COMECAR CONVERSA
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

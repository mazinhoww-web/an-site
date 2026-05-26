import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';
import { AccordionFAQ } from './AccordionFAQ';

export const metadata: Metadata = {
  title: 'Como usar skills',
  description: 'Aprenda a instalar e usar skills do Claude em 5 passos.',
};

const STEPS = [
  {
    number: '01',
    title: 'Baixe o arquivo .skill',
    description:
      'Navegue até a skill desejada e clique em "Baixar skill". Informe seu email na primeira vez. O arquivo será baixado automaticamente.',
  },
  {
    number: '02',
    title: 'Abra o Claude Code ou Claude Cowork',
    description:
      'Inicie uma sessão no Claude Code (terminal) ou Claude Cowork (interface web). Ambos suportam skills como contexto carregável.',
  },
  {
    number: '03',
    title: 'Carregue a skill na sessão',
    description:
      'No Claude Code, use o comando /skill seguido do caminho do arquivo. No Claude Cowork, arraste o arquivo para a área de upload ou use o menu "Adicionar skill".',
  },
  {
    number: '04',
    title: 'Confirme o carregamento',
    description:
      'O Claude vai confirmar que a skill foi carregada e mostrar um resumo do que ela ensina. A partir desse momento, o Claude opera com o método da skill ativado.',
  },
  {
    number: '05',
    title: 'Use normalmente',
    description:
      'Faça suas perguntas ou peça tarefas como faria normalmente. O Claude vai aplicar a metodologia da skill automaticamente, seguindo os frameworks e processos definidos.',
  },
] as const;

export default function ComoUsarPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Eyebrow className="mb-4 block">GUIA</Eyebrow>
          <h1 className="font-heading text-display-m">Como usar skills</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            5 passos para carregar uma skill no Claude e começar a usar.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="relative space-y-12 border-l-2 border-lime pl-8 md:pl-12">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <span className="absolute -left-[calc(0.5rem+13px)] top-0 flex h-6 w-6 items-center justify-center bg-lime font-mono text-[10px] font-bold text-ink">
                  {step.number}
                </span>
                <h3 className="font-heading text-h2">{step.title}</h3>
                <p className="mt-3 max-w-prose text-body text-graphite">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <SectionHead
            eyebrow="FAQ"
            title="Perguntas frequentes"
          />
          <AccordionFAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Pronto para começar?</h2>
          <Link
            href="/skills"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
          >
            VER GALERIA DE SKILLS
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}

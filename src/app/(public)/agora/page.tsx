import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = {
  title: 'Agora',
  description: 'O que Aurimar Nogueira está fazendo agora.',
};

const NOW_SECTIONS = [
  {
    eyebrow: 'TRABALHANDO EM',
    title: 'LATAM Pass Brasil',
    items: [
      'Coordenação de novas frentes de negócios financeiros na squad eLoyalty / New Business',
      'Estruturação de produtos financeiros próprios em parceria com infraestrutura nacional',
      'Discovery de vendors com critérios técnicos e regulatórios',
    ],
  },
  {
    eyebrow: 'CONSTRUINDO',
    title: 'AN. Site pessoal',
    items: [
      'Skills Hub com metodologias empacotadas para Claude Code',
      'Newsletter sobre loyalty, fintech e inovação aplicada',
      'Frameworks autorais: Método Jet Ski, GSD2, Innovation2Business',
    ],
  },
  {
    eyebrow: 'LENDO',
    title: 'Leituras recentes',
    items: [
      'Documentação regulatória BCB sobre recebíveis e registradoras',
      'Unit economics de programas de fidelidade em mercados regulados',
      'AI-Led Growth e automação de GTM com agentes',
    ],
  },
  {
    eyebrow: 'FOCO DO TRIMESTRE',
    title: 'Q3 2026',
    items: [
      'Validação de frentes de negócio financeiro na LATAM Pass',
      'Expansão do Skills Hub com novas metodologias',
      'Participações em eventos de loyalty e fintech',
    ],
  },
] as const;

export default function AgoraPage() {
  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Eyebrow className="mb-4 block">AGORA</Eyebrow>
          <h1 className="font-heading text-display-m">O que estou fazendo agora</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Inspirado no movimento nownownow.com. Atualizado periodicamente.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container space-y-16">
          {NOW_SECTIONS.map((section) => (
            <div key={section.eyebrow}>
              <Eyebrow className="mb-3 block">{section.eyebrow}</Eyebrow>
              <h2 className="font-heading text-h2">{section.title}</h2>
              <ul className="mt-4 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body text-graphite">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 bg-lime" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Quer conversar sobre algo?</h2>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
          >
            ENTRAR EM CONTATO
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}

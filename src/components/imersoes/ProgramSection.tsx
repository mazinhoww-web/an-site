import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { RevealOnScroll } from '@/components/imersoes/RevealOnScroll';
import { ProgramSessionBanner } from '@/components/imersoes/ProgramSessionBanner';
import { ProgramBlock } from '@/components/imersoes/ProgramBlock';
import { ProgramInterval } from '@/components/imersoes/ProgramInterval';
import type { Immersion } from '@/content/imersoes/types';

type ProgramSectionProps = {
  program: Immersion['program'];
};

export function ProgramSection({ program }: ProgramSectionProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-4 block">PROGRAMA COMPLETO</Eyebrow>
        <h2 className="font-heading text-display-m">Programa</h2>

        {/* Morning */}
        <div className="mt-12">
          <ProgramSessionBanner
            label={program.morning.label}
            schedule={program.morning.schedule}
            subtitle={program.morning.subtitle}
          />
          <div className="mt-6 space-y-4">
            {program.morning.blocks.map((block) => (
              <RevealOnScroll key={block.number}>
                <ProgramBlock block={block} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Interval */}
        <ProgramInterval text={program.intervalText} />

        {/* Afternoon */}
        <div>
          <ProgramSessionBanner
            label={program.afternoon.label}
            schedule={program.afternoon.schedule}
            subtitle={program.afternoon.subtitle}
          />
          <div className="mt-6 space-y-4">
            {program.afternoon.blocks.map((block) => (
              <RevealOnScroll key={block.number}>
                <ProgramBlock block={block} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

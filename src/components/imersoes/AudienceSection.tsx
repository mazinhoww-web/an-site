import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';

type AudienceSectionProps = {
  audience: string[];
};

export function AudienceSection({ audience }: AudienceSectionProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-8 block">PARA QUEM É</Eyebrow>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {audience.map((item, i) => (
            <div
              key={i}
              className="border-l-2 border-lime pl-4 text-body-s text-graphite"
            >
              {item}
            </div>
          ))}
        </div>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

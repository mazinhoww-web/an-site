import { Hairline } from '@/components/brand/Hairline';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { PhotoFrame } from '@/components/brand/PhotoFrame';
import type { Instructor } from '@/content/imersoes/types';

type InstructorsSectionProps = {
  instructors: Instructor[];
};

export function InstructorsSection({ instructors }: InstructorsSectionProps) {
  const instructor = instructors[0];
  if (!instructor) return null;

  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-8 block">INSTRUTOR</Eyebrow>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <PhotoFrame src={instructor.photo} alt={instructor.name} />
          </div>

          <div className="md:col-span-8">
            <h3 className="font-heading text-h2">{instructor.name}</h3>
            <span className="mt-3 inline-block border border-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em]">
              {instructor.role}
            </span>

            <p className="mt-6 max-w-prose text-body text-graphite">
              {instructor.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {instructor.credentials.map((cred) => (
                <span
                  key={cred}
                  className="border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke"
                >
                  {cred}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

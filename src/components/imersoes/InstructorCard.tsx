import Image from 'next/image';
import type { Instructor } from '@/content/imersoes/types';

type InstructorCardProps = {
  instructor: Instructor;
};

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="photo-editorial h-[240px] w-[240px] overflow-hidden">
        <Image
          src={instructor.photo}
          alt={instructor.name}
          width={240}
          height={240}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <h3 className="font-heading text-h3">{instructor.name}</h3>
        <span className="mt-2 inline-block border border-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em]">
          {instructor.role}
        </span>
      </div>

      <p className="text-body-s text-graphite">{instructor.bio}</p>

      <div className="flex flex-wrap gap-2">
        {instructor.credentials.map((cred) => (
          <span
            key={cred}
            className="border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-graphite"
          >
            {cred}
          </span>
        ))}
      </div>
    </div>
  );
}

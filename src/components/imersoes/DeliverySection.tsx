import { Check } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';

type DeliverySectionProps = {
  deliverables: string[];
  includes: string;
};

function parseDeliverable(text: string) {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={key++} className="font-semibold text-ink">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function DeliverySection({ deliverables, includes }: DeliverySectionProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-8 block">O QUE VOCÊ LEVA</Eyebrow>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {deliverables.map((item, i) => (
            <div key={i} className="flex items-start gap-3 border-l border-hairline pl-4 py-2">
              <Check
                size={16}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-lime"
                aria-hidden
              />
              <span className="text-body-s text-graphite">{parseDeliverable(item)}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
          {includes}
        </p>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

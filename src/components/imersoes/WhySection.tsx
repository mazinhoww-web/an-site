import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';

type WhySectionProps = {
  title: string;
  body: string;
  accents: string[];
};

function parseBody(body: string, accents: string[]) {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const parts: Array<{ text: string; bold: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: body.slice(lastIndex, match.index), bold: false });
    }
    parts.push({ text: match[1] ?? '', bold: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    parts.push({ text: body.slice(lastIndex), bold: false });
  }

  return parts.map((part, i) => {
    let content: React.ReactNode = part.text;

    for (const accent of accents) {
      if (part.text.includes(accent)) {
        const idx = part.text.indexOf(accent);
        content = (
          <>
            {part.text.slice(0, idx)}
            <span className="lime-highlight">{accent}</span>
            {part.text.slice(idx + accent.length)}
          </>
        );
        break;
      }
    }

    if (part.bold) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {content}
        </strong>
      );
    }
    return <span key={i}>{content}</span>;
  });
}

export function WhySection({ title, body, accents }: WhySectionProps) {
  const paragraphs = body.split('\n\n');

  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-4 block">POR QUE ESTA IMERSÃO</Eyebrow>
        <h2 className="font-heading text-display-m max-w-[720px]">{title}</h2>
        <div className="mt-8 max-w-prose space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-body text-graphite">
              {parseBody(p, accents)}
            </p>
          ))}
        </div>
        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}

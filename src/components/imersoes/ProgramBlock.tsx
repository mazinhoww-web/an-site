import type { ProgramBlock as ProgramBlockType } from '@/content/imersoes/types';

type ProgramBlockProps = {
  block: ProgramBlockType;
};

export function ProgramBlock({ block }: ProgramBlockProps) {
  return (
    <div className="border border-hairline p-6 transition-colors duration-200 hover:border-ink">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink font-mono text-body-s">
          {block.number}
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
            BLOCO {block.number} / {block.time}
          </p>
          <h3 className="mt-1 font-heading text-h3">{block.title}</h3>
        </div>
      </div>

      {/* Body */}
      <p className="mt-4 text-graphite">{block.body}</p>

      {/* Comparison */}
      {block.comparison && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border border-hairline p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-smoke">
              {block.comparison.before.head}
            </p>
            <p className="text-body-s text-graphite">
              {block.comparison.before.body}
            </p>
          </div>
          <div className="border-2 border-ink p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
              {block.comparison.now.head}
            </p>
            <p className="text-body-s text-graphite">
              {block.comparison.now.body}
            </p>
          </div>
        </div>
      )}

      {/* Bullets */}
      {block.bullets && block.bullets.length > 0 && (
        <ul className="mt-6 space-y-2">
          {block.bullets.map((bullet, i) => (
            <li
              key={i}
              className="border-l border-hairline pl-4 text-body-s text-graphite"
            >
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {/* Quote */}
      {block.quote && (
        <blockquote className="mt-6 border-l-2 border-lime pl-4 py-3 text-body-s italic text-graphite">
          {block.quote}
        </blockquote>
      )}

      {/* Exercise */}
      {block.exercise && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
            EXERCÍCIO PRÁTICO
          </p>
          <p className="text-body-s text-graphite">{block.exercise}</p>
        </div>
      )}
    </div>
  );
}

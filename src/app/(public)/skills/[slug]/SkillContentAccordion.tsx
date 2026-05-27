'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

export function SkillContentAccordion({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-hairline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
          Ver SKILL.md completo
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={cn('text-smoke transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        open ? 'max-h-[5000px]' : 'max-h-0',
      )}>
        <div className="border-t border-hairline px-6 py-6">
          <div className="prose prose-sm max-w-none text-graphite prose-headings:font-heading prose-headings:text-ink prose-h1:text-h2 prose-h2:text-h3 prose-h3:text-body prose-code:font-mono prose-code:text-[13px] prose-pre:bg-ink prose-pre:text-bone prose-a:text-ink prose-a:decoration-lime prose-strong:text-ink">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

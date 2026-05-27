'use client';

import { useState } from 'react';
import { SkillCard } from '@/components/skills/SkillCard';
import { cn } from '@/lib/utils';

type SkillItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  downloads: number | null;
  author: string | null;
  isCurated: boolean | null;
  assetFormat: string | null;
};

type Props = {
  skills: SkillItem[];
  categories: string[];
};

export function SkillsGrid({ skills, categories }: Props) {
  const [active, setActive] = useState('TODOS');

  const filtered = active === 'TODOS'
    ? skills
    : skills.filter((s) => s.category === active);

  return (
    <>
      <section className="px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  'px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-all duration-150',
                  active === cat
                    ? 'border border-ink text-ink shadow-[inset_0_-2px_0_var(--color-lime)]'
                    : 'border border-hairline text-graphite hover:border-ink hover:text-ink',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-8 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-body text-smoke">
              Nenhuma skill nessa categoria.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((skill) => (
                <SkillCard
                  key={skill.slug}
                  slug={skill.slug}
                  name={skill.name}
                  description={skill.description}
                  category={skill.category}
                  downloads={skill.downloads ?? 0}
                  badge={skill.isCurated ? 'CURADO' : 'AUTORAL'}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';

type ImmersionHeroProps = {
  title: string;
  subtitle: string;
  highlightWord: string;
  logo: string;
  descriptor: string;
  duration: string;
};

function renderTitle(title: string, highlightWord: string, logo: string) {
  const index = title.indexOf(highlightWord);
  if (index === -1) return title;
  const before = title.slice(0, index);
  const after = title.slice(index + highlightWord.length);
  return (
    <>
      {before}
      <Image
        src={logo}
        alt={highlightWord}
        width={200}
        height={48}
        className="immersion-logo"
        unoptimized
      />
      {after}
    </>
  );
}

export function ImmersionHero({
  title,
  subtitle,
  highlightWord,
  logo,
  descriptor,
  duration,
}: ImmersionHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <header className="px-6 pt-12 pb-10 md:px-12 md:pt-20 md:pb-14 lg:px-16">
      <div className="mx-auto max-w-container">
        <div className="space-y-4 md:space-y-6">
          <Eyebrow className="block">{descriptor}</Eyebrow>
          <motion.h1
            className="font-heading text-display-m max-w-3xl"
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {renderTitle(title, highlightWord, logo)}
          </motion.h1>
          <p className="max-w-prose text-body-l text-graphite">
            {subtitle}
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
            <span>{duration}</span>
          </div>
        </div>
        <Hairline className="mt-8" />
      </div>
    </header>
  );
}

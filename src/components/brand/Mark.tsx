'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MarkProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'light';
  asLink?: boolean;
  className?: string;
};

const sizeMap = {
  sm: 'text-[1.25rem]',
  md: 'text-[1.75rem]',
  lg: 'text-[2.5rem]',
} as const;

export function Mark({ size = 'md', color = 'default', asLink = false, className }: MarkProps) {
  const reducedMotion = useReducedMotion();

  const textColor = color === 'default' ? 'text-ink' : 'text-bone';

  const content = (
    <motion.span
      className={cn(
        'inline-flex font-heading font-bold leading-none select-none',
        sizeMap[size],
        textColor,
        className,
      )}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      AN
      <motion.span
        className="inline-block origin-center text-lime"
        initial={reducedMotion ? undefined : { scale: 0.7, opacity: 0 }}
        animate={reducedMotion ? undefined : { scale: [0.7, 1.3, 1], opacity: 1 }}
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 0.48,
                times: [0, 0.6, 1],
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        .
      </motion.span>
    </motion.span>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="AN. - Ir para inicio">
        {content}
      </Link>
    );
  }

  return content;
}

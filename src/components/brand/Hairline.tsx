'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type HairlineProps = {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'lime';
  className?: string;
};

export function Hairline({
  orientation = 'horizontal',
  variant = 'default',
  className,
}: HairlineProps) {
  const reducedMotion = useReducedMotion();
  const isHorizontal = orientation === 'horizontal';
  const colorClass = variant === 'default' ? 'bg-hairline' : 'bg-lime';

  const baseClass = cn(
    colorClass,
    isHorizontal ? 'h-px w-full' : 'w-px h-full',
    className,
  );

  if (reducedMotion) {
    return <div className={baseClass} />;
  }

  return (
    <motion.div
      className={cn(baseClass, isHorizontal ? 'origin-left' : 'origin-top')}
      initial={isHorizontal ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={isHorizontal ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

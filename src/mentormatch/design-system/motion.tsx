'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/** Eases do DESIGN.md secao 7. */
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0.16, 1, 0.3, 1],
  emphasis: [0.34, 1.56, 0.64, 1], // SO em confirmacao de match
} as const;

/** Duracoes — nunca exceder 0.6s. */
export const DUR = {
  micro: 0.15,
  ui: 0.2,
  entrance: 0.5,
} as const;

interface RevealProps {
  children: ReactNode;
  /** deslocamento vertical inicial (16–24px). */
  y?: number;
  delay?: number;
  className?: string;
}

/**
 * Reveal: fade + y, once, sempre com opacity. Respeita reduced-motion
 * (renderiza estatico, sem transform).
 */
export function Reveal({ children, y = 20, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DUR.entrance, ease: EASE.entrance, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  /** intervalo entre filhos (0.06–0.08s). */
  stagger?: number;
  className?: string;
}

/** Container que escalona a entrada dos filhos StaggerItem. */
export function Stagger({ children, stagger = 0.07, className }: StaggerProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  y?: number;
  className?: string;
}

/** Filho de Stagger. */
export function StaggerItem({ children, y = 16, className }: StaggerItemProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: DUR.entrance, ease: EASE.entrance } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

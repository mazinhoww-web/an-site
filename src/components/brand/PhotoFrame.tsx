'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

type PhotoFrameProps = {
  src?: string;
  alt: string;
  className?: string;
};

export function PhotoFrame({ src, alt, className }: PhotoFrameProps) {
  const reducedMotion = useReducedMotion();

  return (
    <figure
      className={cn(
        'relative overflow-hidden border border-hairline bg-paper p-4',
        className,
      )}
    >
      {/* Lime corner accent (top-right) */}
      <span className="absolute right-0 top-0 h-5 w-px bg-lime" />
      <span className="absolute right-0 top-0 h-px w-5 bg-lime" />

      {src ? (
        <motion.div
          className="relative aspect-[3/4] w-full overflow-hidden"
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </motion.div>
      ) : (
        <div className="flex aspect-[3/4] w-full items-center justify-center bg-bone">
          <div className="flex flex-col items-center gap-3 text-smoke">
            <User size={48} strokeWidth={1} />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
              EM BREVE
            </span>
          </div>
        </div>
      )}
    </figure>
  );
}

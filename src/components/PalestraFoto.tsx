import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { PalestraFoto as PalestraFotoType } from '@/types/palestra';

type Props = {
  foto: PalestraFotoType;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function PalestraFoto({ foto, className, priority = false, sizes }: Props) {
  const isIlustracao = foto.tipo === 'ilustracao' || foto.src.endsWith('.svg');

  const objectPosition = foto.focal_point
    ? `${foto.focal_point.x}% ${foto.focal_point.y}%`
    : undefined;

  if (isIlustracao) {
    return (
      <div className={cn('relative w-full overflow-hidden', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={foto.src}
          alt={foto.alt}
          className="h-full w-full object-contain"
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        sizes={sizes ?? '(max-width: 768px) 100vw, 720px'}
      />
    </div>
  );
}

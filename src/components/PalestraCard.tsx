import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { PalestraFoto } from '@/components/PalestraFoto';
import type { Palestra } from '@/types/palestra';

type Props = {
  palestra: Palestra;
  priority?: boolean;
};

export function PalestraCard({ palestra, priority = false }: Props) {
  const foto = palestra.fotos[0];

  return (
    <Link
      href={`/palestras/${palestra.slug}`}
      className="group border border-hairline transition-colors duration-200 hover:border-ink"
    >
      {foto && (
        <PalestraFoto
          foto={foto}
          className="aspect-[16/10]"
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <div className="p-6">
        <Label className="mb-2 block">{palestra.pilar.toUpperCase()}</Label>
        <h3 className="font-heading text-h3 transition-colors duration-150 group-hover:text-ink">
          {palestra.titulo}
        </h3>
        <p className="mt-2 line-clamp-2 text-body-s text-graphite">{palestra.lead}</p>
        <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
          Ver detalhes
          <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

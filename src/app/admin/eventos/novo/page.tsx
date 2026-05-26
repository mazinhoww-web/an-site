import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Novo Evento' };

export default function AdminNovoEventoPage() {
  return (
    <>
      <Link
        href="/admin/eventos"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-1" />
        Voltar
      </Link>
      <h1 className="font-heading text-h1">Novo Evento</h1>

      <div className="mt-8 border border-hairline bg-paper p-8">
        <p className="text-body-s text-smoke">
          Formulario de criacao sera ativado com o banco de dados conectado.
        </p>
      </div>
    </>
  );
}

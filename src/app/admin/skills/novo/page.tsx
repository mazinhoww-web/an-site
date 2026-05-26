import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Nova Skill' };

export default function AdminNovaSkillPage() {
  return (
    <>
      <Link
        href="/admin/skills"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-1" />
        Voltar
      </Link>
      <h1 className="font-heading text-h1">Nova Skill</h1>

      <div className="mt-8 border border-hairline bg-paper p-8">
        <p className="text-body-s text-smoke">
          Formulario de criacao com upload .skill sera ativado com o banco de dados e Vercel Blob conectados.
        </p>
      </div>
    </>
  );
}

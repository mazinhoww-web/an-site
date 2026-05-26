import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Label } from '@/components/brand/Label';
import { DeleteProjectButton } from './actions-buttons';

export const metadata: Metadata = { title: 'Projetos' };

export default async function AdminProjetosPage() {
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Projetos</h1>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
        >
          <Plus size={14} strokeWidth={1.5} />
          Novo Projeto
        </Link>
      </div>

      {allProjects.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM DADOS</Label>
          <p className="text-body-s text-smoke">
            Nenhum projeto cadastrado. Crie o primeiro.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Título
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Ano
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Featured
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Publicado
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((p) => (
                <tr key={p.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{p.title}</td>
                  <td className="py-3 border-t border-hairline">{p.year ?? '-'}</td>
                  <td className="py-3 border-t border-hairline">
                    <span className={p.isFeatured ? 'text-lime' : 'text-smoke'}>
                      {p.isFeatured ? 'sim' : 'nao'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <span className={p.isPublished ? 'text-lime' : 'text-smoke'}>
                      {p.isPublished ? 'sim' : 'nao'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <DeleteProjectButton id={p.id} title={p.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

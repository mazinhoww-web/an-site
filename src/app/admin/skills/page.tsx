import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Label } from '@/components/brand/Label';
import { TogglePublishedButton, DeleteButton } from './actions-buttons';

export const metadata: Metadata = { title: 'Skills' };

export default async function AdminSkillsPage() {
  const allSkills = await db.select().from(skills).orderBy(desc(skills.createdAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Skills</h1>
        <Link
          href="/admin/skills/novo"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
        >
          <Plus size={14} strokeWidth={1.5} />
          Nova Skill
        </Link>
      </div>

      {allSkills.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM DADOS</Label>
          <p className="text-body-s text-smoke">
            Nenhuma skill cadastrada. Crie a primeira.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Nome
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Categoria
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Downloads
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
              {allSkills.map((s) => (
                <tr key={s.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{s.name}</td>
                  <td className="py-3 border-t border-hairline">{s.category}</td>
                  <td className="py-3 border-t border-hairline">{s.downloads ?? 0}</td>
                  <td className="py-3 border-t border-hairline">
                    <TogglePublishedButton id={s.id} published={s.published ?? true} />
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <DeleteButton id={s.id} name={s.name} />
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

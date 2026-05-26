export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';
import { getContacts } from '@/server-actions/admin/subscribers';
import { MarkReadButton } from './actions-buttons';

export const metadata: Metadata = { title: 'Mensagens' };

export default async function AdminMensagensPage() {
  const allContacts = await getContacts();

  return (
    <>
      <h1 className="font-heading text-h1 mb-8">Mensagens</h1>

      {allContacts.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM DADOS</Label>
          <p className="text-body-s text-smoke">
            Nenhuma mensagem recebida via formulário de contato.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Data
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Nome
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Email
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Assunto
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Mensagem
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Status
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {allContacts.map((c) => (
                <tr key={c.id} className="font-mono">
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="py-3 border-t border-hairline">{c.name}</td>
                  <td className="py-3 border-t border-hairline">{c.email}</td>
                  <td className="py-3 border-t border-hairline">{c.subject}</td>
                  <td className="py-3 border-t border-hairline max-w-[200px] truncate">
                    {c.message}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <span
                      className={c.status === 'new' ? 'text-lime' : 'text-smoke'}
                    >
                      {c.status === 'new' ? 'novo' : 'lido'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline">
                    {c.status === 'new' && (
                      <MarkReadButton id={c.id} />
                    )}
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

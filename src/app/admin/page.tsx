import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { getDashboardStats, getContacts } from '@/server-actions/admin/subscribers';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const allContacts = await getContacts();
  const recentContacts = allContacts.slice(0, 5);

  const metrics = [
    { label: 'SUBSCRIBERS', value: String(stats.subscribers), note: 'confirmados' },
    { label: 'DOWNLOADS', value: String(stats.downloads), note: 'total' },
    { label: 'MENSAGENS', value: String(stats.unreadMessages), note: 'não lidas' },
  ];

  return (
    <>
      <h1 className="font-heading text-h1 mb-8">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="border border-hairline p-6">
            <Label>{m.label}</Label>
            <p className="mt-2 font-mono text-h1 font-bold">{m.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke">
              {m.note}
            </p>
          </div>
        ))}
      </div>

      <div className="my-10">
        <Hairline />
      </div>

      {/* Recent contacts table */}
      <Label withTab className="mb-4 block">
        ÚLTIMAS MENSAGENS
      </Label>

      {recentContacts.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <p className="text-body-s text-smoke">Nenhuma mensagem recebida ainda.</p>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((c) => (
                <tr key={c.id} className="font-mono">
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="py-3 border-t border-hairline">{c.name}</td>
                  <td className="py-3 border-t border-hairline">{c.email}</td>
                  <td className="py-3 border-t border-hairline">{c.subject}</td>
                  <td className="py-3 border-t border-hairline">
                    <span
                      className={
                        c.status === 'new'
                          ? 'text-lime'
                          : 'text-smoke'
                      }
                    >
                      {c.status === 'new' ? 'novo' : 'lido'}
                    </span>
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

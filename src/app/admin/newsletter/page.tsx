import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = { title: 'Newsletter' };

export default function AdminNewsletterPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1">Newsletter</h1>
        <Link
          href="/admin/newsletter/nova"
          className="inline-flex items-center gap-2 bg-ink px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
        >
          <Plus size={14} strokeWidth={1.5} />
          NOVA CAMPANHA
        </Link>
      </div>

      <div className="mt-8 border border-hairline bg-paper p-8">
        <Label className="mb-2 block">SEM CAMPANHAS</Label>
        <p className="text-body-s text-smoke">
          Conecte o banco de dados e crie a primeira campanha de newsletter.
        </p>
      </div>
    </>
  );
}

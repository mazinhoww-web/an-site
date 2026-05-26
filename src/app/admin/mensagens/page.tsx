import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = { title: 'Mensagens' };

export default function AdminMensagensPage() {
  return (
    <>
      <h1 className="font-heading text-h1">Mensagens</h1>

      <div className="mt-8 border border-hairline bg-paper p-8">
        <Label className="mb-2 block">SEM DADOS</Label>
        <p className="text-body-s text-smoke">
          Conecte o banco de dados para ver mensagens recebidas via formulario de contato.
        </p>
      </div>
    </>
  );
}

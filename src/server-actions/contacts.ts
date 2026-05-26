'use server';

import { contactSchema } from '@/lib/validators/contact';

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function submitContact(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados invalidos' };
  }

  // DB insert sera conectado quando Vercel Postgres estiver provisionado.
  // Por ora, valida e retorna sucesso.
  return { success: true };
}

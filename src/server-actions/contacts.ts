'use server';

import { db } from '@/db';
import { contacts } from '@/db/schema';
import { contactSchema } from '@/lib/validators/contact';
import { sendContactNotification } from '@/lib/resend';

type ActionResult = { success: boolean; error?: string };

export async function submitContact(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  }

  try {
    await db.insert(contacts).values({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    await sendContactNotification(
      parsed.data.name,
      parsed.data.email,
      parsed.data.subject,
      parsed.data.message,
    );

    return { success: true };
  } catch (err) {
    console.error('Contact submit error:', err);
    return { success: false, error: 'Erro ao enviar. Tente novamente.' };
  }
}

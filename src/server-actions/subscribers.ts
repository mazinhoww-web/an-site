'use server';

import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendConfirmationEmail } from '@/lib/resend';

type ActionResult = { success: boolean; error?: string };

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  if (!email || !email.includes('@')) return { success: false, error: 'Email inválido' };

  try {
    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);

    if (existing[0]) {
      if (existing[0].confirmed) return { success: true };
      await sendConfirmationEmail(email, existing[0].confirmationToken!);
      return { success: true };
    }

    const confirmationToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();

    await db.insert(subscribers).values({
      email,
      consentNewsletter: true,
      source: 'newsletter',
      confirmed: false,
      confirmationToken,
      unsubscribeToken,
    });

    await sendConfirmationEmail(email, confirmationToken);
    return { success: true };
  } catch (err) {
    console.error('Subscribe error:', err);
    return { success: false, error: 'Erro ao registrar' };
  }
}

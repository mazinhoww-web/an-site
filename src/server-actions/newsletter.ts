'use server';

import { db } from '@/db';
import { subscribers, newsletterCampaigns } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendNewsletterEmail } from '@/lib/resend';
import { newsletterSchema } from '@/lib/validators/newsletter';
import { auth } from '@/lib/auth';

type ActionResult = { success: boolean; error?: string; recipientCount?: number };

export async function dispatchNewsletter(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.isAdmin) return { success: false, error: 'Não autorizado' };

  const raw = {
    subject: formData.get('subject'),
    contentMd: formData.get('contentMd'),
  };

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { subject, contentMd } = parsed.data;
  const html = `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px 0;color:#4A4A4A;line-height:1.6">${contentMd.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>`;

  try {
    const recipients = await db.select().from(subscribers).where(
      and(
        eq(subscribers.confirmed, true),
        eq(subscribers.consentNewsletter, true),
      ),
    );

    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(r => sendNewsletterEmail(r.email, subject, html, r.unsubscribeToken!)),
      );
    }

    await db.insert(newsletterCampaigns).values({
      subject,
      contentMd,
      contentHtml: html,
      recipientCount: recipients.length,
      status: 'sent',
      sentAt: new Date(),
    });

    return { success: true, recipientCount: recipients.length };
  } catch (err) {
    console.error('Newsletter dispatch error:', err);
    return { success: false, error: 'Erro ao disparar newsletter' };
  }
}

export async function saveDraft(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.isAdmin) return { success: false, error: 'Não autorizado' };

  const subject = formData.get('subject') as string;
  const contentMd = formData.get('contentMd') as string;

  try {
    await db.insert(newsletterCampaigns).values({
      subject: subject || 'Rascunho',
      contentMd: contentMd || '',
      status: 'draft',
    });
    return { success: true };
  } catch (err) {
    console.error('Save draft error:', err);
    return { success: false, error: 'Erro ao salvar rascunho' };
  }
}

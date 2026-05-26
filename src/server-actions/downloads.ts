'use server';

import { db } from '@/db';
import { skills, subscribers, downloads } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { downloadGateSchema } from '@/lib/validators/download';
import { sendConfirmationEmail } from '@/lib/resend';

type ActionResult = { success: boolean; error?: string };

export async function requestSkillDownload(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get('email'),
    skillSlug: formData.get('skillSlug'),
    consentLgpd: formData.get('consentLgpd') === 'true',
    consentNewsletter: formData.get('consentNewsletter') === 'true',
  };

  const parsed = downloadGateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  }

  const { email, skillSlug, consentNewsletter } = parsed.data;

  try {
    const skill = await db.select().from(skills).where(eq(skills.slug, skillSlug)).limit(1);
    if (!skill[0]) return { success: false, error: 'Skill não encontrada' };

    const confirmationToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);

    if (existing[0]) {
      await db.update(subscribers).set({
        consentNewsletter: consentNewsletter || existing[0].consentNewsletter,
        source: 'download',
      }).where(eq(subscribers.email, email));
    } else {
      await db.insert(subscribers).values({
        email,
        consentNewsletter,
        source: 'download',
        confirmed: false,
        confirmationToken,
        unsubscribeToken,
      });

      if (consentNewsletter) {
        await sendConfirmationEmail(email, confirmationToken);
      }
    }

    await db.insert(downloads).values({
      skillId: skill[0].id,
      email,
      consentNewsletter,
    });

    await db.update(skills).set({
      downloads: sql`${skills.downloads} + 1`,
    }).where(eq(skills.id, skill[0].id));

    return { success: true };
  } catch (err) {
    console.error('Download error:', err);
    return { success: false, error: 'Erro ao processar download' };
  }
}

export async function directDownload(skillSlug: string, email: string): Promise<ActionResult> {
  try {
    const skill = await db.select().from(skills).where(eq(skills.slug, skillSlug)).limit(1);
    if (!skill[0]) return { success: false, error: 'Skill não encontrada' };

    await db.insert(downloads).values({
      skillId: skill[0].id,
      email,
    });

    await db.update(skills).set({
      downloads: sql`${skills.downloads} + 1`,
    }).where(eq(skills.id, skill[0].id));

    return { success: true };
  } catch (err) {
    console.error('Direct download error:', err);
    return { success: false, error: 'Erro ao processar download' };
  }
}

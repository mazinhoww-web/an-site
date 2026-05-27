'use server';

import { z } from 'zod';
import { db } from '@/db';
import { downloads, subscribers, skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { getSignedDownloadUrl } from '@/lib/blob';
import { sendDownloadEmail } from '@/lib/resend';

const schema = z.object({
  email: z.string().email('Email invalido').max(200),
  name: z.string().min(2, 'Nome obrigatorio').max(200),
  phone: z.string().max(30).optional().default(''),
  skillSlug: z.string().min(1).max(120),
  consentLgpd: z.literal(true, 'Aceite os termos'),
  consentNewsletter: z.boolean().optional().default(false),
  consentWhatsapp: z.boolean().optional().default(false),
});

export async function requestDownload(input: unknown) {
  const data = schema.parse(input);

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, data.skillSlug))
    .limit(1);

  if (!skill) throw new Error('Skill nao encontrada');
  if (!skill.blobUrl) throw new Error('Asset nao disponivel para download');

  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = hdrs.get('user-agent') ?? '';

  const existing = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, data.email))
    .limit(1);

  if (existing[0]) {
    await db
      .update(subscribers)
      .set({
        name: data.name || existing[0].name,
        phone: data.phone || existing[0].phone,
        consentNewsletter: data.consentNewsletter || existing[0].consentNewsletter,
        consentWhatsapp: data.consentWhatsapp || existing[0].consentWhatsapp,
      })
      .where(eq(subscribers.email, data.email));
  } else {
    await db.insert(subscribers).values({
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      consentNewsletter: data.consentNewsletter,
      consentWhatsapp: data.consentWhatsapp,
      source: 'download',
      confirmed: false,
    });
  }

  await db.insert(downloads).values({
    skillId: skill.id,
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    consentNewsletter: data.consentNewsletter,
    consentWhatsapp: data.consentWhatsapp,
    ipAnonymized: ip.replace(/\.\d+$/, '.0'),
    userAgent: ua.substring(0, 500),
  });

  await db
    .update(skills)
    .set({ downloads: (skill.downloads ?? 0) + 1 })
    .where(eq(skills.id, skill.id));

  const downloadUrl = await getSignedDownloadUrl(skill.blobUrl);

  let emailSent = false;
  try {
    await sendDownloadEmail({
      to: data.email,
      name: data.name,
      skillName: skill.name,
      skillSlug: skill.slug,
      downloadUrl,
      assetFormat: skill.assetFormat,
      assetFilename: skill.assetFilename,
    });
    emailSent = true;
  } catch (err) {
    console.error('Failed to send download email:', err);
  }

  return { success: true, downloadUrl, emailSent };
}

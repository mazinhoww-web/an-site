'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { downloads, subscribers, skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { Resend } from 'resend';

const schema = z.object({
  email: z.string().email().max(200),
  skillSlug: z.string().min(1).max(120),
  consentLgpd: z.literal(true),
});

export async function requestDownload(input: unknown) {
  const data = schema.parse(input);

  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
  await rateLimit(`download:${ip}`, 10, 600);

  const [skill] = await db.select().from(skills).where(eq(skills.slug, data.skillSlug)).limit(1);
  if (!skill) throw new Error('Skill não encontrada');
  if (!skill.assetBlobKey) throw new Error('Asset não disponível');

  const existing = await db.select().from(subscribers).where(eq(subscribers.email, data.email)).limit(1);
  let subscriberId: string;

  if (existing[0]) {
    subscriberId = existing[0].id;
  } else {
    const result = await db.insert(subscribers).values({
      email: data.email,
      consentNewsletter: false,
      source: 'download',
      confirmed: false,
    }).returning({ id: subscribers.id });
    subscriberId = result[0]!.id;
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(downloads).values({
    skillId: skill.id,
    subscriberId,
    email: data.email,
    token,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aurimarnogueira.com.br';
  const downloadUrl = `${baseUrl}/baixar/${token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'AN. <download@aurimarnogueira.com.br>',
    to: data.email,
    subject: `Seu download: ${skill.name}`,
    text: [
      'Aqui esta o link para baixar ' + skill.name + ':',
      '',
      downloadUrl,
      '',
      'Link expira em 24 horas e e de uso unico.',
      '',
      'Aurimar Nogueira',
      'aurimarnogueira.com.br',
    ].join('\n'),
  });

  return { ok: true };
}

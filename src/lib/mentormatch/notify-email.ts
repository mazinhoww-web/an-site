import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import { sendNotificationEmail } from '@/lib/mentormatch/email';

// Email transacional branded para eventos de conexao. Chamado POS-COMMIT (nunca
// dentro de transacao). Best-effort: erros sao engolidos pelo caller.

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://aurimarnogueira.com.br';

async function recipientAndTenant(userId: string, tenantId: string) {
  const [u] = await db.select().from(mmUser).where(eq(mmUser.id, userId)).limit(1);
  const [t] = await db.select().from(mmTenant).where(eq(mmTenant.id, tenantId)).limit(1);
  return { email: u?.email ?? null, name: u?.name ?? null, tenant: t ?? null };
}

/** Notifica o mentor (email) sobre nova solicitacao de mentoria. */
export async function emailMentorNewRequest(mentorId: string, tenantId: string, menteeName: string | null) {
  const { email, tenant } = await recipientAndTenant(mentorId, tenantId);
  if (!email || !tenant) return;
  await sendNotificationEmail({
    to: email,
    tenantName: tenant.name,
    brandColor: tenant.brandColor,
    subject: `Nova solicitacao de mentoria — ${tenant.name}`,
    title: 'Nova solicitacao de mentoria',
    bodyHtml: `<p>${menteeName ?? 'Um mentorado'} solicitou mentoria com voce.</p>`,
    ctaUrl: `${appUrl}/mentormatch/t/${tenant.slug}/mentor`,
    ctaLabel: 'Ver solicitacoes',
  });
}

/** Notifica o mentorado (email) que sua solicitacao foi aceita. */
export async function emailMenteeAccepted(menteeId: string, tenantId: string) {
  const { email, tenant } = await recipientAndTenant(menteeId, tenantId);
  if (!email || !tenant) return;
  await sendNotificationEmail({
    to: email,
    tenantName: tenant.name,
    brandColor: tenant.brandColor,
    subject: `Mentoria aceita — ${tenant.name}`,
    title: 'Sua mentoria foi aceita',
    bodyHtml: `<p>Um mentor aceitou sua solicitacao. Combine o primeiro contato pelo painel.</p>`,
    ctaUrl: `${appUrl}/mentormatch/t/${tenant.slug}/mentee`,
    ctaLabel: 'Ver meu mentor',
  });
}

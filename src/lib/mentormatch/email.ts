import { Resend } from 'resend';

// MentorMatch transactional email. Best-effort: the client is created lazily and
// only when an API key is present, so a missing key never crashes module load /
// build, and send failures never break the main flow (approval, invitation).
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const from = process.env.RESEND_FROM ?? 'AN. <hello@aurimarnogueira.com.br>';
const replyTo = process.env.RESEND_REPLY_TO ?? 'contato@aurimarnogueira.com.br';
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://aurimarnogueira.com.br';

function shell(title: string, body: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a0a0a">
    <h1 style="font-size:20px">${title}</h1>${body}</div>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}

// Branded transactional shell: header bar + CTA na cor de marca do tenant.
function brandedShell(opts: {
  tenantName: string;
  brandColor: string;
  title: string;
  bodyHtml: string;
  ctaUrl?: string;
  ctaLabel?: string;
}): string {
  const cta = opts.ctaUrl
    ? `<p style="margin:20px 0 0"><a href="${opts.ctaUrl}" style="display:inline-block;background:${opts.brandColor};color:#fff;text-decoration:none;padding:10px 18px;border-radius:12px;font-weight:600">${escapeHtml(opts.ctaLabel ?? 'Abrir')}</a></p>`
    : '';
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#121217;border:1px solid #e6e6ec;border-radius:16px;overflow:hidden">
    <div style="background:${opts.brandColor};padding:16px 24px;color:#fff;font-weight:700;font-size:15px">${escapeHtml(opts.tenantName)}</div>
    <div style="padding:24px">
      <h1 style="font-size:20px;margin:0 0 8px">${escapeHtml(opts.title)}</h1>
      ${opts.bodyHtml}
      ${cta}
    </div>
  </div>`;
}

// Email transacional branded por tenant (eventos de notificacao). Best-effort:
// sem RESEND_API_KEY vira no-op; falhas nunca quebram o fluxo principal.
export async function sendNotificationEmail(opts: {
  to: string;
  tenantName: string;
  brandColor: string;
  subject: string;
  title: string;
  bodyHtml: string;
  ctaUrl?: string;
  ctaLabel?: string;
}): Promise<void> {
  // Captura para E2E (MM_EMAIL_CAPTURE=1): registra em memoria em vez de enviar.
  if (process.env.MM_EMAIL_CAPTURE === '1') {
    capturedEmails.push({ to: opts.to, subject: opts.subject, title: opts.title, at: Date.now() });
    return;
  }
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from,
      replyTo,
      to: opts.to,
      subject: opts.subject,
      html: brandedShell(opts),
    });
  } catch (error) {
    console.error('[MM_EMAIL_ERROR]', { kind: 'notification', to: opts.to, error });
  }
}

// --- Captura em memoria para E2E (so ativa com MM_EMAIL_CAPTURE=1) ----------
export interface CapturedEmail {
  to: string;
  subject: string;
  title: string;
  at: number;
}
const capturedEmails: CapturedEmail[] = [];
export function getCapturedEmails(): CapturedEmail[] {
  return capturedEmails;
}
export function clearCapturedEmails(): void {
  capturedEmails.length = 0;
}

export async function sendAccountApprovedEmail(to: string, name: string | null, tenantName: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    await resend.emails.send({
      from,
      replyTo,
      to,
      subject: `Sua conta foi aprovada — ${tenantName}`,
      html: shell(
        'Conta aprovada',
        `<p>Ola ${name ?? ''}, sua conta no programa <strong>${tenantName}</strong> foi aprovada.</p>
         <p><a href="${appUrl}/mentormatch/login">Acessar o MentorMatch</a></p>`,
      ),
    });
  } catch (error) {
    console.error('[MM_EMAIL_ERROR]', { kind: 'account_approved', to, error });
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    const url = `${appUrl}/mentormatch/reset-password?token=${encodeURIComponent(token)}`;
    await resend.emails.send({
      from,
      replyTo,
      to,
      subject: 'Redefinir senha — MentorMatch',
      html: shell(
        'Redefinir senha',
        `<p>Recebemos um pedido para redefinir sua senha.</p>
         <p><a href="${url}">Definir nova senha</a></p>
         <p style="color:#8a8a8a;font-size:12px">O link expira em 60 minutos. Se nao foi voce, ignore este e-mail.</p>`,
      ),
    });
  } catch (error) {
    console.error('[MM_EMAIL_ERROR]', { kind: 'password_reset', to, error });
  }
}

export async function sendInvitationEmail(
  to: string,
  token: string,
  tenantName: string,
  role: string,
) {
  const resend = getResend();
  if (!resend) return;
  try {
    const url = `${appUrl}/mentormatch/register?invitation=${encodeURIComponent(token)}`;
    await resend.emails.send({
      from,
      replyTo,
      to,
      subject: `Convite para ${tenantName} (${role})`,
      html: shell(
        'Voce foi convidado',
        `<p>Voce foi convidado para o programa <strong>${tenantName}</strong> como <strong>${role}</strong>.</p>
         <p><a href="${url}">Criar minha conta</a></p>
         <p style="color:#8a8a8a;font-size:12px">O convite expira em 7 dias.</p>`,
      ),
    });
  } catch (error) {
    console.error('[MM_EMAIL_ERROR]', { kind: 'invitation', to, error });
  }
}

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

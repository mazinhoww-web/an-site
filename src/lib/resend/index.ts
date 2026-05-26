'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.RESEND_FROM ?? 'AN. <hello@aurimarnogueira.com.br>';
const replyTo = process.env.RESEND_REPLY_TO ?? 'contato@aurimarnogueira.com.br';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurimarnogueira.com.br';

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${siteUrl}/api/confirm/${token}`;
  await resend.emails.send({
    from,
    replyTo,
    to: email,
    subject: 'Confirme seu email - AN.',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 0">
        <p style="font-size:14px;color:#4A4A4A">
          Obrigado por se cadastrar. Confirme seu email clicando no link abaixo:
        </p>
        <a href="${confirmUrl}" style="display:inline-block;margin:24px 0;padding:14px 24px;background:#0A0A0A;color:#F5F4EF;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none">
          CONFIRMAR EMAIL
        </a>
        <p style="font-size:12px;color:#8A8A8A">
          Se você não solicitou este cadastro, ignore este email.
        </p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:24px 0" />
        <p style="font-size:11px;color:#8A8A8A;font-family:monospace;letter-spacing:0.04em">
          AN. Aurimar Nogueira
        </p>
      </div>
    `,
  });
}

export async function sendDownloadEmail(email: string, skillName: string, downloadUrl: string) {
  await resend.emails.send({
    from,
    replyTo,
    to: email,
    subject: `Download: ${skillName} - AN.`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 0">
        <p style="font-size:14px;color:#4A4A4A">
          Seu download de <strong>${skillName}</strong> esta pronto.
        </p>
        <a href="${downloadUrl}" style="display:inline-block;margin:24px 0;padding:14px 24px;background:#0A0A0A;color:#F5F4EF;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none">
          BAIXAR SKILL
        </a>
        <p style="font-size:12px;color:#8A8A8A">
          Link válido por 10 minutos.
        </p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:24px 0" />
        <p style="font-size:11px;color:#8A8A8A;font-family:monospace;letter-spacing:0.04em">
          AN. Aurimar Nogueira
        </p>
      </div>
    `,
  });
}

export async function sendContactNotification(name: string, email: string, subject: string, message: string) {
  const adminEmail = process.env.RESEND_REPLY_TO ?? 'contato@aurimarnogueira.com.br';
  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `[AN. Contato] ${subject} - ${name}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 0">
        <p style="font-size:12px;color:#8A8A8A;font-family:monospace;letter-spacing:0.04em;text-transform:uppercase">NOVA MENSAGEM VIA SITE</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:16px 0" />
        <p style="white-space:pre-wrap">${message}</p>
      </div>
    `,
  });
}

export async function sendNewsletterEmail(to: string, subject: string, html: string, unsubscribeToken: string) {
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe/${unsubscribeToken}`;
  await resend.emails.send({
    from,
    replyTo,
    to,
    subject,
    html: `
      ${html}
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 0;text-align:center">
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:24px 0" />
        <p style="font-size:11px;color:#8A8A8A">
          <a href="${unsubscribeUrl}" style="color:#8A8A8A;text-decoration:underline">Cancelar inscricao</a>
        </p>
        <p style="font-size:11px;color:#8A8A8A;font-family:monospace;letter-spacing:0.04em">
          AN. Aurimar Nogueira
        </p>
      </div>
    `,
  });
}

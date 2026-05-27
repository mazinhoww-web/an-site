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

type DownloadEmailParams = {
  to: string;
  name: string;
  skillName: string;
  skillSlug: string;
  downloadUrl: string;
  assetFormat: string | null;
  assetFilename: string | null;
};

const INSTALL_INSTRUCTIONS: Record<string, string> = {
  skill: 'Arraste o arquivo para o Claude Cowork ou copie para <code>~/.claude/skills/</code>.',
  zip: 'Extraia o conteudo para <code>~/.claude/skills/</code> e reinicie o Claude Code.',
  md: 'Copie o conteudo do arquivo e cole diretamente em uma conversa do Claude.',
};

export async function sendDownloadEmail(params: DownloadEmailParams) {
  const { to, name, skillName, skillSlug, downloadUrl, assetFormat, assetFilename } = params;
  const buttonLabel = assetFilename ? `Baixar ${assetFilename}` : 'Baixar skill';
  const installTip = INSTALL_INSTRUCTIONS[assetFormat ?? 'skill'] ?? 'Baixe o arquivo e siga as instrucoes incluidas.';
  const skillUrl = `${siteUrl}/skills/${skillSlug}`;

  await resend.emails.send({
    from,
    replyTo,
    to,
    subject: `Sua skill ${skillName} esta pronta`,
    html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1A1A1A">
        <p style="font-size:15px;line-height:1.6">
          Oi ${name},
        </p>
        <p style="font-size:15px;line-height:1.6">
          Seu download de <strong>${skillName}</strong> esta pronto. Use o botao abaixo para baixar o arquivo.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${downloadUrl}" style="display:inline-block;padding:14px 32px;background:#0A0A0A;color:#F5F4EF;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:0">
            ${buttonLabel}
          </a>
        </div>
        <p style="font-size:12px;color:#8A8A8A;text-align:center">Link valido por 10 minutos.</p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:28px 0" />
        <p style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#0A0A0A;margin-bottom:8px">Como instalar</p>
        <p style="font-size:14px;line-height:1.6;color:#4A4A4A">${installTip}</p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:28px 0" />
        <p style="font-size:14px;line-height:1.6;color:#4A4A4A">
          Explore mais skills em <a href="${siteUrl}/skills" style="color:#0A0A0A;text-decoration:underline">aurimarnogueira.com.br/skills</a>.
        </p>
        <hr style="border:none;border-top:1px solid #E5E3DC;margin:28px 0" />
        <p style="font-size:13px;color:#0A0A0A;font-family:monospace;letter-spacing:0.04em">AN. Aurimar Nogueira</p>
        <p style="font-size:13px;color:#4A4A4A">
          <a href="https://linkedin.com/in/aurimarnogueira" style="color:#4A4A4A;text-decoration:underline">LinkedIn</a>
        </p>
        <p style="font-size:11px;color:#8A8A8A;margin-top:24px">
          Voce recebeu este email porque baixou uma skill em <a href="${skillUrl}" style="color:#8A8A8A">${skillName}</a>.
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

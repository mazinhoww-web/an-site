import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  const rows = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.unsubscribeToken, token))
    .limit(1);

  if (rows[0]) {
    await db
      .update(subscribers)
      .set({ consentNewsletter: false })
      .where(eq(subscribers.id, rows[0].id));
  }

  return new Response(
    `<!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="utf-8"><title>Descadastrado - AN.</title></head>
    <body style="font-family:Inter,sans-serif;max-width:480px;margin:80px auto;padding:0 24px;color:#4A4A4A">
      <h1 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#0A0A0A">
        Inscricao cancelada.
      </h1>
      <p>Você não receberá mais emails da newsletter AN.</p>
      <p style="margin-top:24px">
        <a href="https://aurimarnogueira.com.br" style="color:#0A0A0A">Voltar ao site</a>
      </p>
    </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

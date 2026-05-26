import { kv } from '@vercel/kv';

export async function rateLimit(key: string, max: number, windowSec: number) {
  try {
    const count = await kv.incr(`rl:${key}`);
    if (count === 1) await kv.expire(`rl:${key}`, windowSec);
    if (count > max) {
      throw new Error('Muitas tentativas. Tente novamente em alguns minutos.');
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('Muitas tentativas')) throw e;
    // KV indisponivel: nao bloqueia o fluxo
  }
}

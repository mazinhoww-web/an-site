import { kv } from '@vercel/kv';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

const TOO_MANY = 'Muitas tentativas. Tente novamente em alguns minutos.';

// Estrategia de rate limit, em camadas:
//  1. Vercel KV (se configurado) — rapido, global.
//  2. Postgres (mm_rate_limit) — duravel e compartilhado entre instancias.
//     Atomico via upsert com janela em reset_at. Funciona em serverless.
//  3. Memoria (por instancia) — ultimo recurso se o DB tambem falhar.
// Nunca falha 100% aberto (hardening do caminho de auth — login/register/etc).

const KV_ENABLED = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const mem = new Map<string, { count: number; resetAt: number }>();

function memLimit(key: string, max: number, windowSec: number): void {
  const now = Date.now();
  const cur = mem.get(key);
  if (!cur || cur.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    if (mem.size > 10_000) for (const [k, v] of mem) if (v.resetAt <= now) mem.delete(k);
    return;
  }
  cur.count += 1;
  if (cur.count > max) throw new Error(TOO_MANY);
}

async function dbLimit(key: string, max: number, windowSec: number): Promise<void> {
  const win = sql`(${windowSec} * interval '1 second')`;
  const result = (await db.execute(sql`
    INSERT INTO mm_rate_limit (key, count, reset_at)
    VALUES (${key}, 1, now() + ${win})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN mm_rate_limit.reset_at <= now() THEN 1 ELSE mm_rate_limit.count + 1 END,
      reset_at = CASE WHEN mm_rate_limit.reset_at <= now() THEN now() + ${win} ELSE mm_rate_limit.reset_at END
    RETURNING count
  `)) as unknown as Array<{ count: number | string }>;
  const count = Number(result[0]?.count ?? 0);
  if (count > max) throw new Error(TOO_MANY);
}

export async function rateLimit(key: string, max: number, windowSec: number): Promise<void> {
  const rlKey = `rl:${key}`;

  if (KV_ENABLED) {
    try {
      const count = await kv.incr(rlKey);
      if (count === 1) await kv.expire(rlKey, windowSec);
      if (count > max) throw new Error(TOO_MANY);
      return;
    } catch (e: unknown) {
      if (e instanceof Error && e.message === TOO_MANY) throw e;
      // KV falhou em runtime: cai para o Postgres.
    }
  }

  try {
    await dbLimit(rlKey, max, windowSec);
    return;
  } catch (e: unknown) {
    if (e instanceof Error && e.message === TOO_MANY) throw e;
    // DB indisponivel: ultimo recurso em memoria.
  }

  memLimit(rlKey, max, windowSec);
}

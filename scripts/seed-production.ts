/**
 * Seed de PRODUCAO do MentorMatch. Cria APENAS o tenant real (Sicredi) + super
 * admin. ZERO dado fake (nada de mentores/mentees/conexoes ficticios — isso e so
 * o seed de dev/CI `scripts/seed-mentormatch.ts`).
 *
 * Idempotente. Exige credenciais reais do super admin (sem fallback inseguro).
 *
 *   POSTGRES_URL=... SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD=... pnpm seed:prod
 *
 * Pre-requisito: migrations aplicadas (pnpm db:push ou db:migrate) + BACKUP feito.
 */
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmPlan, mmSkill, mmSubscription, mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import { MM_DEFAULT_SKILLS } from '@/lib/mentormatch/constants';

const COST = 12; // custo maior em producao

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`[SEED:PROD] variavel obrigatoria ausente: ${name}`);
  }
  return v;
}

async function ensureFreePlan(): Promise<string> {
  const ex = await db.select({ id: mmPlan.id }).from(mmPlan).where(eq(mmPlan.slug, 'free')).limit(1);
  if (ex[0]) return ex[0].id;
  const ins = await db
    .insert(mmPlan)
    .values({ name: 'Free', slug: 'free', priceMonthly: 0, priceYearly: 0 })
    .returning({ id: mmPlan.id });
  return ins[0]!.id;
}

async function ensureSicredi(planId: string): Promise<string> {
  const ex = await db.select({ id: mmTenant.id }).from(mmTenant).where(eq(mmTenant.slug, 'sicredi')).limit(1);
  let id: string;
  if (ex[0]) id = ex[0].id;
  else {
    const ins = await db
      .insert(mmTenant)
      .values({
        name: 'MentorMatch Sicredi',
        slug: 'sicredi',
        brandColor: '#33820D',
        secondaryColor: '#0A4B1E',
        themeKey: 'sicredi',
        planId,
      })
      .returning({ id: mmTenant.id });
    id = ins[0]!.id;
  }
  const sub = await db.select({ id: mmSubscription.id }).from(mmSubscription).where(eq(mmSubscription.tenantId, id)).limit(1);
  if (!sub[0]) await db.insert(mmSubscription).values({ tenantId: id, planId, active: true });
  return id;
}

async function ensureSkills(tenantId: string): Promise<void> {
  for (const name of MM_DEFAULT_SKILLS) {
    const dup = await db
      .select({ id: mmSkill.id })
      .from(mmSkill)
      .where(and(eq(mmSkill.name, name), eq(mmSkill.tenantId, tenantId)))
      .limit(1);
    if (dup[0]) continue;
    await db.insert(mmSkill).values({ name, tenantId });
  }
}

async function ensureSuperAdmin(tenantId: string): Promise<void> {
  const email = requireEnv('SUPER_ADMIN_EMAIL').toLowerCase();
  const password = requireEnv('SUPER_ADMIN_PASSWORD');
  if (password.length < 12) throw new Error('[SEED:PROD] SUPER_ADMIN_PASSWORD deve ter >= 12 caracteres');

  const ex = await db.select({ id: mmUser.id }).from(mmUser).where(eq(mmUser.email, email)).limit(1);
  if (ex[0]) {
    console.log('[SEED:PROD] super admin ja existe — mantido.');
    return;
  }
  const hash = await bcrypt.hash(password, COST);
  await db.insert(mmUser).values({
    email,
    name: 'Super Admin',
    password: hash,
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    onboardingDone: true,
    tenantId,
  });
  console.log('[SEED:PROD] super admin criado.');
}

async function main() {
  requireEnv('POSTGRES_URL');
  const planId = await ensureFreePlan();
  const sicrediId = await ensureSicredi(planId);
  await ensureSkills(sicrediId);
  await ensureSuperAdmin(sicrediId);

  // Guarda de seguranca: producao nao pode conter dados de teste.
  const fake = await db.select({ id: mmUser.id }).from(mmUser).where(eq(mmUser.email, 'mentor1@default.test')).limit(1);
  if (fake[0]) {
    console.warn('[SEED:PROD] AVISO: detectada conta de teste (*.test) no banco. NAO use o seed de dev em producao.');
  }

  console.log(`[SEED:PROD] concluido. tenant sicredi=${sicrediId}. Apenas Sicredi + super admin.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[SEED:PROD] falhou', e);
    process.exit(1);
  });

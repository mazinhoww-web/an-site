/**
 * Seed idempotente de validacao real do MentorMatch (D023 / SEED.md).
 * Standalone: cria tudo que os fluxos E2E precisam. Rodavel N vezes.
 *
 *   POSTGRES_URL=postgres://... pnpm seed
 *
 * Credenciais e o que cada conta representa: ver SEED.md.
 */
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import {
  mmConnection,
  mmNotification,
  mmPlan,
  mmSkill,
  mmSubscription,
  mmTenant,
  mmUser,
  mmUserSkill,
  mmWaitlistEntry,
} from '@/lib/mentormatch/db/schema';

const COST = 10;
const PWD = { admin: 'admin1234', user: 'test1234', super: 'super1234' };

const SKILLS = ['Lideranca', 'Produto', 'Engenharia', 'Carreira', 'Dados', 'Design'];

async function ensurePlan(): Promise<string> {
  const existing = await db.select({ id: mmPlan.id }).from(mmPlan).where(eq(mmPlan.slug, 'free')).limit(1);
  if (existing[0]) return existing[0].id;
  const ins = await db
    .insert(mmPlan)
    .values({ name: 'Free', slug: 'free', priceMonthly: 0, priceYearly: 0 })
    .returning({ id: mmPlan.id });
  return ins[0]!.id;
}

async function ensureTenant(
  t: { name: string; slug: string; brandColor: string; themeKey: string },
  planId: string,
): Promise<string> {
  const existing = await db.select({ id: mmTenant.id }).from(mmTenant).where(eq(mmTenant.slug, t.slug)).limit(1);
  let id: string;
  if (existing[0]) id = existing[0].id;
  else {
    const ins = await db.insert(mmTenant).values({ ...t, planId }).returning({ id: mmTenant.id });
    id = ins[0]!.id;
  }
  const sub = await db.select({ id: mmSubscription.id }).from(mmSubscription).where(eq(mmSubscription.tenantId, id)).limit(1);
  if (!sub[0]) await db.insert(mmSubscription).values({ tenantId: id, planId, active: true });
  return id;
}

async function ensureSkills(tenantId: string): Promise<string[]> {
  const ids: string[] = [];
  for (const name of SKILLS) {
    const ex = await db
      .select({ id: mmSkill.id })
      .from(mmSkill)
      .where(and(eq(mmSkill.name, name), eq(mmSkill.tenantId, tenantId)))
      .limit(1);
    if (ex[0]) ids.push(ex[0].id);
    else {
      const ins = await db.insert(mmSkill).values({ name, tenantId }).returning({ id: mmSkill.id });
      ids.push(ins[0]!.id);
    }
  }
  return ids;
}

interface UserOpts {
  email: string;
  name: string;
  password: string;
  role: string;
  tenantId: string | null;
  canMentor?: boolean;
  canMentee?: boolean;
  headline?: string;
  department?: string;
  bio?: string;
  whatsapp?: string;
}

async function ensureUser(o: UserOpts): Promise<string> {
  const where = o.tenantId
    ? and(eq(mmUser.email, o.email), eq(mmUser.tenantId, o.tenantId))
    : eq(mmUser.email, o.email);
  const ex = await db.select({ id: mmUser.id }).from(mmUser).where(where).limit(1);
  if (ex[0]) return ex[0].id;
  const hash = await bcrypt.hash(o.password, COST);
  const ins = await db
    .insert(mmUser)
    .values({
      email: o.email,
      name: o.name,
      password: hash,
      role: o.role,
      status: 'APPROVED',
      onboardingDone: true,
      canMentor: o.canMentor ?? false,
      canMentee: o.canMentee ?? false,
      headline: o.headline ?? null,
      department: o.department ?? null,
      bio: o.bio ?? null,
      whatsapp: o.whatsapp ?? null,
      tenantId: o.tenantId,
    })
    .returning({ id: mmUser.id });
  return ins[0]!.id;
}

async function ensureTeaching(userId: string, skillId: string): Promise<void> {
  const ex = await db
    .select({ id: mmUserSkill.id })
    .from(mmUserSkill)
    .where(and(eq(mmUserSkill.userId, userId), eq(mmUserSkill.skillId, skillId)))
    .limit(1);
  if (ex[0]) return;
  await db.insert(mmUserSkill).values({ userId, skillId, isTeaching: true });
}

async function ensureConnection(
  mentorId: string,
  menteeId: string,
  tenantId: string,
  status: 'PENDING' | 'ACCEPTED',
): Promise<void> {
  const ex = await db
    .select({ id: mmConnection.id })
    .from(mmConnection)
    .where(and(eq(mmConnection.mentorId, mentorId), eq(mmConnection.menteeId, menteeId), eq(mmConnection.status, status)))
    .limit(1);
  if (ex[0]) return;
  await db.insert(mmConnection).values({
    mentorId,
    menteeId,
    tenantId,
    status,
    startedAt: status === 'ACCEPTED' ? new Date() : null,
    message: status === 'PENDING' ? 'Gostaria de evoluir na carreira com sua ajuda.' : null,
  });
}

async function ensureWaitlist(mentorId: string, menteeId: string, position: number): Promise<void> {
  const ex = await db
    .select({ id: mmWaitlistEntry.id })
    .from(mmWaitlistEntry)
    .where(and(eq(mmWaitlistEntry.mentorId, mentorId), eq(mmWaitlistEntry.menteeId, menteeId)))
    .limit(1);
  if (ex[0]) return;
  await db.insert(mmWaitlistEntry).values({ mentorId, menteeId, position });
}

async function ensureNotification(
  userId: string,
  tenantId: string,
  type: string,
  title: string,
  message: string,
): Promise<void> {
  const ex = await db
    .select({ id: mmNotification.id })
    .from(mmNotification)
    .where(and(eq(mmNotification.userId, userId), eq(mmNotification.type, type), eq(mmNotification.title, title)))
    .limit(1);
  if (ex[0]) return;
  await db.insert(mmNotification).values({ userId, tenantId, type, title, message });
}

const TENANTS = [
  { name: 'MentorMatch Demo', slug: 'default', brandColor: '#6366f1', themeKey: 'dark' },
  { name: 'MentorMatch Sicredi', slug: 'sicredi', brandColor: '#33820D', themeKey: 'sicredi' },
];

// Capacidades alvo por mentor (maxMentees default 4): 0/4, 2/4, 4/4, 0/4, 2/4, 4/4.
const ACCEPTED = [0, 2, 4, 0, 2, 4];
const PENDING = [2, 0, 0, 0, 0, 0];
// mentor3 e mentor6 (lotados) tem fila — mentor6 p/ teste de promocao, mentor3 p/ write.
const WAITLIST = [0, 0, 3, 0, 0, 3];

async function seedTenant(t: (typeof TENANTS)[number], planId: string) {
  const tenantId = await ensureTenant(t, planId);
  const skills = await ensureSkills(tenantId);

  await ensureUser({
    email: `admin@${t.slug}.test`,
    name: `Admin ${t.name}`,
    password: PWD.admin,
    role: 'ADMIN',
    tenantId,
  });

  const mentors: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const id = await ensureUser({
      email: `mentor${i}@${t.slug}.test`,
      name: `Mentor ${i} ${t.slug}`,
      password: PWD.user,
      role: 'MENTOR',
      tenantId,
      canMentor: true,
      headline: 'Senior Product Manager',
      department: i % 2 === 0 ? 'Produto' : 'Tecnologia',
      bio: 'Mais de 10 anos ajudando profissionais a crescer com clareza e foco.',
      whatsapp: `+55119990000${i}`,
    });
    await ensureTeaching(id, skills[(i - 1) % skills.length]!);
    await ensureTeaching(id, skills[i % skills.length]!);
    mentors.push(id);
  }

  const mentees: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const id = await ensureUser({
      email: `mentee${i}@${t.slug}.test`,
      name: `Mentorado ${i} ${t.slug}`,
      password: PWD.user,
      role: 'MENTEE',
      tenantId,
      canMentee: true,
      headline: 'Analista em transicao de carreira',
      department: 'Operacoes',
      bio: 'Buscando direcionamento para o proximo passo na carreira.',
      whatsapp: `+55119991000${i}`,
    });
    mentees.push(id);
  }

  for (let m = 0; m < mentors.length; m++) {
    const mentor = mentors[m]!;
    for (let j = 0; j < ACCEPTED[m]!; j++) {
      await ensureConnection(mentor, mentees[j]!, tenantId, 'ACCEPTED');
    }
    for (let j = 0; j < PENDING[m]!; j++) {
      const mentee = mentees[6 + j]!; // 7,8
      await ensureConnection(mentor, mentee, tenantId, 'PENDING');
      await ensureNotification(
        mentor,
        tenantId,
        'CONNECTION_REQUEST',
        'Nova solicitacao de mentoria',
        'Um mentorado solicitou mentoria.',
      );
    }
    for (let j = 0; j < WAITLIST[m]!; j++) {
      await ensureWaitlist(mentor, mentees[4 + j]!, j + 1); // mentees 5,6,7
    }
  }

  // Conta de MESMO email nos dois tenants (contas distintas e isoladas) — base
  // para o E2E de isolamento cross-tenant (D023.1). Nome difere por tenant.
  await ensureUser({
    email: 'shared@mm.test',
    name: `Compartilhado ${t.slug}`,
    password: PWD.user,
    role: 'MENTEE',
    tenantId,
    canMentee: true,
    headline: `Conta ${t.slug}`,
  });

  // Usuario DUAL (canMentor && canMentee) — base para o E2E de role-switcher.
  await ensureUser({
    email: `dual@${t.slug}.test`,
    name: `Dual ${t.slug}`,
    password: PWD.user,
    role: 'MENTOR',
    tenantId,
    canMentor: true,
    canMentee: true,
    headline: 'Atua como mentor e mentorado',
    department: 'Produto',
  });

  // Notificacao de match aceito para um mentee.
  await ensureNotification(
    mentees[0]!,
    tenantId,
    'CONNECTION_ACCEPTED',
    'Mentoria aceita',
    'Sua solicitacao de mentoria foi aceita.',
  );

  return { tenantId, mentors: mentors.length, mentees: mentees.length };
}

async function main() {
  const planId = await ensurePlan();
  for (const t of TENANTS) {
    const r = await seedTenant(t, planId);
    console.log(`[SEED] ${t.slug}: tenant ${r.tenantId} · ${r.mentors} mentores · ${r.mentees} mentees`);
  }

  // Super admin global (tenant default).
  const def = await db.select({ id: mmTenant.id }).from(mmTenant).where(eq(mmTenant.slug, 'default')).limit(1);
  await ensureUser({
    email: process.env.SUPER_ADMIN_EMAIL ?? 'super@mm.test',
    name: 'Super Admin',
    password: process.env.SUPER_ADMIN_PASSWORD ?? PWD.super,
    role: 'SUPER_ADMIN',
    tenantId: def[0]?.id ?? null,
  });

  console.log('[SEED] concluido.');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[SEED] falhou', e);
    process.exit(1);
  });

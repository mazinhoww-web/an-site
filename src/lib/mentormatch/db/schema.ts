import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  json,
  unique,
  index,
} from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// MentorMatch schema (prefix mm_) — native module inside an-site.
// Same Postgres database, isolated by table prefix. Mirrors the conventions of
// src/db/schema.ts: uuid PK defaultRandom, timestamp defaultNow, json arrays.
//
// Defect corrections baked into the schema:
//  - D-04: mm_skill is per-tenant (tenantId NOT NULL, UNIQUE(name, tenantId)).
//  - D-05: mm_user unique by (email, tenantId), not email-global.
//  - D-08: mm_tenant.maxMenteesPerMentor is a real persisted column.
//  - D-15: no idle Session/Account tables (JWT + verification token only).
// ---------------------------------------------------------------------------

export const mmPlan = pgTable('mm_plan', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  priceMonthly: integer('price_monthly').default(0).notNull(),
  priceYearly: integer('price_yearly').default(0).notNull(),
  maxUsers: integer('max_users').default(50).notNull(),
  maxConnections: integer('max_connections').default(100).notNull(),
  maxLibraryItems: integer('max_library_items').default(10).notNull(),
  maxAdmins: integer('max_admins').default(1).notNull(),
  features: json('features').$type<string[]>().default([]),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mmTenant = pgTable('mm_tenant', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logoUrl: text('logo_url'),
  brandColor: text('brand_color').default('#6366f1').notNull(),
  secondaryColor: text('secondary_color'),
  domain: text('domain').unique(),
  active: boolean('active').default(true).notNull(),
  themeKey: text('theme_key').default('dark').notNull(),
  themeCssUrl: text('theme_css_url'),
  tokens: json('tokens'),
  maxUsers: integer('max_users').default(50).notNull(),
  maxConnections: integer('max_connections').default(100).notNull(),
  maxLibraryItems: integer('max_library_items').default(10).notNull(),
  // D-08: persisted per-tenant limit of mentees per mentor.
  maxMenteesPerMentor: integer('max_mentees_per_mentor').default(4).notNull(),
  planId: uuid('plan_id').references(() => mmPlan.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mmUser = pgTable(
  'mm_user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    name: text('name'),
    // bcrypt hash (cost 10). Credentials provider compares against this.
    password: text('password'),
    image: text('image'),
    role: text('role'), // SUPER_ADMIN | ADMIN | MENTOR | MENTEE | null (papel primario / dashboard ativo)
    // D-22: capacidades de papel (dual-role). `role` segue como papel primario
    // para routing/guards; estas flags habilitam atuar como mentor e/ou mentee.
    canMentor: boolean('can_mentor').default(false).notNull(),
    canMentee: boolean('can_mentee').default(false).notNull(),
    status: text('status').default('PENDING').notNull(), // PENDING|APPROVED|REJECTED|SUSPENDED
    bio: text('bio'),
    headline: text('headline'),
    position: text('position'),
    department: text('department'),
    languages: json('languages').$type<string[]>().default([]),
    education: text('education'),
    experience: text('experience'),
    linkedin: text('linkedin'),
    whatsapp: text('whatsapp'),
    maxMentees: integer('max_mentees').default(4).notNull(),
    onboardingDone: boolean('onboarding_done').default(false).notNull(),
    tenantId: uuid('tenant_id').references(() => mmTenant.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => ({
    // D-05: same email may exist across different tenants.
    emailTenantUnique: unique('mm_user_email_tenant_unique').on(t.email, t.tenantId),
    tenantIdx: index('mm_user_tenant_idx').on(t.tenantId),
    roleTenantIdx: index('mm_user_role_tenant_idx').on(t.role, t.tenantId),
    statusTenantIdx: index('mm_user_status_tenant_idx').on(t.status, t.tenantId),
  }),
);

export const mmSkill = pgTable(
  'mm_skill',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    category: text('category'),
    usageCount: integer('usage_count').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    // D-04: per-tenant catalog.
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => mmTenant.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => ({
    nameTenantUnique: unique('mm_skill_name_tenant_unique').on(t.name, t.tenantId),
    tenantIdx: index('mm_skill_tenant_idx').on(t.tenantId),
  }),
);

export const mmUserSkill = pgTable(
  'mm_user_skill',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => mmUser.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => mmSkill.id, { onDelete: 'cascade' }),
    isTeaching: boolean('is_teaching').default(false).notNull(),
  },
  (t) => ({
    userSkillUnique: unique('mm_user_skill_unique').on(t.userId, t.skillId),
  }),
);

export const mmConnection = pgTable(
  'mm_connection',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mentorId: uuid('mentor_id')
      .notNull()
      .references(() => mmUser.id),
    menteeId: uuid('mentee_id')
      .notNull()
      .references(() => mmUser.id),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => mmTenant.id),
    status: text('status').default('PENDING').notNull(), // PENDING|ACCEPTED|REJECTED|CANCELLED|COMPLETED
    message: text('message'),
    startedAt: timestamp('started_at'),
    endedAt: timestamp('ended_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => ({
    // Allows history (REJECTED) + a new (PENDING) for the same pair.
    mentorMenteeStatusUnique: unique('mm_connection_mentor_mentee_status_unique').on(
      t.mentorId,
      t.menteeId,
      t.status,
    ),
    mentorStatusIdx: index('mm_connection_mentor_status_idx').on(t.mentorId, t.status),
    menteeIdx: index('mm_connection_mentee_idx').on(t.menteeId),
    tenantIdx: index('mm_connection_tenant_idx').on(t.tenantId),
  }),
);

export const mmWaitlistEntry = pgTable(
  'mm_waitlist_entry',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mentorId: uuid('mentor_id')
      .notNull()
      .references(() => mmUser.id),
    menteeId: uuid('mentee_id')
      .notNull()
      .references(() => mmUser.id),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    mentorMenteeUnique: unique('mm_waitlist_mentor_mentee_unique').on(t.mentorId, t.menteeId),
    mentorPositionIdx: index('mm_waitlist_mentor_position_idx').on(t.mentorId, t.position),
  }),
);

export const mmLibraryItem = pgTable(
  'mm_library_item',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    fileUrl: text('file_url').notNull(),
    fileType: text('file_type').default('PDF').notNull(), // PDF|VIDEO|ARTICLE|OTHER
    fileSize: integer('file_size'),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => mmTenant.id),
    uploadedById: uuid('uploaded_by_id').references(() => mmUser.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => ({
    tenantIdx: index('mm_library_tenant_idx').on(t.tenantId),
  }),
);

export const mmInvitation = pgTable(
  'mm_invitation',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => mmTenant.id),
    role: text('role').notNull(),
    token: text('token').unique().notNull(),
    used: boolean('used').default(false).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    invitedById: uuid('invited_by_id').references(() => mmUser.id),
    type: text('type'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    tenantIdx: index('mm_invitation_tenant_idx').on(t.tenantId),
    tokenIdx: index('mm_invitation_token_idx').on(t.token),
  }),
);

export const mmNotification = pgTable(
  'mm_notification',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => mmUser.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => mmTenant.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false).notNull(),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    userReadIdx: index('mm_notification_user_read_idx').on(t.userId, t.read),
    tenantIdx: index('mm_notification_tenant_idx').on(t.tenantId),
  }),
);

export const mmSubscription = pgTable('mm_subscription', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .unique()
    .references(() => mmTenant.id),
  planId: uuid('plan_id')
    .notNull()
    .references(() => mmPlan.id),
  active: boolean('active').default(true).notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mmInvoice = pgTable('mm_invoice', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => mmSubscription.id),
  amount: integer('amount').notNull(),
  currency: text('currency').default('BRL').notNull(),
  status: text('status').default('paid').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mmUsage = pgTable(
  'mm_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    metric: text('metric').notNull(),
    value: integer('value').notNull(),
    period: text('period').notNull(),
  },
  (t) => ({
    tenantMetricPeriodUnique: unique('mm_usage_tenant_metric_period_unique').on(
      t.tenantId,
      t.metric,
      t.period,
    ),
  }),
);

// Rate limiting duravel e compartilhado entre instancias (serverless). Usado
// pelo limitador de auth (login/register/forgot/troca-senha) quando o KV nao
// esta configurado. Chave: `rl:<escopo>:<ip>:<...>`. Janela via reset_at.
export const mmRateLimit = pgTable('mm_rate_limit', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  resetAt: timestamp('reset_at', { withTimezone: true }).notNull(),
});

export const mmVerificationToken = pgTable(
  'mm_verification_token',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    identifier: text('identifier').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires').notNull(),
  },
  (t) => ({
    identifierTokenUnique: unique('mm_verification_identifier_token_unique').on(
      t.identifier,
      t.token,
    ),
  }),
);

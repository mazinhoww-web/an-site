import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  json,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from '@auth/core/adapters';

// ---------------------------------------------------------------------------
// Auth.js tables (required by @auth/drizzle-adapter)
// ---------------------------------------------------------------------------

export const users = pgTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const eventRoleEnum = pgEnum('event_role', [
  'palestrante',
  'painelista',
  'jurado',
  'mediador',
  'mentor',
  'host',
  'convidado',
]);

export const eventTypeEnum = pgEnum('event_type', [
  'summit',
  'painel',
  'meetup',
  'conferencia',
  'workshop',
  'webinar',
  'mesa-redonda',
  'mentoria',
  'demoday',
]);

// ---------------------------------------------------------------------------
// Domain tables
// ---------------------------------------------------------------------------

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  version: text('version').default('1.0.0'),
  blobUrl: text('blob_url').notNull(),
  downloads: integer('downloads').default(0),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name'),
  phone: text('phone'),
  consentNewsletter: boolean('consent_newsletter').default(true),
  consentWhatsapp: boolean('consent_whatsapp').default(false),
  source: text('source'),
  confirmed: boolean('confirmed').default(false),
  confirmationToken: text('confirmation_token'),
  unsubscribeToken: text('unsubscribe_token'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const downloads = pgTable('downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillId: uuid('skill_id')
    .notNull()
    .references(() => skills.id),
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  consentNewsletter: boolean('consent_newsletter').default(false),
  consentWhatsapp: boolean('consent_whatsapp').default(false),
  ipAnonymized: text('ip_anonymized'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  eventType: eventTypeEnum('event_type').notNull(),
  role: eventRoleEnum('role').notNull(),
  topic: text('topic').notNull(),
  descriptionShort: text('description_short').notNull(),
  descriptionMd: text('description_md'),
  contextMd: text('context_md'),
  presentationMd: text('presentation_md'),
  takeawaysMd: text('takeaways_md'),
  eventDate: timestamp('event_date').notNull(),
  eventEndDate: timestamp('event_end_date'),
  city: text('city'),
  state: text('state'),
  country: text('country').default('BR'),
  venue: text('venue'),
  organizer: text('organizer').notNull(),
  audienceSize: integer('audience_size'),
  externalUrl: text('external_url'),
  videoUrl: text('video_url'),
  deckUrl: text('deck_url'),
  imageUrl: text('image_url'),
  tags: json('tags').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const news = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  contentMd: text('content_md').notNull(),
  publishedAt: timestamp('published_at'),
  status: text('status').default('draft'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('new'),
  ipAnonymized: text('ip_anonymized'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const careerChapters = pgTable('career_chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  role: text('role'),
  company: text('company').notNull(),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  isCurrent: boolean('is_current').default(false),
  orderIndex: integer('order_index').default(0),
  contextMd: text('context_md'),
  mandateMd: text('mandate_md'),
  movementMd: text('movement_md'),
  resultMd: text('result_md'),
  learningMd: text('learning_md'),
  tags: json('tags').$type<string[]>().default([]),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const careerHighlights = pgTable('career_highlights', {
  id: uuid('id').primaryKey().defaultRandom(),
  metric: text('metric').notNull(),
  label: text('label').notNull(),
  description: text('description').notNull(),
  orderIndex: integer('order_index').default(0),
  iconName: text('icon_name'),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const frameworks = pgTable('frameworks', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  purpose: text('purpose').notNull(),
  phases: json('phases').$type<string[]>().default([]),
  appliedIn: text('applied_in'),
  orderIndex: integer('order_index').default(0),
  published: boolean('published').default(true),
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  contentMd: text('content_md'),
  tags: json('tags').$type<string[]>().default([]),
  year: integer('year'),
  externalUrl: text('external_url'),
  imageUrl: text('image_url'),
  isFeatured: boolean('is_featured').default(false),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ---------------------------------------------------------------------------
// Newsletter campaigns
// ---------------------------------------------------------------------------

export const newsletterCampaigns = pgTable('newsletter_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: text('subject').notNull(),
  contentMd: text('content_md').notNull(),
  contentHtml: text('content_html'),
  recipientCount: integer('recipient_count').default(0),
  status: text('status').default('draft'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ---------------------------------------------------------------------------
// LinkedIn posts log
// ---------------------------------------------------------------------------

export const linkedinPosts = pgTable('linkedin_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  newsId: uuid('news_id').references(() => news.id),
  linkedinPostId: text('linkedin_post_id'),
  status: text('status').default('pending'),
  postedAt: timestamp('posted_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ---------------------------------------------------------------------------
// Analytics tables
// ---------------------------------------------------------------------------

export const pageAnalytics = pgTable('page_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  visitorId: text('visitor_id'),
  path: text('path').notNull(),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  userAgent: text('user_agent'),
  deviceType: text('device_type'),
  browser: text('browser'),
  os: text('os'),
  country: text('country'),
  region: text('region'),
  city: text('city'),
  ipAnonymized: text('ip_anonymized'),
  timeOnPage: integer('time_on_page'),
  scrollDepth: integer('scroll_depth'),
  bounce: boolean('bounce').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customEvents = pgTable('custom_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  visitorId: text('visitor_id'),
  eventName: text('event_name').notNull(),
  eventProps: json('event_props').default({}),
  path: text('path'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clickEvents = pgTable('click_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  path: text('path').notNull(),
  elementSelector: text('element_selector'),
  xPct: text('x_pct'),
  yPct: text('y_pct'),
  createdAt: timestamp('created_at').defaultNow(),
});

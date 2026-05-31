CREATE TYPE "public"."event_role" AS ENUM('palestrante', 'painelista', 'jurado', 'mediador', 'mentor', 'host', 'convidado');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('summit', 'painel', 'meetup', 'conferencia', 'workshop', 'webinar', 'mesa-redonda', 'mentoria', 'demoday');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "career_chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"role" text,
	"company" text NOT NULL,
	"period_start" timestamp,
	"period_end" timestamp,
	"is_current" boolean DEFAULT false,
	"order_index" integer DEFAULT 0,
	"context_md" text,
	"mandate_md" text,
	"movement_md" text,
	"result_md" text,
	"learning_md" text,
	"tags" json DEFAULT '[]'::json,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "career_chapters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "career_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric" text NOT NULL,
	"label" text NOT NULL,
	"description" text NOT NULL,
	"order_index" integer DEFAULT 0,
	"icon_name" text,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "click_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"path" text NOT NULL,
	"element_selector" text,
	"x_pct" text,
	"y_pct" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new',
	"ip_anonymized" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"visitor_id" text,
	"event_name" text NOT NULL,
	"event_props" json DEFAULT '{}'::json,
	"path" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"consent_newsletter" boolean DEFAULT false,
	"consent_whatsapp" boolean DEFAULT false,
	"ip_anonymized" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"event_type" "event_type" NOT NULL,
	"role" "event_role" NOT NULL,
	"topic" text NOT NULL,
	"description_short" text NOT NULL,
	"description_md" text,
	"context_md" text,
	"presentation_md" text,
	"takeaways_md" text,
	"event_date" timestamp NOT NULL,
	"event_end_date" timestamp,
	"city" text,
	"state" text,
	"country" text DEFAULT 'BR',
	"venue" text,
	"organizer" text NOT NULL,
	"audience_size" integer,
	"external_url" text,
	"video_url" text,
	"deck_url" text,
	"image_url" text,
	"tags" json DEFAULT '[]'::json,
	"featured" boolean DEFAULT false,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"purpose" text NOT NULL,
	"phases" json DEFAULT '[]'::json,
	"applied_in" text,
	"order_index" integer DEFAULT 0,
	"published" boolean DEFAULT true,
	CONSTRAINT "frameworks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "linkedin_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"news_id" uuid,
	"linkedin_post_id" text,
	"status" text DEFAULT 'pending',
	"posted_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_md" text NOT NULL,
	"published_at" timestamp,
	"status" text DEFAULT 'draft',
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text NOT NULL,
	"content_md" text NOT NULL,
	"content_html" text,
	"recipient_count" integer DEFAULT 0,
	"status" text DEFAULT 'draft',
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"visitor_id" text,
	"path" text NOT NULL,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"user_agent" text,
	"device_type" text,
	"browser" text,
	"os" text,
	"country" text,
	"region" text,
	"city" text,
	"ip_anonymized" text,
	"time_on_page" integer,
	"scroll_depth" integer,
	"bounce" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content_md" text,
	"tags" json DEFAULT '[]'::json,
	"year" integer,
	"external_url" text,
	"image_url" text,
	"is_featured" boolean DEFAULT false,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"version" text DEFAULT '1.0.0',
	"blob_url" text,
	"asset_blob_key" text,
	"asset_filename" text,
	"asset_format" text,
	"asset_size_kb" integer,
	"author" text,
	"source_url" text,
	"is_curated" boolean DEFAULT false,
	"downloads" integer DEFAULT 0,
	"stars" integer DEFAULT 0 NOT NULL,
	"usage_rank" integer,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "skills_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"consent_newsletter" boolean DEFAULT true,
	"consent_whatsapp" boolean DEFAULT false,
	"source" text,
	"confirmed" boolean DEFAULT false,
	"confirmation_token" text,
	"unsubscribe_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "mm_connection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" uuid NOT NULL,
	"mentee_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"message" text,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_connection_mentor_mentee_status_unique" UNIQUE("mentor_id","mentee_id","status")
);
--> statement-breakpoint
CREATE TABLE "mm_invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"tenant_id" uuid NOT NULL,
	"role" text NOT NULL,
	"token" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"invited_by_id" uuid,
	"type" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "mm_invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"status" text DEFAULT 'paid' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mm_library_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_type" text DEFAULT 'PDF' NOT NULL,
	"file_size" integer,
	"tenant_id" uuid NOT NULL,
	"uploaded_by_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mm_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mm_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"price_monthly" integer DEFAULT 0 NOT NULL,
	"price_yearly" integer DEFAULT 0 NOT NULL,
	"max_users" integer DEFAULT 50 NOT NULL,
	"max_connections" integer DEFAULT 100 NOT NULL,
	"max_library_items" integer DEFAULT 10 NOT NULL,
	"max_admins" integer DEFAULT 1 NOT NULL,
	"features" json DEFAULT '[]'::json,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_plan_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mm_skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_skill_name_tenant_unique" UNIQUE("name","tenant_id")
);
--> statement-breakpoint
CREATE TABLE "mm_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_subscription_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "mm_tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"brand_color" text DEFAULT '#6366f1' NOT NULL,
	"secondary_color" text,
	"domain" text,
	"active" boolean DEFAULT true NOT NULL,
	"theme_key" text DEFAULT 'dark' NOT NULL,
	"theme_css_url" text,
	"tokens" json,
	"max_users" integer DEFAULT 50 NOT NULL,
	"max_connections" integer DEFAULT 100 NOT NULL,
	"max_library_items" integer DEFAULT 10 NOT NULL,
	"max_mentees_per_mentor" integer DEFAULT 4 NOT NULL,
	"plan_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_tenant_slug_unique" UNIQUE("slug"),
	CONSTRAINT "mm_tenant_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "mm_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"metric" text NOT NULL,
	"value" integer NOT NULL,
	"period" text NOT NULL,
	CONSTRAINT "mm_usage_tenant_metric_period_unique" UNIQUE("tenant_id","metric","period")
);
--> statement-breakpoint
CREATE TABLE "mm_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password" text,
	"image" text,
	"role" text,
	"can_mentor" boolean DEFAULT false NOT NULL,
	"can_mentee" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"bio" text,
	"headline" text,
	"position" text,
	"department" text,
	"languages" json DEFAULT '[]'::json,
	"education" text,
	"experience" text,
	"linkedin" text,
	"whatsapp" text,
	"max_mentees" integer DEFAULT 4 NOT NULL,
	"onboarding_done" boolean DEFAULT false NOT NULL,
	"tenant_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_user_email_tenant_unique" UNIQUE("email","tenant_id")
);
--> statement-breakpoint
CREATE TABLE "mm_user_skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"is_teaching" boolean DEFAULT false NOT NULL,
	CONSTRAINT "mm_user_skill_unique" UNIQUE("user_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "mm_verification_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "mm_verification_token_token_unique" UNIQUE("token"),
	CONSTRAINT "mm_verification_identifier_token_unique" UNIQUE("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "mm_waitlist_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" uuid NOT NULL,
	"mentee_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mm_waitlist_mentor_mentee_unique" UNIQUE("mentor_id","mentee_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_connection" ADD CONSTRAINT "mm_connection_mentor_id_mm_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_connection" ADD CONSTRAINT "mm_connection_mentee_id_mm_user_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_connection" ADD CONSTRAINT "mm_connection_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_invitation" ADD CONSTRAINT "mm_invitation_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_invitation" ADD CONSTRAINT "mm_invitation_invited_by_id_mm_user_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_invoice" ADD CONSTRAINT "mm_invoice_subscription_id_mm_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."mm_subscription"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_library_item" ADD CONSTRAINT "mm_library_item_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_library_item" ADD CONSTRAINT "mm_library_item_uploaded_by_id_mm_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_notification" ADD CONSTRAINT "mm_notification_user_id_mm_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_notification" ADD CONSTRAINT "mm_notification_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_skill" ADD CONSTRAINT "mm_skill_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_subscription" ADD CONSTRAINT "mm_subscription_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_subscription" ADD CONSTRAINT "mm_subscription_plan_id_mm_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."mm_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_tenant" ADD CONSTRAINT "mm_tenant_plan_id_mm_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."mm_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_user" ADD CONSTRAINT "mm_user_tenant_id_mm_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."mm_tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_user_skill" ADD CONSTRAINT "mm_user_skill_user_id_mm_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_user_skill" ADD CONSTRAINT "mm_user_skill_skill_id_mm_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."mm_skill"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_waitlist_entry" ADD CONSTRAINT "mm_waitlist_entry_mentor_id_mm_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mm_waitlist_entry" ADD CONSTRAINT "mm_waitlist_entry_mentee_id_mm_user_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."mm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mm_connection_mentor_status_idx" ON "mm_connection" USING btree ("mentor_id","status");--> statement-breakpoint
CREATE INDEX "mm_connection_mentee_idx" ON "mm_connection" USING btree ("mentee_id");--> statement-breakpoint
CREATE INDEX "mm_connection_tenant_idx" ON "mm_connection" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_invitation_tenant_idx" ON "mm_invitation" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_invitation_token_idx" ON "mm_invitation" USING btree ("token");--> statement-breakpoint
CREATE INDEX "mm_library_tenant_idx" ON "mm_library_item" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_notification_user_read_idx" ON "mm_notification" USING btree ("user_id","read");--> statement-breakpoint
CREATE INDEX "mm_notification_tenant_idx" ON "mm_notification" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_skill_tenant_idx" ON "mm_skill" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_user_tenant_idx" ON "mm_user" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "mm_user_role_tenant_idx" ON "mm_user" USING btree ("role","tenant_id");--> statement-breakpoint
CREATE INDEX "mm_user_status_tenant_idx" ON "mm_user" USING btree ("status","tenant_id");--> statement-breakpoint
CREATE INDEX "mm_waitlist_mentor_position_idx" ON "mm_waitlist_entry" USING btree ("mentor_id","position");
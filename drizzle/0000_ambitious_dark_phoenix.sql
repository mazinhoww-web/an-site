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
	"blob_url" text NOT NULL,
	"downloads" integer DEFAULT 0,
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
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
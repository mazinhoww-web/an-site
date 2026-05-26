-- M8.1: Add asset columns to skills and token columns to downloads

ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "asset_blob_key" text;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "asset_filename" text;

ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "subscriber_id" uuid REFERENCES "subscribers"("id");
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "token" text UNIQUE;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "used_at" timestamp;

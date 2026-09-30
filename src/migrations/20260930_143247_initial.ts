import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"caption" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_work_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "homepage_sizes_items_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_sizes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"height_ft" numeric NOT NULL,
  	"width_ft" numeric NOT NULL,
  	"length_ft" numeric NOT NULL,
  	"capacity_m3" numeric NOT NULL,
  	"hint" varchar,
  	"image_id" integer,
  	"is_default" boolean
  );
  
  CREATE TABLE "homepage_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_why_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage_why_crew" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "homepage_why_creds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" varchar
  );
  
  CREATE TABLE "homepage_coverage_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_booking_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_booking_waste_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tag" varchar,
  	"hero_heading" varchar NOT NULL,
  	"hero_sub" varchar,
  	"hero_primary_cta_label" varchar NOT NULL,
  	"hero_primary_cta_message" varchar NOT NULL,
  	"hero_secondary_cta_label" varchar,
  	"hero_poster_id" integer,
  	"hero_video_id" integer,
  	"work_eyebrow" varchar,
  	"work_heading" varchar NOT NULL,
  	"work_lede" varchar,
  	"work_note" varchar,
  	"moment_label" varchar,
  	"moment_text" varchar NOT NULL,
  	"moment_image_id" integer,
  	"sizes_eyebrow" varchar,
  	"sizes_heading" varchar NOT NULL,
  	"sizes_lede" varchar,
  	"sizes_price_note" varchar,
  	"sizes_max_rental_days" numeric DEFAULT 7 NOT NULL,
  	"sizes_help_title" varchar,
  	"sizes_help_text" varchar,
  	"sizes_help_cta_label" varchar NOT NULL,
  	"sizes_help_cta_message" varchar NOT NULL,
  	"process_eyebrow" varchar,
  	"process_heading" varchar NOT NULL,
  	"why_eyebrow" varchar,
  	"why_heading" varchar NOT NULL,
  	"why_lede" varchar,
  	"why_creds_label" varchar,
  	"coverage_eyebrow" varchar,
  	"coverage_heading" varchar NOT NULL,
  	"coverage_lede" varchar,
  	"coverage_base_name" varchar NOT NULL,
  	"coverage_base_tag" varchar,
  	"coverage_note" varchar,
  	"coverage_background_id" integer,
  	"faq_eyebrow" varchar,
  	"faq_heading" varchar NOT NULL,
  	"booking_eyebrow" varchar,
  	"booking_heading" varchar NOT NULL,
  	"booking_call_text" varchar,
  	"booking_form_title" varchar,
  	"booking_form_sub" varchar,
  	"booking_form_fine" varchar,
  	"booking_background_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_name" varchar NOT NULL,
  	"logo_id" integer,
  	"whatsapp_number" varchar NOT NULL,
  	"phone_display" varchar NOT NULL,
  	"locality" varchar NOT NULL,
  	"region" varchar NOT NULL,
  	"whatsapp_greeting" varchar NOT NULL,
  	"default_whatsapp_message" varchar NOT NULL,
  	"site_url" varchar NOT NULL,
  	"meta_title" varchar NOT NULL,
  	"meta_description" varchar NOT NULL,
  	"og_description" varchar,
  	"og_image_id" integer,
  	"schema_description" varchar,
  	"footer_description" varchar,
  	"footer_description_en" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_figures" ADD CONSTRAINT "homepage_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_work_items" ADD CONSTRAINT "homepage_work_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sizes_items_uses" ADD CONSTRAINT "homepage_sizes_items_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sizes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sizes_items" ADD CONSTRAINT "homepage_sizes_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sizes_items" ADD CONSTRAINT "homepage_sizes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_process_steps" ADD CONSTRAINT "homepage_process_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_process_steps" ADD CONSTRAINT "homepage_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_reasons" ADD CONSTRAINT "homepage_why_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_crew" ADD CONSTRAINT "homepage_why_crew_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_why_crew" ADD CONSTRAINT "homepage_why_crew_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_creds" ADD CONSTRAINT "homepage_why_creds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_coverage_areas" ADD CONSTRAINT "homepage_coverage_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faq_items" ADD CONSTRAINT "homepage_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_booking_points" ADD CONSTRAINT "homepage_booking_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_booking_waste_types" ADD CONSTRAINT "homepage_booking_waste_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_moment_image_id_media_id_fk" FOREIGN KEY ("moment_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_coverage_background_id_media_id_fk" FOREIGN KEY ("coverage_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_booking_background_id_media_id_fk" FOREIGN KEY ("booking_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_figures_order_idx" ON "homepage_figures" USING btree ("_order");
  CREATE INDEX "homepage_figures_parent_id_idx" ON "homepage_figures" USING btree ("_parent_id");
  CREATE INDEX "homepage_work_items_order_idx" ON "homepage_work_items" USING btree ("_order");
  CREATE INDEX "homepage_work_items_parent_id_idx" ON "homepage_work_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_sizes_items_uses_order_idx" ON "homepage_sizes_items_uses" USING btree ("_order");
  CREATE INDEX "homepage_sizes_items_uses_parent_id_idx" ON "homepage_sizes_items_uses" USING btree ("_parent_id");
  CREATE INDEX "homepage_sizes_items_order_idx" ON "homepage_sizes_items" USING btree ("_order");
  CREATE INDEX "homepage_sizes_items_parent_id_idx" ON "homepage_sizes_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_sizes_items_image_idx" ON "homepage_sizes_items" USING btree ("image_id");
  CREATE INDEX "homepage_process_steps_order_idx" ON "homepage_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_process_steps_parent_id_idx" ON "homepage_process_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_process_steps_image_idx" ON "homepage_process_steps" USING btree ("image_id");
  CREATE INDEX "homepage_why_reasons_order_idx" ON "homepage_why_reasons" USING btree ("_order");
  CREATE INDEX "homepage_why_reasons_parent_id_idx" ON "homepage_why_reasons" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_crew_order_idx" ON "homepage_why_crew" USING btree ("_order");
  CREATE INDEX "homepage_why_crew_parent_id_idx" ON "homepage_why_crew" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_crew_image_idx" ON "homepage_why_crew" USING btree ("image_id");
  CREATE INDEX "homepage_why_creds_order_idx" ON "homepage_why_creds" USING btree ("_order");
  CREATE INDEX "homepage_why_creds_parent_id_idx" ON "homepage_why_creds" USING btree ("_parent_id");
  CREATE INDEX "homepage_coverage_areas_order_idx" ON "homepage_coverage_areas" USING btree ("_order");
  CREATE INDEX "homepage_coverage_areas_parent_id_idx" ON "homepage_coverage_areas" USING btree ("_parent_id");
  CREATE INDEX "homepage_faq_items_order_idx" ON "homepage_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_faq_items_parent_id_idx" ON "homepage_faq_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_booking_points_order_idx" ON "homepage_booking_points" USING btree ("_order");
  CREATE INDEX "homepage_booking_points_parent_id_idx" ON "homepage_booking_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_booking_waste_types_order_idx" ON "homepage_booking_waste_types" USING btree ("_order");
  CREATE INDEX "homepage_booking_waste_types_parent_id_idx" ON "homepage_booking_waste_types" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_poster_idx" ON "homepage" USING btree ("hero_poster_id");
  CREATE INDEX "homepage_hero_hero_video_idx" ON "homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_moment_moment_image_idx" ON "homepage" USING btree ("moment_image_id");
  CREATE INDEX "homepage_coverage_coverage_background_idx" ON "homepage" USING btree ("coverage_background_id");
  CREATE INDEX "homepage_booking_booking_background_idx" ON "homepage" USING btree ("booking_background_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_figures" CASCADE;
  DROP TABLE "homepage_work_items" CASCADE;
  DROP TABLE "homepage_sizes_items_uses" CASCADE;
  DROP TABLE "homepage_sizes_items" CASCADE;
  DROP TABLE "homepage_process_steps" CASCADE;
  DROP TABLE "homepage_why_reasons" CASCADE;
  DROP TABLE "homepage_why_crew" CASCADE;
  DROP TABLE "homepage_why_creds" CASCADE;
  DROP TABLE "homepage_coverage_areas" CASCADE;
  DROP TABLE "homepage_faq_items" CASCADE;
  DROP TABLE "homepage_booking_points" CASCADE;
  DROP TABLE "homepage_booking_waste_types" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "site_settings" CASCADE;`)
}

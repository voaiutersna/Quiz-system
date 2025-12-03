CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content_type" text,
	"content_url" text,
	"display_index" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_item_id" uuid NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"display_index" integer
);
--> statement-breakpoint
CREATE TABLE "quiz_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_section_id" uuid NOT NULL,
	"content" text NOT NULL,
	"display_index" integer
);
--> statement-breakpoint
CREATE TABLE "quiz_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid NOT NULL,
	"title" text,
	"display_index" integer,
	"total_score" real NOT NULL,
	"parent_id" uuid,
	"allow_shuffle" boolean DEFAULT false NOT NULL,
	"content" text
);
--> statement-breakpoint
ALTER TABLE "quiz_choices" ADD CONSTRAINT "quiz_choices_quiz_item_id_quiz_items_id_fk" FOREIGN KEY ("quiz_item_id") REFERENCES "public"."quiz_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "quiz_items" ADD CONSTRAINT "quiz_items_quiz_section_id_quiz_sections_id_fk" FOREIGN KEY ("quiz_section_id") REFERENCES "public"."quiz_sections"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "quiz_sections" ADD CONSTRAINT "quiz_sections_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_quiz_choices_item_type" ON "quiz_choices" USING btree ("quiz_item_id","type");--> statement-breakpoint
CREATE INDEX "idx_quiz_item_section_id" ON "quiz_items" USING btree ("quiz_section_id");
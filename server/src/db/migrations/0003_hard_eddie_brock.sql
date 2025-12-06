ALTER TABLE "quiz_choices" ALTER COLUMN "type" SET DEFAULT 'choice';--> statement-breakpoint
ALTER TABLE "quiz_choices" ALTER COLUMN "type" DROP NOT NULL;
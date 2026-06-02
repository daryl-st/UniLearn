-- AlterTable (idempotent for databases synced via db push)
ALTER TABLE "QuizAttempt" ADD COLUMN IF NOT EXISTS "results" JSONB;

-- AlterTable (idempotent for databases synced via db push)
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Resource_cloudinaryPublicId_key" ON "Resource"("cloudinaryPublicId");

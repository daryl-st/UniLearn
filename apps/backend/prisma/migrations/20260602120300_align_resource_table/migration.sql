-- Align Resource table with schema.prisma (status + Cloudinary public id).
DO $$ BEGIN
    CREATE TYPE "ResourceStatus" AS ENUM ('QUEUED', 'PROCESSING', 'READY', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "status" "ResourceStatus" NOT NULL DEFAULT 'QUEUED';
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Resource_cloudinaryPublicId_key" ON "Resource"("cloudinaryPublicId");

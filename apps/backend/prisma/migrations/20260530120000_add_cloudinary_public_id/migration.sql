-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "cloudinaryPublicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Resource_cloudinaryPublicId_key" ON "Resource"("cloudinaryPublicId");

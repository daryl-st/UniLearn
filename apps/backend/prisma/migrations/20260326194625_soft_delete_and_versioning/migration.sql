/*
  Warnings:

  - A unique constraint covering the columns `[fileUrl]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `version` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resource_fileUrl_key" ON "Resource"("fileUrl");

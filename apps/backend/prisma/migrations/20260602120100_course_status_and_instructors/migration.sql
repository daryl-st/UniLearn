-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "status" "CourseStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseInstructor" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseInstructor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CourseInstructor_courseId_instructorId_key" ON "CourseInstructor"("courseId", "instructorId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CourseInstructor_instructorId_idx" ON "CourseInstructor"("instructorId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseInstructor" ADD CONSTRAINT "CourseInstructor_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

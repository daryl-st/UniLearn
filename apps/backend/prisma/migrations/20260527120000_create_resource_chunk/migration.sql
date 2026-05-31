-- CreateTable
CREATE TABLE IF NOT EXISTS "ResourceChunk" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ResourceChunk_resourceId_chunkIndex_key"
ON "ResourceChunk"("resourceId", "chunkIndex");

CREATE INDEX IF NOT EXISTS "ResourceChunk_resourceId_idx"
ON "ResourceChunk"("resourceId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "ResourceChunk"
    ADD CONSTRAINT "ResourceChunk_resourceId_fkey"
    FOREIGN KEY ("resourceId") REFERENCES "Resource"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

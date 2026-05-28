-- Enable pgvector extension.
CREATE EXTENSION IF NOT EXISTS vector;

-- Add native vector column for semantic retrieval.
ALTER TABLE "ResourceChunk"
ADD COLUMN IF NOT EXISTS "embedding_vec" vector(768);

-- Backfill vector column from existing float[] embeddings.
UPDATE "ResourceChunk"
SET "embedding_vec" = ("embedding"::text)::vector
WHERE "embedding" IS NOT NULL
  AND array_length("embedding", 1) > 0
  AND "embedding_vec" IS NULL;

-- IVFFlat index for cosine-style ANN retrieval.
CREATE INDEX IF NOT EXISTS "ResourceChunk_embedding_vec_ivfflat_idx"
ON "ResourceChunk"
USING ivfflat ("embedding_vec" vector_cosine_ops)
WITH (lists = 100);

-- Keep vector column in sync while compatibility Float[] remains in Prisma schema.
CREATE OR REPLACE FUNCTION resource_chunk_sync_embedding_vec()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."embedding" IS NULL OR array_length(NEW."embedding", 1) IS NULL THEN
    NEW."embedding_vec" := NULL;
  ELSE
    NEW."embedding_vec" := (NEW."embedding"::text)::vector;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resource_chunk_sync_embedding_vec ON "ResourceChunk";

CREATE TRIGGER trg_resource_chunk_sync_embedding_vec
BEFORE INSERT OR UPDATE OF "embedding"
ON "ResourceChunk"
FOR EACH ROW
EXECUTE FUNCTION resource_chunk_sync_embedding_vec();

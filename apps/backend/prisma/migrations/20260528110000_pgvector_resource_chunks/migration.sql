-- Requires the pgvector extension (included in docker-compose pgvector/pgvector image;
-- on native Postgres install postgresqlNN-pgvector or equivalent before running this migration).
CREATE EXTENSION IF NOT EXISTS vector;

-- Add native vector column for semantic retrieval.
ALTER TABLE "ResourceChunk"
ADD COLUMN IF NOT EXISTS "embedding_vec" vector(768);

-- float[] text cast uses {a,b,c}; pgvector requires [a,b,c]. Only sync 768-dim embeddings.
CREATE OR REPLACE FUNCTION float_array_to_embedding_vec(arr double precision[])
RETURNS vector(768)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF arr IS NULL OR array_length(arr, 1) IS DISTINCT FROM 768 THEN
    RETURN NULL;
  END IF;
  RETURN ('[' || array_to_string(arr, ',') || ']')::vector(768);
END;
$$;

-- Backfill vector column from existing float[] embeddings.
UPDATE "ResourceChunk"
SET "embedding_vec" = float_array_to_embedding_vec("embedding")
WHERE "embedding" IS NOT NULL
  AND array_length("embedding", 1) = 768
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
  NEW."embedding_vec" := float_array_to_embedding_vec(NEW."embedding");
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resource_chunk_sync_embedding_vec ON "ResourceChunk";

CREATE TRIGGER trg_resource_chunk_sync_embedding_vec
BEFORE INSERT OR UPDATE OF "embedding"
ON "ResourceChunk"
FOR EACH ROW
EXECUTE FUNCTION resource_chunk_sync_embedding_vec();

from __future__ import annotations

import os
from typing import TypedDict

import asyncpg


class RetrievedChunk(TypedDict):
    chunkIndex: int
    pageNumber: int
    content: str
    score: float


_pool: asyncpg.Pool | None = None


def _database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        raise ValueError("DATABASE_URL is not configured for retrieval")
    return url


async def _get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(dsn=_database_url(), min_size=1, max_size=5)
    return _pool


def _vector_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


async def retrieve_top_chunks(
    resource_id: str,
    query_embedding: list[float],
    top_k: int,
) -> list[RetrievedChunk]:
    if not query_embedding:
        return []
    pool = await _get_pool()
    vector = _vector_literal(query_embedding)
    query = """
        SELECT
            "chunkIndex",
            "pageNumber",
            content,
            (1 - ("embedding_vec" <=> $2::vector)) AS score
        FROM "ResourceChunk"
        WHERE "resourceId" = $1
          AND "embedding_vec" IS NOT NULL
        ORDER BY "embedding_vec" <=> $2::vector
        LIMIT $3
    """
    async with pool.acquire() as conn:
        rows = await conn.fetch(query, resource_id, vector, top_k)
    return [
        {
            "chunkIndex": int(r["chunkIndex"]),
            "pageNumber": int(r["pageNumber"]),
            "content": str(r["content"]),
            "score": float(r["score"]),
        }
        for r in rows
    ]

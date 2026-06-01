from __future__ import annotations

import os

from app.services.gemini_generate import extract_text, generate_content

SUMMARY_TIMEOUT_SEC = 120.0
from app.services.retrieval import OrderedChunk


def _default_max_chunks() -> int:
    raw = os.getenv("SUMMARY_MAX_CHUNKS", "").strip()
    if not raw:
        return 15
    return max(1, min(30, int(raw)))


async def generate_resource_summary(
    chunks: list[OrderedChunk],
) -> str:
    if not chunks:
        raise ValueError("No chunks provided for summarization")

    chunks_block = "\n\n".join(
        f"[Page {c['pageNumber']}, chunk {c['chunkIndex']}]\n{c['content']}"
        for c in chunks
    )
    prompt = (
        "You are an academic study assistant. Write a concise revision summary using ONLY "
        "the source excerpts below. Do not invent facts.\n"
        "Format: short overview paragraph, then 3-6 bullet sections with headings "
        "(e.g. Key concepts, Definitions, Takeaways).\n"
        "Keep the total length under 600 words.\n\n"
        f"Source excerpts:\n{chunks_block}"
    )

    data = await generate_content(prompt, timeout_sec=SUMMARY_TIMEOUT_SEC)
    summary = extract_text(data).strip()
    if not summary:
        raise ValueError("Gemini returned an empty summary")
    return summary


def resolve_max_chunks(requested: int | None) -> int:
    if requested is None:
        return _default_max_chunks()
    return max(1, min(30, requested))

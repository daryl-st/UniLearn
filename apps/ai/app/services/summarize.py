from __future__ import annotations

import os

import httpx

from app.services.retrieval import OrderedChunk

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
GEMINI_TIMEOUT_SEC = 45.0


def _gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def _gen_model() -> str:
    return os.getenv("GEMINI_GEN_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"


def _default_max_chunks() -> int:
    raw = os.getenv("SUMMARY_MAX_CHUNKS", "").strip()
    if not raw:
        return 15
    return max(1, min(30, int(raw)))


def _extract_text(data: dict) -> str:
    candidates = data.get("candidates")
    if not isinstance(candidates, list) or not candidates:
        return ""
    content = candidates[0].get("content", {})
    parts = content.get("parts", [])
    texts: list[str] = []
    for p in parts:
        if isinstance(p, dict) and isinstance(p.get("text"), str):
            texts.append(p["text"])
    return "\n".join(texts).strip()


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

    key = _gemini_api_key()
    model = _gen_model()
    url = f"{GEMINI_API_BASE}/models/{model}:generateContent"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    async with httpx.AsyncClient(timeout=GEMINI_TIMEOUT_SEC) as client:
        response = await client.post(url, params={"key": key}, json=payload)
        if response.status_code >= 400:
            raise ValueError(f"Gemini generation failed with status {response.status_code}")
        data = response.json()

    summary = _extract_text(data).strip()
    if not summary:
        raise ValueError("Gemini returned an empty summary")
    return summary


def resolve_max_chunks(requested: int | None) -> int:
    if requested is None:
        return _default_max_chunks()
    return max(1, min(30, requested))

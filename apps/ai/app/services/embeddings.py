"""Gemini embedding helpers."""

from __future__ import annotations

import os

import httpx

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
GEMINI_TIMEOUT_SEC = 30.0


def _gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def _embed_model() -> str:
    return os.getenv("GEMINI_EMBED_MODEL", "text-embedding-004").strip() or "text-embedding-004"


def _extract_embedding(payload: dict) -> list[float]:
    emb = payload.get("embedding")
    if not isinstance(emb, dict):
        raise ValueError("Gemini embed response missing embedding payload")
    values = emb.get("values")
    if not isinstance(values, list):
        raise ValueError("Gemini embed response missing embedding values")
    return [float(v) for v in values]


async def _embed_text_async(text: str) -> list[float]:
    key = _gemini_api_key()
    model = _embed_model()
    url = f"{GEMINI_API_BASE}/models/{model}:embedContent"
    body = {
        "model": f"models/{model}",
        "content": {"parts": [{"text": text}]},
        "taskType": "RETRIEVAL_DOCUMENT",
    }
    async with httpx.AsyncClient(timeout=GEMINI_TIMEOUT_SEC) as client:
        response = await client.post(url, params={"key": key}, json=body)
        if response.status_code >= 400:
            raise ValueError(f"Gemini embedding failed with status {response.status_code}")
        data = response.json()
    return _extract_embedding(data)


async def embed_query(question: str) -> list[float]:
    text = (question or "").strip()
    if not text:
        raise ValueError("Question cannot be empty")
    return await _embed_text_async(text)


async def embed_texts(texts: list[str]) -> list[list[float] | None]:
    out: list[list[float] | None] = []
    for text in texts:
        normalized = (text or "").strip()
        if not normalized:
            out.append(None)
            continue
        out.append(await _embed_text_async(normalized))
    return out

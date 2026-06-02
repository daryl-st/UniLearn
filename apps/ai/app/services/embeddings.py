"""Gemini embedding helpers."""

from __future__ import annotations

import math
import os

import httpx

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
def _embed_timeout_sec() -> float:
    raw = os.getenv("GEMINI_EMBED_TIMEOUT_SEC", "60").strip()
    try:
        return max(10.0, min(120.0, float(raw)))
    except ValueError:
        return 60.0
DEFAULT_EMBED_MODEL = "gemini-embedding-001"
DEFAULT_EMBED_DIMENSIONS = 768


def _gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def _embed_model() -> str:
    return os.getenv("GEMINI_EMBED_MODEL", DEFAULT_EMBED_MODEL).strip() or DEFAULT_EMBED_MODEL


def _embed_dimensions() -> int:
    raw = os.getenv("GEMINI_EMBED_DIMENSIONS", str(DEFAULT_EMBED_DIMENSIONS)).strip()
    try:
        dims = int(raw)
    except ValueError as exc:
        raise ValueError("GEMINI_EMBED_DIMENSIONS must be an integer") from exc
    if dims < 1:
        raise ValueError("GEMINI_EMBED_DIMENSIONS must be positive")
    return dims


def _l2_normalize(values: list[float]) -> list[float]:
    norm = math.sqrt(sum(v * v for v in values))
    if norm == 0:
        return values
    return [v / norm for v in values]


def _extract_embedding(payload: dict, expected_dims: int) -> list[float]:
    emb = payload.get("embedding")
    if not isinstance(emb, dict):
        raise ValueError("Gemini embed response missing embedding payload")
    values = emb.get("values")
    if not isinstance(values, list):
        raise ValueError("Gemini embed response missing embedding values")
    vector = [float(v) for v in values]
    if len(vector) != expected_dims:
        raise ValueError(
            f"Gemini embed returned {len(vector)} dimensions, expected {expected_dims}"
        )
    return vector


async def _embed_text_async(text: str, *, task_type: str) -> list[float]:
    key = _gemini_api_key()
    model = _embed_model()
    dims = _embed_dimensions()
    url = f"{GEMINI_API_BASE}/models/{model}:embedContent"
    body: dict = {
        "model": f"models/{model}",
        "content": {"parts": [{"text": text}]},
        "taskType": task_type,
    }
    if dims != 3072:
        body["outputDimensionality"] = dims

    timeout = _embed_timeout_sec()
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, params={"key": key}, json=body)
    except httpx.TimeoutException as exc:
        raise ValueError(
            f"Gemini embedding timed out after {timeout:.0f}s. Please retry."
        ) from exc

    if response.status_code >= 400:
        detail = response.text.strip()
        msg = f"Gemini embedding failed with status {response.status_code}"
        if detail:
            msg = f"{msg}: {detail}"
        raise ValueError(msg)
    data = response.json()

    vector = _extract_embedding(data, dims)
    if dims != 3072:
        return _l2_normalize(vector)
    return vector


async def embed_query(question: str) -> list[float]:
    text = (question or "").strip()
    if not text:
        raise ValueError("Question cannot be empty")
    return await _embed_text_async(text, task_type="RETRIEVAL_QUERY")


async def embed_texts(texts: list[str]) -> list[list[float] | None]:
    out: list[list[float] | None] = []
    for text in texts:
        normalized = (text or "").strip()
        if not normalized:
            out.append(None)
            continue
        out.append(await _embed_text_async(normalized, task_type="RETRIEVAL_DOCUMENT"))
    return out

"""Shared Gemini generateContent client with retries and clear errors."""

from __future__ import annotations

import asyncio
import os
import re

import httpx

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
DEFAULT_GEN_MODEL = "gemini-2.5-flash"
DEFAULT_FALLBACK_MODELS = "gemini-2.5-flash-lite"
DEFAULT_TIMEOUT_SEC = 45.0


class GeminiApiError(Exception):
    """Gemini API request failed."""

    def __init__(self, message: str, *, status_code: int):
        super().__init__(message)
        self.status_code = status_code


def gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def gen_model() -> str:
    return os.getenv("GEMINI_GEN_MODEL", DEFAULT_GEN_MODEL).strip() or DEFAULT_GEN_MODEL


def gen_models() -> list[str]:
    """Primary model first, then comma-separated fallbacks (deduplicated)."""
    models: list[str] = []
    for name in (gen_model(), *_fallback_models()):
        if name and name not in models:
            models.append(name)
    return models


def _fallback_models() -> list[str]:
    raw = os.getenv("GEMINI_GEN_FALLBACK_MODELS", DEFAULT_FALLBACK_MODELS).strip()
    if not raw:
        return []
    return [m.strip() for m in raw.split(",") if m.strip()]


def _max_retries() -> int:
    raw = os.getenv("GEMINI_GEN_MAX_RETRIES", "3").strip()
    try:
        return max(0, min(5, int(raw)))
    except ValueError:
        return 3


def extract_text(data: dict) -> str:
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


def _error_message(response: httpx.Response, *, model: str) -> str:
    detail = response.text.strip()
    base = f"Gemini generation failed with status {response.status_code} (model {model})"
    if response.status_code == 429:
        base = (
            "Gemini rate limit or daily quota exceeded (429). "
            "Wait a minute and retry, check usage at https://ai.dev/usage, "
            "or set GEMINI_GEN_MODEL / GEMINI_GEN_FALLBACK_MODELS."
        )
    elif response.status_code == 503:
        base = (
            f"Gemini model {model} is temporarily overloaded (503). "
            "Retries and fallback models were attempted."
        )
    if detail:
        return f"{base}: {detail}"
    return base


def _retry_delay_sec(response: httpx.Response, attempt: int) -> float:
    header = response.headers.get("Retry-After")
    if header:
        try:
            return min(60.0, max(1.0, float(header)))
        except ValueError:
            pass
    try:
        data = response.json()
        msg = data.get("error", {}).get("message", "")
        match = re.search(r"retry in ([\d.]+)s", msg, re.IGNORECASE)
        if match:
            return min(60.0, max(1.0, float(match.group(1))))
    except (ValueError, KeyError, TypeError):
        pass
    if response.status_code == 503:
        return min(20.0, 3.0 + attempt * 2.0)
    return min(30.0, 2.0**attempt)


def _should_retry(status_code: int) -> bool:
    return status_code in (429, 500, 503)


def _try_next_model(status_code: int, model: str, models: list[str]) -> bool:
    """Switch to the next model without exhausting retries on overload/quota."""
    if model == models[-1]:
        return False
    return status_code in (503, 429)


async def generate_content(
    prompt: str,
    *,
    timeout_sec: float = DEFAULT_TIMEOUT_SEC,
) -> dict:
    key = gemini_api_key()
    models = gen_models()
    retries = _max_retries()
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    last_error: GeminiApiError | None = None

    async with httpx.AsyncClient(timeout=timeout_sec) as client:
        for model in models:
            url = f"{GEMINI_API_BASE}/models/{model}:generateContent"
            for attempt in range(retries + 1):
                try:
                    response = await client.post(url, params={"key": key}, json=payload)
                except httpx.TimeoutException as exc:
                    last_error = GeminiApiError(
                        f"Gemini request timed out after {timeout_sec:.0f}s (model {model})",
                        status_code=504,
                    )
                    break

                if response.status_code < 400:
                    return response.json()

                last_error = GeminiApiError(
                    _error_message(response, model=model),
                    status_code=response.status_code,
                )

                if _try_next_model(response.status_code, model, models):
                    break

                if attempt < retries and _should_retry(response.status_code):
                    await asyncio.sleep(_retry_delay_sec(response, attempt))
                    continue

                if model == models[-1]:
                    raise last_error
                break

    if last_error:
        raise last_error
    raise GeminiApiError("Gemini generation failed", status_code=503)

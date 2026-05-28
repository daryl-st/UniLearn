from __future__ import annotations

import json
import os
import re

import httpx

from app.models.ask import AskAnswerBody, AskAnswerResponse, AskCitation

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
GEMINI_TIMEOUT_SEC = 45.0


def _gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def _gen_model() -> str:
    return os.getenv("GEMINI_GEN_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"


def _max_context_chunks() -> int:
    raw = os.getenv("RAG_MAX_CONTEXT_CHUNKS", "").strip()
    if not raw:
        return 5
    return max(1, int(raw))


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


def _safe_json_from_text(text: str) -> dict:
    text = text.strip()
    if not text:
        return {}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try extracting first JSON object block.
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return {}
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return {}


async def generate_grounded_answer(body: AskAnswerBody) -> AskAnswerResponse:
    chunks = body.chunks[: _max_context_chunks()]
    citations_block = "\n".join(
        f"- chunkIndex={c.chunkIndex}, pageNumber={c.pageNumber}, score={c.score:.4f}\n{c.content}"
        for c in chunks
    )
    prompt = (
        "You are answering based only on provided chunks.\n"
        "If answer is not present, say you do not have enough context.\n"
        "Return STRICT JSON with keys: answer, citations.\n"
        "citations must be array of {chunkIndex,pageNumber,score} chosen from given chunks.\n\n"
        f"Question:\n{body.question}\n\n"
        f"Chunks:\n{citations_block}"
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

    text = _extract_text(data)
    parsed = _safe_json_from_text(text)
    answer = parsed.get("answer") if isinstance(parsed.get("answer"), str) else text

    raw_citations = parsed.get("citations")
    citations: list[AskCitation] = []
    if isinstance(raw_citations, list):
        for item in raw_citations:
            if not isinstance(item, dict):
                continue
            try:
                citations.append(
                    AskCitation(
                        chunkIndex=int(item.get("chunkIndex")),
                        pageNumber=int(item.get("pageNumber")),
                        score=float(item.get("score")),
                    )
                )
            except (TypeError, ValueError):
                continue

    if not citations:
        citations = [
            AskCitation(
                chunkIndex=c.chunkIndex,
                pageNumber=c.pageNumber,
                score=c.score,
            )
            for c in chunks[:3]
        ]

    return AskAnswerResponse(answer=answer.strip(), citations=citations)

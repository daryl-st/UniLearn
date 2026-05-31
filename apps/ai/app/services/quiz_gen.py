from __future__ import annotations

import json
import os
import re

import httpx

from app.services.retrieval import OrderedChunk

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"
GEMINI_TIMEOUT_SEC = 60.0


def _gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return key


def _gen_model() -> str:
    return os.getenv("GEMINI_GEN_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"


def _default_max_chunks() -> int:
    raw = os.getenv("QUIZ_MAX_CHUNKS", "").strip()
    if not raw:
        return 20
    return max(1, min(30, int(raw)))


def _default_question_count() -> int:
    raw = os.getenv("QUIZ_DEFAULT_QUESTION_COUNT", "").strip()
    if not raw:
        return 8
    return max(3, min(15, int(raw)))


def resolve_max_chunks(requested: int | None) -> int:
    if requested is None:
        return _default_max_chunks()
    return max(1, min(30, requested))


def resolve_question_count(requested: int | None) -> int:
    if requested is None:
        return _default_question_count()
    return max(3, min(15, requested))


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


def _strip_json_fence(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?\s*", "", stripped)
        stripped = re.sub(r"\s*```$", "", stripped)
    return stripped.strip()


def _parse_quiz_json(text: str) -> dict:
    cleaned = _strip_json_fence(text)
    data = json.loads(cleaned)
    if not isinstance(data, dict):
        raise ValueError("Quiz JSON must be an object")
    return data


async def generate_quiz_from_chunks(
    chunks: list[OrderedChunk],
    difficulty: str,
    question_count: int,
) -> dict:
    if not chunks:
        raise ValueError("No chunks provided for quiz generation")

    chunks_block = "\n\n".join(
        f"[Page {c['pageNumber']}, chunk {c['chunkIndex']}]\n{c['content']}"
        for c in chunks
    )
    mcq_count = max(1, question_count - 2)
    short_count = max(1, question_count - mcq_count)

    prompt = (
        "You are an academic quiz generator. Create a practice quiz using ONLY the source "
        "excerpts below. Do not invent facts beyond the text.\n"
        f"Difficulty: {difficulty}.\n"
        f"Return exactly {question_count} questions: about {mcq_count} multiple-choice "
        f"and {short_count} short-answer.\n"
        "Respond with ONLY valid JSON (no markdown) matching this schema:\n"
        "{\n"
        '  "title": "string",\n'
        '  "questions": [\n'
        "    {\n"
        '      "type": "mcq",\n'
        '      "content": "question text",\n'
        '      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },\n'
        '      "correctAns": "A"\n'
        "    },\n"
        "    {\n"
        '      "type": "short",\n'
        '      "content": "question text",\n'
        '      "options": null,\n'
        '      "correctAns": "canonical short answer"\n'
        "    }\n"
        "  ]\n"
        "}\n"
        "Rules: correctAns for mcq must be a single letter A-D; options keys must be A,B,C,D; "
        "short questions must have options null.\n\n"
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

    raw = _extract_text(data)
    if not raw:
        raise ValueError("Gemini returned an empty quiz")

    parsed = _parse_quiz_json(raw)
    title = parsed.get("title")
    questions = parsed.get("questions")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("Quiz JSON missing title")
    if not isinstance(questions, list) or len(questions) < 1:
        raise ValueError("Quiz JSON missing questions")

    return {"title": title.strip(), "questions": questions}

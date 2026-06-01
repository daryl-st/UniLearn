from __future__ import annotations

import json
import os
import re

from app.models.ask import AskAnswerBody, AskAnswerResponse, AskCitation
from app.services.gemini_generate import extract_text, generate_content


def _max_context_chunks() -> int:
    raw = os.getenv("RAG_MAX_CONTEXT_CHUNKS", "").strip()
    if not raw:
        return 5
    return max(1, int(raw))


def _safe_json_from_text(text: str) -> dict:
    text = text.strip()
    if not text:
        return {}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
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

    data = await generate_content(prompt)
    text = extract_text(data)
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

"""
Semantic chunking for PDF page text.

Defaults: CHUNK_MAX_TOKENS=512, CHUNK_MIN_TOKENS=50, encoding cl100k_base (tiktoken).
Chunks are page-aware (no cross-page merge), paragraph-aware, and heading-aware.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import TYPE_CHECKING

from app.services.pdf_extract import PageText

if TYPE_CHECKING:
    import tiktoken as tiktoken_mod

    Encoding = tiktoken_mod.Encoding
else:
    Encoding = object

CHUNK_MAX_TOKENS_DEFAULT = 512
CHUNK_MIN_TOKENS_DEFAULT = 50
CHUNK_TOKEN_ENCODING_DEFAULT = "cl100k_base"

_HEADING_NUMBERED = re.compile(r"^\d+(?:\.\d+)*(?:\.?\s+)\S")
_HEADING_MARKDOWN = re.compile(r"^#{1,6}\s+\S")
_HEADING_KEYWORD = re.compile(
    r"^(chapter|section|unit|part|appendix)\b",
    re.IGNORECASE,
)
_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


@dataclass(frozen=True)
class SemanticChunk:
    page_number: int
    content: str
    token_count: int


def _chunk_max_tokens() -> int:
    raw = os.getenv("CHUNK_MAX_TOKENS", "").strip()
    if not raw:
        return CHUNK_MAX_TOKENS_DEFAULT
    return max(1, int(raw))


def _chunk_min_tokens() -> int:
    raw = os.getenv("CHUNK_MIN_TOKENS", "").strip()
    if not raw:
        return CHUNK_MIN_TOKENS_DEFAULT
    return max(0, int(raw))


def _encoding_name() -> str:
    return os.getenv("CHUNK_TOKEN_ENCODING", CHUNK_TOKEN_ENCODING_DEFAULT).strip() or (
        CHUNK_TOKEN_ENCODING_DEFAULT
    )


_encoding_cache: Encoding | None | bool = False  # False = uninitialized


def _get_encoding() -> Encoding | None:
    """Return tiktoken encoding, or None if tiktoken is unavailable."""
    global _encoding_cache
    if _encoding_cache is False:
        try:
            import tiktoken

            _encoding_cache = tiktoken.get_encoding(_encoding_name())
        except Exception:  # ImportError, PyO3 version mismatch, etc.
            _encoding_cache = None
    if _encoding_cache is None:
        return None
    return _encoding_cache


def count_tokens(text: str) -> int:
    if not text:
        return 0
    enc = _get_encoding()
    if enc is not None:
        return len(enc.encode(text))
    return max(1, (len(text) + 3) // 4)


def _split_by_token_budget(text: str, max_tokens: int) -> list[str]:
    enc = _get_encoding()
    if enc is not None:
        tokens = enc.encode(text)
        slices: list[str] = []
        for i in range(0, len(tokens), max_tokens):
            slices.append(enc.decode(tokens[i : i + max_tokens]))
        return slices
    max_chars = max(1, max_tokens * 4)
    return [text[i : i + max_chars] for i in range(0, len(text), max_chars)]


def is_heading_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if _HEADING_NUMBERED.match(stripped):
        return True
    if _HEADING_MARKDOWN.match(stripped):
        return True
    if _HEADING_KEYWORD.match(stripped):
        return True
    if len(stripped) <= 80 and stripped.isupper() and any(c.isalpha() for c in stripped):
        return True
    return False


def _split_paragraphs(page_text: str) -> list[tuple[str, bool]]:
    """Return (paragraph_text, starts_with_heading) per paragraph."""
    blocks = re.split(r"\n\s*\n+", page_text.strip())
    result: list[tuple[str, bool]] = []
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        first_line = block.split("\n", 1)[0]
        result.append((block, is_heading_line(first_line)))
    return result


def _split_oversized_paragraph(text: str, max_tokens: int) -> list[str]:
    if count_tokens(text) <= max_tokens:
        return [text]
    parts = _SENTENCE_SPLIT.split(text)
    if len(parts) <= 1:
        return _split_by_token_budget(text, max_tokens)
    segments: list[str] = []
    current = ""
    for part in parts:
        candidate = f"{current} {part}".strip() if current else part
        if count_tokens(candidate) <= max_tokens:
            current = candidate
        else:
            if current:
                segments.append(current)
            if count_tokens(part) > max_tokens:
                segments.extend(_split_oversized_paragraph(part, max_tokens))
                current = ""
            else:
                current = part
    if current:
        segments.append(current)
    return segments


def _chunk_page(page: PageText, max_tokens: int, min_tokens: int) -> list[SemanticChunk]:
    paragraphs = _split_paragraphs(page.text)
    if not paragraphs:
        return []

    segments: list[tuple[str, bool]] = []
    for para, is_heading in paragraphs:
        for piece in _split_oversized_paragraph(para, max_tokens):
            segments.append((piece, is_heading))

    chunks: list[SemanticChunk] = []
    current_parts: list[str] = []
    current_tokens = 0

    def flush() -> None:
        nonlocal current_parts, current_tokens
        if not current_parts:
            return
        content = "\n\n".join(current_parts)
        chunks.append(
            SemanticChunk(
                page_number=page.page_number,
                content=content,
                token_count=count_tokens(content),
            )
        )
        current_parts = []
        current_tokens = 0

    for segment_text, is_heading in segments:
        seg_tokens = count_tokens(segment_text)
        if is_heading and current_parts:
            flush()
        if current_parts and current_tokens + seg_tokens > max_tokens:
            flush()
        if not current_parts:
            current_parts = [segment_text]
            current_tokens = seg_tokens
            continue
        if current_tokens + seg_tokens <= max_tokens:
            current_parts.append(segment_text)
            current_tokens += seg_tokens
        else:
            flush()
            current_parts = [segment_text]
            current_tokens = seg_tokens

    flush()

    if min_tokens <= 0 or len(chunks) <= 1:
        return chunks

    merged: list[SemanticChunk] = []
    i = 0
    while i < len(chunks):
        chunk = chunks[i]
        if chunk.token_count < min_tokens and i + 1 < len(chunks):
            nxt = chunks[i + 1]
            if nxt.page_number == chunk.page_number:
                combined = f"{chunk.content}\n\n{nxt.content}"
                combined_tokens = count_tokens(combined)
                if combined_tokens <= max_tokens:
                    merged.append(
                        SemanticChunk(
                            page_number=chunk.page_number,
                            content=combined,
                            token_count=combined_tokens,
                        )
                    )
                    i += 2
                    continue
        merged.append(chunk)
        i += 1
    return merged


def semantic_chunk_pages(pages: list[PageText]) -> list[SemanticChunk]:
    max_tokens = _chunk_max_tokens()
    min_tokens = _chunk_min_tokens()
    out: list[SemanticChunk] = []
    for page in pages:
        out.extend(_chunk_page(page, max_tokens, min_tokens))
    return out

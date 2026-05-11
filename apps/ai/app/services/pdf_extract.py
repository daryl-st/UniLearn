import os
import re
from urllib.parse import urlparse

import fitz
import httpx

from app.models.extract import ExtractMetadata, ExtractResponse

PDF_MAGIC = b"%PDF-"
MAX_PDF_BYTES_DEFAULT = 15 * 1024 * 1024
URL_FETCH_TIMEOUT_SEC = 30.0


def _max_pdf_bytes() -> int:
    raw = os.getenv("EXTRACT_MAX_PDF_BYTES", "").strip()
    if not raw:
        return MAX_PDF_BYTES_DEFAULT
    return max(1, int(raw))


def _parse_allowed_hosts() -> set[str]:
    raw = os.getenv("EXTRACT_URL_ALLOWED_HOSTS", "").strip()
    if not raw:
        return set()
    return {h.strip().lower() for h in raw.split(",") if h.strip()}


def is_url_host_allowed(url: str) -> tuple[bool, str]:
    """Returns (ok, reason). Used by tests and URL extraction."""
    allowed = _parse_allowed_hosts()
    if not allowed:
        return False, "URL extraction is disabled (EXTRACT_URL_ALLOWED_HOSTS is empty)"
    try:
        parsed = urlparse(url)
    except Exception as exc:  # pragma: no cover - urlparse rarely fails
        return False, f"Invalid URL: {exc}"
    host = (parsed.hostname or "").lower()
    if not host:
        return False, "URL has no hostname"
    if host not in allowed:
        return False, f"Host {host!r} is not allowed"
    scheme = (parsed.scheme or "").lower()
    if scheme == "https":
        return True, ""
    if scheme == "http" and host in ("localhost", "127.0.0.1"):
        return True, ""
    return False, "Only https is allowed (http permitted only for localhost / 127.0.0.1)"


def clean_text(raw: str) -> str:
    """Normalize whitespace; strip lines; collapse excessive blank lines."""
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in raw.splitlines()]
    out_lines: list[str] = []
    prev_blank = True
    for line in lines:
        if not line:
            if not prev_blank:
                out_lines.append("")
            prev_blank = True
        else:
            out_lines.append(line)
            prev_blank = False
    text = "\n".join(out_lines).strip()
    return re.sub(r"\n{3,}", "\n\n", text)


def extract_from_pdf_bytes(data: bytes) -> ExtractResponse:
    if len(data) > _max_pdf_bytes():
        raise ValueError("PDF exceeds maximum allowed size")
    if not data.startswith(PDF_MAGIC):
        raise ValueError("File does not look like a PDF (missing %PDF- header)")

    warnings: list[str] = []
    doc = fitz.open(stream=data, filetype="pdf")
    try:
        meta = doc.metadata or {}
        title = meta.get("title") or None
        author = meta.get("author") or None
        if title == "":
            title = None
        if author == "":
            author = None
        page_count = doc.page_count
        parts: list[str] = []
        for page_index in range(page_count):
            page = doc.load_page(page_index)
            try:
                block = page.get_text("text", sort=True)
            except TypeError:
                block = page.get_text("text")
                warnings.append("PDF text extracted without sort=True (older PyMuPDF API)")
            block = block or ""
            parts.append(block.strip())
        raw_text = "\n\n".join(p for p in parts if p)
        text = clean_text(raw_text)
        return ExtractResponse(
            text=text,
            metadata=ExtractMetadata(
                title=title,
                author=author,
                page_count=page_count,
            ),
            warnings=warnings,
        )
    finally:
        doc.close()


async def download_pdf_bytes(url: str) -> bytes:
    ok, reason = is_url_host_allowed(url)
    if not ok:
        raise ValueError(reason)

    max_bytes = _max_pdf_bytes()
    limits = httpx.Limits(max_keepalive_connections=5, max_connections=5)
    async with httpx.AsyncClient(
        timeout=URL_FETCH_TIMEOUT_SEC,
        follow_redirects=False,
        limits=limits,
    ) as client:
        async with client.stream("GET", url) as response:
            if response.status_code >= 400:
                raise ValueError(f"URL returned status {response.status_code}")
            total = 0
            chunks: list[bytes] = []
            async for chunk in response.aiter_bytes():
                total += len(chunk)
                if total > max_bytes:
                    raise ValueError("Downloaded PDF exceeds maximum allowed size")
                chunks.append(chunk)
            data = b"".join(chunks)
    if not data.startswith(PDF_MAGIC):
        raise ValueError("Downloaded content does not look like a PDF")
    return data

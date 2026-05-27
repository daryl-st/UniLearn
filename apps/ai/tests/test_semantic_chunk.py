import pytest

from app.services.pdf_extract import PageText
from app.services.semantic_chunk import (
    count_tokens,
    is_heading_line,
    semantic_chunk_pages,
)


def test_is_heading_line_patterns() -> None:
    assert is_heading_line("1. Introduction")
    assert is_heading_line("2.3.1 Details")
    assert is_heading_line("# Overview")
    assert is_heading_line("Chapter 3: Networks")
    assert is_heading_line("SECTION SUMMARY")
    assert not is_heading_line("This is a normal sentence about things.")


def test_paragraphs_not_split_mid_block() -> None:
    page = PageText(
        page_number=1,
        text="First paragraph stays whole.\n\nSecond paragraph also stays whole.",
    )
    chunks = semantic_chunk_pages([page])
    assert len(chunks) == 1
    assert "First paragraph" in chunks[0].content
    assert "Second paragraph" in chunks[0].content


def test_heading_starts_new_chunk(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CHUNK_MAX_TOKENS", "2000")
    monkeypatch.setenv("CHUNK_MIN_TOKENS", "0")
    page = PageText(
        page_number=1,
        text="Intro body text here.\n\n2. Methods\n\nMethods body continues.",
    )
    chunks = semantic_chunk_pages([page])
    assert len(chunks) >= 2
    assert any("2. Methods" in c.content for c in chunks)


def test_page_boundaries_not_merged() -> None:
    pages = [
        PageText(page_number=1, text="Content on page one."),
        PageText(page_number=2, text="Content on page two."),
    ]
    chunks = semantic_chunk_pages(pages)
    page_numbers = {c.page_number for c in chunks}
    assert 1 in page_numbers
    assert 2 in page_numbers
    assert all(c.page_number == 1 for c in chunks if "page one" in c.content)
    assert all(c.page_number == 2 for c in chunks if "page two" in c.content)


def test_token_budget_splits_large_paragraph(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CHUNK_MAX_TOKENS", "20")
    monkeypatch.setenv("CHUNK_MIN_TOKENS", "0")
    long_sentence = "Word " * 200
    page = PageText(page_number=1, text=long_sentence.strip())
    chunks = semantic_chunk_pages([page])
    assert len(chunks) > 1
    for chunk in chunks:
        assert chunk.token_count <= 20


def test_count_tokens_nonzero() -> None:
    assert count_tokens("hello world") > 0

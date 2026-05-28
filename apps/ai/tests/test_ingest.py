import asyncio
import uuid
from unittest.mock import AsyncMock, patch

import fitz
import pytest
from starlette.testclient import TestClient

from app.main import app
from app.services.ingest_pipeline import ingest_resource


def _minimal_pdf_bytes() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "HelloIngestTest")
    data = doc.tobytes()
    doc.close()
    return data


def test_ingest_resource_pipeline_unit() -> None:
    pdf = _minimal_pdf_bytes()
    resource_id = uuid.uuid4()

    async def run() -> None:
        with patch(
            "app.services.ingest_pipeline.download_pdf_bytes",
            new=AsyncMock(return_value=pdf),
        ), patch(
            "app.services.ingest_pipeline.embed_texts",
            new=AsyncMock(return_value=[None]),
        ):
            result = await ingest_resource(resource_id, "https://example.com/test.pdf")

        assert result.resource_id == resource_id
        assert result.metadata.page_count == 1
        assert len(result.chunks) >= 1
        assert "HelloIngestTest" in result.chunks[0].content
        assert result.chunks[0].chunk_index == 0
        assert result.chunks[0].page_number == 1
        assert result.chunks[0].token_count > 0
        assert result.chunks[0].embedding is None

    asyncio.run(run())


def test_ingest_resource_route_success(monkeypatch: pytest.MonkeyPatch) -> None:
    pdf = _minimal_pdf_bytes()
    resource_id = uuid.uuid4()

    async def fake_download(_url: str) -> bytes:
        return pdf

    monkeypatch.setattr(
        "app.services.ingest_pipeline.download_pdf_bytes",
        fake_download,
    )
    monkeypatch.setattr(
        "app.services.ingest_pipeline.embed_texts",
        AsyncMock(return_value=[None]),
    )

    client = TestClient(app)
    response = client.post(
        "/ingest/resource",
        json={
            "resource_id": str(resource_id),
            "pdf_url": "https://example.com/doc.pdf",
        },
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["resource_id"] == str(resource_id)
    assert len(body["chunks"]) >= 1
    assert body["chunks"][0]["embedding"] is None


def test_ingest_resource_missing_key() -> None:
    client = TestClient(app)
    response = client.post(
        "/ingest/resource",
        json={
            "resource_id": str(uuid.uuid4()),
            "pdf_url": "https://example.com/doc.pdf",
        },
    )
    assert response.status_code == 401


def test_ingest_resource_download_error(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fail_download(_url: str) -> bytes:
        raise ValueError("URL extraction is disabled")

    monkeypatch.setattr(
        "app.services.ingest_pipeline.download_pdf_bytes",
        fail_download,
    )

    client = TestClient(app)
    response = client.post(
        "/ingest/resource",
        json={
            "resource_id": str(uuid.uuid4()),
            "pdf_url": "https://example.com/doc.pdf",
        },
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 400

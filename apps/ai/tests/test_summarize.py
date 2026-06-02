from unittest.mock import AsyncMock

import pytest
from starlette.testclient import TestClient

from app.main import app


def test_rag_summarize_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.summarize.retrieve_chunks_ordered",
        AsyncMock(
            return_value=[
                {
                    "chunkIndex": 0,
                    "pageNumber": 1,
                    "content": "Introduction to machine learning.",
                }
            ]
        ),
    )
    monkeypatch.setattr(
        "app.api.routes.summarize.generate_resource_summary",
        AsyncMock(return_value="## Overview\n- Key topic: ML basics"),
    )
    client = TestClient(app)
    response = client.post(
        "/rag/summarize",
        json={"resourceId": "res-1", "maxChunks": 10},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["resourceId"] == "res-1"
    assert "Overview" in body["summary"]


def test_rag_summarize_no_chunks(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.summarize.retrieve_chunks_ordered",
        AsyncMock(return_value=[]),
    )
    client = TestClient(app)
    response = client.post(
        "/rag/summarize",
        json={"resourceId": "res-empty"},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 400
    assert "not indexed" in response.json()["detail"].lower()


def test_rag_summarize_missing_key() -> None:
    client = TestClient(app)
    response = client.post("/rag/summarize", json={"resourceId": "res-1"})
    assert response.status_code == 401

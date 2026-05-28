from unittest.mock import AsyncMock

import pytest
from starlette.testclient import TestClient

from app.main import app


def test_ask_embed_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.ask.embed_query",
        AsyncMock(return_value=[0.1, 0.2, 0.3]),
    )
    client = TestClient(app)
    response = client.post(
        "/ask/embed",
        json={"question": "What is AI?"},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    assert response.json()["embedding"] == [0.1, 0.2, 0.3]


def test_ask_answer_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.ask.generate_grounded_answer",
        AsyncMock(
            return_value={
                "answer": "Artificial intelligence is a field of study.",
                "citations": [{"chunkIndex": 0, "pageNumber": 1, "score": 0.9}],
            }
        ),
    )
    client = TestClient(app)
    response = client.post(
        "/ask/answer",
        json={
            "question": "What is AI?",
            "chunks": [
                {
                    "chunkIndex": 0,
                    "pageNumber": 1,
                    "content": "AI studies intelligent agents.",
                    "score": 0.9,
                }
            ],
        },
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["answer"]
    assert isinstance(body["citations"], list)


def test_ask_embed_missing_key() -> None:
    client = TestClient(app)
    response = client.post("/ask/embed", json={"question": "Hi"})
    assert response.status_code == 401

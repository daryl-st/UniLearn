from unittest.mock import AsyncMock

import pytest
from starlette.testclient import TestClient

from app.main import app


def test_rag_generate_quiz_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.generate_quiz.retrieve_chunks_ordered",
        AsyncMock(
            return_value=[
                {
                    "chunkIndex": 0,
                    "pageNumber": 1,
                    "content": "Machine learning is a subset of AI.",
                }
            ]
        ),
    )
    monkeypatch.setattr(
        "app.api.routes.generate_quiz.generate_quiz_from_chunks",
        AsyncMock(
            return_value={
                "title": "ML Basics Quiz",
                "questions": [
                    {
                        "type": "mcq",
                        "content": "What is ML a subset of?",
                        "options": {
                            "A": "AI",
                            "B": "Databases",
                            "C": "Networks",
                            "D": "Graphics",
                        },
                        "correctAns": "A",
                    },
                    {
                        "type": "short",
                        "content": "Define machine learning in one phrase.",
                        "options": None,
                        "correctAns": "subset of artificial intelligence",
                    },
                    {
                        "type": "mcq",
                        "content": "Which field uses labeled data?",
                        "options": {
                            "A": "Supervised learning",
                            "B": "Unsupervised only",
                            "C": "Cryptography",
                            "D": "Compilers",
                        },
                        "correctAns": "A",
                    },
                ],
            }
        ),
    )
    client = TestClient(app)
    response = client.post(
        "/rag/generate-quiz",
        json={
            "resourceId": "res-1",
            "difficulty": "MEDIUM",
            "questionCount": 3,
        },
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["resourceId"] == "res-1"
    assert body["title"] == "ML Basics Quiz"
    assert len(body["questions"]) == 3
    assert body["questions"][0]["type"] == "mcq"


def test_rag_generate_quiz_no_chunks(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.api.routes.generate_quiz.retrieve_chunks_ordered",
        AsyncMock(return_value=[]),
    )
    client = TestClient(app)
    response = client.post(
        "/rag/generate-quiz",
        json={"resourceId": "res-empty", "difficulty": "EASY"},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 400
    assert "not indexed" in response.json()["detail"].lower()


def test_rag_generate_quiz_missing_key() -> None:
    client = TestClient(app)
    response = client.post(
        "/rag/generate-quiz",
        json={"resourceId": "res-1", "difficulty": "HARD"},
    )
    assert response.status_code == 401

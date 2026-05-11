import os

import pytest


@pytest.fixture(autouse=True)
def internal_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AI_INTERNAL_API_KEY", "test-internal-key")

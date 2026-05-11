import fitz
import pytest
from starlette.testclient import TestClient

from app.main import app
from app.services.pdf_extract import is_url_host_allowed


def _minimal_pdf_bytes() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "HelloExtractTest")
    data = doc.tobytes()
    doc.close()
    return data


def test_extract_file_success() -> None:
    client = TestClient(app)
    pdf = _minimal_pdf_bytes()
    response = client.post(
        "/extract/file",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "HelloExtractTest" in body["text"]
    assert body["metadata"]["page_count"] == 1
    assert isinstance(body.get("warnings"), list)


def test_extract_file_missing_key() -> None:
    client = TestClient(app)
    pdf = _minimal_pdf_bytes()
    response = client.post(
        "/extract/file",
        files={"file": ("test.pdf", pdf, "application/pdf")},
    )
    assert response.status_code == 401


def test_extract_file_not_pdf() -> None:
    client = TestClient(app)
    response = client.post(
        "/extract/file",
        files={"file": ("x.txt", b"not a pdf", "text/plain")},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 400


def test_url_host_allowlist_empty(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("EXTRACT_URL_ALLOWED_HOSTS", raising=False)
    ok, reason = is_url_host_allowed("https://example.com/a.pdf")
    assert ok is False
    assert "disabled" in reason.lower()


def test_url_host_allowlist_match(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("EXTRACT_URL_ALLOWED_HOSTS", "example.com,cdn.test")
    ok, _ = is_url_host_allowed("https://example.com/file.pdf")
    assert ok is True
    ok2, _ = is_url_host_allowed("https://cdn.test/x.pdf")
    assert ok2 is True


def test_url_host_not_in_list(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("EXTRACT_URL_ALLOWED_HOSTS", "safe.example.com")
    ok, reason = is_url_host_allowed("https://evil.com/x.pdf")
    assert ok is False
    assert "not allowed" in reason.lower()


def test_url_localhost_http_allowed(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("EXTRACT_URL_ALLOWED_HOSTS", "localhost")
    ok, _ = is_url_host_allowed("http://localhost:8080/file.pdf")
    assert ok is True


def test_extract_url_disabled_without_allowlist() -> None:
    client = TestClient(app)
    response = client.post(
        "/extract/url",
        json={"url": "https://example.com/a.pdf"},
        headers={"X-Internal-API-Key": "test-internal-key"},
    )
    assert response.status_code == 400

# UniLearn AI service

FastAPI app for LLM and NLP work. Intended to be called only from the Node backend, not from browsers.

## Requirements

- Python 3.10 or newer

## Setup

```bash
cd apps/ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

On startup, [`app/main.py`](app/main.py) loads **`apps/ai/.env`** automatically (via `python-dotenv`). Shell `export` is optional. Existing environment variables still take precedence over values in `.env`.

For running tests:

```bash
pip install -r requirements-dev.txt
```

## Run locally

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: `GET http://localhost:8000/health`

Internal extract (require header `X-Internal-API-Key` matching `AI_INTERNAL_API_KEY`):

- `POST /extract/file` — multipart form field `file` (PDF).
- `POST /extract/url` — JSON `{"url":"https://..."}`; host must appear in `EXTRACT_URL_ALLOWED_HOSTS`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `CORS_ORIGINS` | Comma-separated list of origins allowed by CORS (e.g. the Node API gateway). Default: `http://localhost:4000`. Set empty to disable CORS middleware. |
| `AI_INTERNAL_API_KEY` | Required for `/extract/*`. Must match the Node backend `AI_INTERNAL_API_KEY`. |
| `EXTRACT_URL_ALLOWED_HOSTS` | Comma-separated hostnames allowed for `/extract/url`. If empty, URL extraction returns 400. |
| `EXTRACT_MAX_PDF_BYTES` | Optional max PDF size in bytes (default ~15 MiB). |

## Layout

| Path | Role |
|------|------|
| `app/main.py` | FastAPI app, middleware, router wiring |
| `app/api/routes/` | HTTP route modules |
| `app/models/` | Pydantic schemas (request/response) |
| `app/services/` | Domain logic and future LLM clients |

Runtime dependencies are pinned in `requirements.txt` (used by Docker). Optional dev tools are in `requirements-dev.txt` and `[project.optional-dependencies] dev` in `pyproject.toml`.

## CORS note

CORS applies to browsers. Server-to-server calls from Node often omit the `Origin` header. The middleware is configured so browser-based development or tooling against this service still works when the gateway origin is listed.

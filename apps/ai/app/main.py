import os
from pathlib import Path

from dotenv import load_dotenv

# Load apps/ai/.env before reading any configuration from the environment.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import ask, extract, generate_quiz, health, ingest, rag, summarize
from app.services.gemini_generate import GeminiApiError
from app.services.retrieval import DatabaseUnavailableError


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "http://localhost:4000").strip()
    if not raw:
        return []
    return [o.strip() for o in raw.split(",") if o.strip()]


app = FastAPI(
    title="UniLearn AI",
    description="Internal AI / NLP service for UniLearn (Node backend only).",
    version="0.1.0",
)


@app.exception_handler(DatabaseUnavailableError)
async def database_unavailable_handler(
    _request: Request, exc: DatabaseUnavailableError
) -> JSONResponse:
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.exception_handler(GeminiApiError)
async def gemini_api_error_handler(_request: Request, exc: GeminiApiError) -> JSONResponse:
    status = exc.status_code if 400 <= exc.status_code < 600 else 502
    return JSONResponse(status_code=status, content={"detail": str(exc)})


_origins = _parse_cors_origins()
if _origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(health.router, tags=["health"])
app.include_router(extract.router)
app.include_router(ingest.router)
app.include_router(ask.router)
app.include_router(rag.router)
app.include_router(summarize.router)
app.include_router(generate_quiz.router)

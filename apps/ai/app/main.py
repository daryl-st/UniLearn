import os
from pathlib import Path

from dotenv import load_dotenv

# Load apps/ai/.env before reading any configuration from the environment.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import extract, health, ingest


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

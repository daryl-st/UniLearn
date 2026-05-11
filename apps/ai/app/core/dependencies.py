import os

from fastapi import Header, HTTPException, status


async def verify_internal_key(
    x_internal_api_key: str | None = Header(None, alias="X-Internal-API-Key"),
) -> None:
    expected = os.getenv("AI_INTERNAL_API_KEY")
    if not expected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI_INTERNAL_API_KEY is not configured",
        )
    if not x_internal_api_key or x_internal_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key",
        )

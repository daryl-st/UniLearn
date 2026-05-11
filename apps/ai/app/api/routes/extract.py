from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.dependencies import verify_internal_key
from app.models.extract import ExtractResponse, ExtractUrlBody
from app.services.pdf_extract import (
    _max_pdf_bytes,
    download_pdf_bytes,
    extract_from_pdf_bytes,
)

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/extract/file", response_model=ExtractResponse)
async def extract_file(
    file: UploadFile = File(..., description="PDF file"),
) -> ExtractResponse:
    max_bytes = _max_pdf_bytes()
    data = await file.read()
    if len(data) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="PDF exceeds maximum allowed size",
        )
    try:
        return extract_from_pdf_bytes(data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post("/extract/url", response_model=ExtractResponse)
async def extract_url(body: ExtractUrlBody) -> ExtractResponse:
    try:
        data = await download_pdf_bytes(str(body.url))
        return extract_from_pdf_bytes(data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

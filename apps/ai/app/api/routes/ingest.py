from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import verify_internal_key
from app.models.ingest import IngestResourceBody, IngestResourceResponse
from app.services.ingest_pipeline import ingest_resource

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/ingest/resource", response_model=IngestResourceResponse)
async def ingest_resource_route(body: IngestResourceBody) -> IngestResourceResponse:
    try:
        return await ingest_resource(body.resource_id, str(body.pdf_url))
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

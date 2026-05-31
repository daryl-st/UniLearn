from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import verify_internal_key
from app.models.summarize import SummarizeBody, SummarizeResponse
from app.services.retrieval import retrieve_chunks_ordered
from app.services.summarize import generate_resource_summary, resolve_max_chunks

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/rag/summarize", response_model=SummarizeResponse)
async def rag_summarize_route(body: SummarizeBody) -> SummarizeResponse:
    try:
        limit = resolve_max_chunks(body.maxChunks)
        chunks = await retrieve_chunks_ordered(body.resourceId, limit)
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resource is not indexed yet (no chunks found)",
            )

        summary = await generate_resource_summary(chunks)
        return SummarizeResponse(resourceId=body.resourceId, summary=summary)
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

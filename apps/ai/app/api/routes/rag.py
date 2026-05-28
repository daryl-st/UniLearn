from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import verify_internal_key
from app.models.ask import AskAnswerBody, AskChunk
from app.models.rag import RagAskBody, RagAskResponse
from app.services.embeddings import embed_query
from app.services.rag_answer import generate_grounded_answer
from app.services.retrieval import retrieve_top_chunks

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/rag/ask", response_model=RagAskResponse)
async def rag_ask_route(body: RagAskBody) -> RagAskResponse:
    try:
        query_embedding = await embed_query(body.question)
        rows = await retrieve_top_chunks(body.resourceId, query_embedding, body.topK)
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resource is not indexed yet (no vectorized chunks found)",
            )

        ask_chunks = [
            AskChunk(
                chunkIndex=row["chunkIndex"],
                pageNumber=row["pageNumber"],
                content=row["content"],
                score=row["score"],
            )
            for row in rows
        ]
        answer = await generate_grounded_answer(
            AskAnswerBody(question=body.question, chunks=ask_chunks)
        )
        return RagAskResponse(
            resourceId=body.resourceId,
            answer=answer.answer,
            citations=answer.citations,
            usedChunks=len(ask_chunks),
        )
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

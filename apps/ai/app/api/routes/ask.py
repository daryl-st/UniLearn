from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import verify_internal_key
from app.models.ask import AskAnswerBody, AskAnswerResponse, AskEmbedBody, AskEmbedResponse
from app.services.embeddings import embed_query
from app.services.rag_answer import generate_grounded_answer

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/ask/embed", response_model=AskEmbedResponse)
async def ask_embed_route(body: AskEmbedBody) -> AskEmbedResponse:
    try:
        embedding = await embed_query(body.question)
        return AskEmbedResponse(embedding=embedding)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post("/ask/answer", response_model=AskAnswerResponse)
async def ask_answer_route(body: AskAnswerBody) -> AskAnswerResponse:
    try:
        return await generate_grounded_answer(body)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

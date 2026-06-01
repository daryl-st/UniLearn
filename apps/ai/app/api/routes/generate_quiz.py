from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import verify_internal_key
from app.models.generate_quiz import (
    GenerateQuizBody,
    GenerateQuizResponse,
    GeneratedQuestion,
)
from app.services.quiz_gen import (
    generate_quiz_from_chunks,
    resolve_max_chunks,
    resolve_question_count,
)
from app.services.retrieval import retrieve_chunks_ordered

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/rag/generate-quiz", response_model=GenerateQuizResponse)
async def rag_generate_quiz_route(body: GenerateQuizBody) -> GenerateQuizResponse:
    try:
        limit = resolve_max_chunks(body.maxChunks)
        count = resolve_question_count(body.questionCount)
        chunks = await retrieve_chunks_ordered(body.resourceId, limit)
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resource is not indexed yet (no chunks found)",
            )

        raw = await generate_quiz_from_chunks(chunks, body.difficulty, count)
        questions = [GeneratedQuestion.model_validate(q) for q in raw["questions"]]
        return GenerateQuizResponse(
            resourceId=body.resourceId,
            title=raw["title"],
            questions=questions,
        )
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

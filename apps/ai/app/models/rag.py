from pydantic import BaseModel, Field

from app.models.ask import AskCitation


class RagAskBody(BaseModel):
    resourceId: str = Field(min_length=1)
    question: str = Field(min_length=1, max_length=4000)
    topK: int = Field(default=5, ge=1, le=20)


class RagAskResponse(BaseModel):
    resourceId: str
    answer: str
    citations: list[AskCitation] = Field(default_factory=list)
    usedChunks: int = Field(ge=0)

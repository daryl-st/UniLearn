from pydantic import BaseModel, Field


class AskEmbedBody(BaseModel):
    question: str = Field(min_length=1, max_length=4000)


class AskEmbedResponse(BaseModel):
    embedding: list[float]


class AskChunk(BaseModel):
    chunkIndex: int = Field(ge=0)
    pageNumber: int = Field(ge=1)
    content: str = Field(min_length=1)
    score: float


class AskAnswerBody(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    chunks: list[AskChunk] = Field(min_length=1)


class AskCitation(BaseModel):
    chunkIndex: int = Field(ge=0)
    pageNumber: int = Field(ge=1)
    score: float


class AskAnswerResponse(BaseModel):
    answer: str
    citations: list[AskCitation] = Field(default_factory=list)

from pydantic import BaseModel, Field


class SummarizeBody(BaseModel):
    resourceId: str = Field(min_length=1)
    maxChunks: int = Field(default=15, ge=1, le=30)


class SummarizeResponse(BaseModel):
    resourceId: str
    summary: str

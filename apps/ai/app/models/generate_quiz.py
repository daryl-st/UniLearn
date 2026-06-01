from typing import Literal

from pydantic import BaseModel, Field


class GenerateQuizBody(BaseModel):
    resourceId: str = Field(min_length=1)
    difficulty: Literal["EASY", "MEDIUM", "HARD"]
    maxChunks: int | None = Field(default=None, ge=1, le=30)
    questionCount: int | None = Field(default=None, ge=3, le=15)


class GeneratedQuestion(BaseModel):
    type: Literal["mcq", "short"]
    content: str = Field(min_length=1)
    options: dict[str, str] | None = None
    correctAns: str = Field(min_length=1)


class GenerateQuizResponse(BaseModel):
    resourceId: str
    title: str
    questions: list[GeneratedQuestion]

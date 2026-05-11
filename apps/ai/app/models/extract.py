from pydantic import BaseModel, Field, HttpUrl


class ExtractMetadata(BaseModel):
    title: str | None = None
    author: str | None = None
    page_count: int = Field(ge=0)


class ExtractResponse(BaseModel):
    text: str
    metadata: ExtractMetadata
    warnings: list[str] = Field(default_factory=list)


class ExtractUrlBody(BaseModel):
    url: HttpUrl

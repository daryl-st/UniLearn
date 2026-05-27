from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl

from app.models.extract import ExtractMetadata


class IngestResourceBody(BaseModel):
    resource_id: UUID
    pdf_url: HttpUrl


class ChunkOut(BaseModel):
    chunk_index: int = Field(ge=0)
    page_number: int = Field(ge=1)
    content: str
    token_count: int = Field(ge=0)
    embedding: list[float] | None = None


class IngestResourceResponse(BaseModel):
    resource_id: UUID
    metadata: ExtractMetadata
    chunks: list[ChunkOut]
    warnings: list[str] = Field(default_factory=list)

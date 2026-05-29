from uuid import UUID

from app.models.ingest import ChunkOut, IngestResourceResponse
from app.services.embeddings import embed_texts
from app.services.pdf_extract import download_pdf_bytes, extract_pages_from_pdf_bytes
from app.services.semantic_chunk import semantic_chunk_pages


async def ingest_resource(resource_id: UUID, pdf_url: str) -> IngestResourceResponse:
    data = await download_pdf_bytes(pdf_url)
    pages, metadata, warnings = extract_pages_from_pdf_bytes(data)
    semantic_chunks = semantic_chunk_pages(pages)
    embeddings = await embed_texts([c.content for c in semantic_chunks])

    chunks_out: list[ChunkOut] = []
    for index, (chunk, embedding) in enumerate(zip(semantic_chunks, embeddings, strict=True)):
        chunks_out.append(
            ChunkOut(
                chunk_index=index,
                page_number=chunk.page_number,
                content=chunk.content,
                token_count=chunk.token_count,
                embedding=embedding,
            )
        )

    return IngestResourceResponse(
        resource_id=resource_id,
        metadata=metadata,
        chunks=chunks_out,
        warnings=warnings,
    )

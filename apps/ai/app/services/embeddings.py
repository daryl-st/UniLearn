"""Embedding generation for chunk text. v1 returns None for all inputs."""


def embed_texts(texts: list[str]) -> list[list[float] | None]:
    """Return one embedding per input text. v1 stub: all None."""
    return [None for _ in texts]

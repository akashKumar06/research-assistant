from typing import List
from langchain_huggingface import HuggingFaceEmbeddings

# Runs sentence-transformers locally (weights are cached on first use) instead
# of calling HuggingFace's shared, rate-limited Inference API per chunk — that
# remote endpoint is what was throwing intermittent 502 "Bad Gateway" /
# "workload not running" errors on larger PDFs. Loaded once and reused.
_embedder: HuggingFaceEmbeddings | None = None


def _get_embedder() -> HuggingFaceEmbeddings:
    global _embedder
    if _embedder is None:
        _embedder = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    return _embedder


def embed_text(text: str) -> List[float]:
    """Generate an embedding for a single query string."""
    return _get_embedder().embed_query(text)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a batch of document chunks in one pass."""
    return _get_embedder().embed_documents(texts)

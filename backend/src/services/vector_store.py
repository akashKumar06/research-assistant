import os
import uuid
from typing import List
from pinecone import Pinecone, ServerlessSpec
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

# Pinecone client + index-existence check used to be redone from scratch in
# every VectorStore(...) call — which happens on every single upload, search
# and delete. `list_indexes()` and `Index()` are both network round-trips, so
# that added a full extra Pinecone API call to the critical path of every
# chat message. Cache the client and the "index confirmed to exist" flag at
# module level so that work happens at most once per process.
_pc: Pinecone | None = None
_verified_indexes: set[str] = set()


def _get_pinecone_client() -> Pinecone:
    global _pc
    if _pc is None:
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise ValueError("PINECONE_API_KEY not found in environment variables")
        _pc = Pinecone(api_key=api_key)
    return _pc


class VectorStore:
    """
    Pinecone vector storage for each PDF.

    pdf_id = namespace inside the Pinecone index.
    """

    def __init__(self, pdf_id: str):
        self.pdf_id = pdf_id
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "research-assistant")

        self.pc = _get_pinecone_client()

        if self.index_name not in _verified_indexes:
            if self.index_name not in self.pc.list_indexes().names():
                print(f"[VectorStore] Creating Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=384,             # matches all-MiniLM-L6-v2 output size
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1")
                )
            _verified_indexes.add(self.index_name)

        self.index = self.pc.Index(self.index_name)

    # ----------------------------------------------------------------------
    #                           ADD EMBEDDINGS
    # ----------------------------------------------------------------------

    def add_embeddings(self, chunks: List[Document]):
        """
        Store embeddings in Pinecone for the given PDF.
        """

        print(f"[VectorStore] Adding {len(chunks)} chunks to namespace: {self.pdf_id}")

        from src.services.embeddings import embed_texts

        # Embed all chunks locally in one batched pass instead of one HTTP
        # round-trip per chunk — both far faster and immune to the remote
        # Inference API's transient 502s on large documents.
        texts = [chunk.page_content for chunk in chunks]
        embeddings = embed_texts(texts)

        vectors = [
            {
                "id": str(uuid.uuid4()),
                "values": embedding,
                "metadata": {
                    "text": chunk.page_content,
                    "source": self.pdf_id,
                },
            }
            for chunk, embedding in zip(chunks, embeddings)
        ]

        # Pinecone rejects/struggles with very large single upsert payloads,
        # so push them in batches.
        UPSERT_BATCH_SIZE = 100
        for i in range(0, len(vectors), UPSERT_BATCH_SIZE):
            batch = vectors[i : i + UPSERT_BATCH_SIZE]
            self.index.upsert(vectors=batch, namespace=self.pdf_id)
            print(
                f"[VectorStore] Upserted {min(i + UPSERT_BATCH_SIZE, len(vectors))}/{len(vectors)} vectors"
            )

        print(f"[VectorStore] Successfully stored embeddings in Pinecone")

    # ----------------------------------------------------------------------
    #                           SEARCH
    # ----------------------------------------------------------------------

    def search(self, query: str, top_k: int = 5):
        """
        Search Pinecone for the closest chunks related to the query.
        Embedding is generated inside the LangChain/LLM pipeline.
        """

        from src.services.embeddings import embed_text  # lazy import

        print(f"[VectorStore] Searching embeddings for PDF: {self.pdf_id}")

        query_embedding = embed_text(query)

        response = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=self.pdf_id
        )

        matches = response.get("matches", [])
        print(f"[VectorStore] Retrieved {len(matches)} results")

        # Convert to LangChain-style chunk objects
        documents = []
        for m in matches:
            metadata = m["metadata"]
            doc = Document(
                page_content=metadata.get("text", ""),
                metadata=metadata
            )
            documents.append(doc)

        return documents

    # ----------------------------------------------------------------------
    #                           DELETE VECTORS
    # ----------------------------------------------------------------------

    def delete_pdf_vectors(self):
        """
        Delete all embeddings belonging to this PDF.
        """

        print(f"[VectorStore] Deleting all vectors for namespace: {self.pdf_id}")

        self.index.delete(delete_all=True, namespace=self.pdf_id)

        print(f"[VectorStore] Deleted vector namespace for PDF: {self.pdf_id}")

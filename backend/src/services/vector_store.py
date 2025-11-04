from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from typing import List
from langchain_core.documents import Document
import os
from dotenv import load_dotenv

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

class VectorStore:
    def __init__(self):
        self.hf_embedding = None
        self.vector_store = None
        self._load_store()
    
    def _load_store(self):
        self.hf_embedding = HuggingFaceEndpointEmbeddings(model="sentence-transformers/all-MiniLM-L6-v2", task="feature-extraction", huggingfacehub_api_token=HUGGINGFACE_API_KEY)

        self.vector_store = Chroma(
            collection_name="pdf_documents", 
            persist_directory="./data/vectordb", 
            collection_metadata={"description":"PDF document embeddings for RAG"},
            embedding_function=self.hf_embedding
        )

    def create_store(self, docs: List[Document]) -> Chroma:
        self.vector_store.add_documents(docs)


from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import uuid
import os
import shutil

class VectorStore:
    def __init__(self, session_id: str = None):
        """Initialize vector store with optional session ID for isolation"""
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Create unique collection per session
        self.session_id = session_id or str(uuid.uuid4())
        self.persist_directory = f"./data/chroma/{self.session_id}"
        self.collection_name = f"pdf_collection_{self.session_id}"
        self.vector_store = None
        
        print(f"[VectorStore] Initialized for session: {self.session_id}")
        print(f"[VectorStore] Persist directory: {self.persist_directory}")

    def create_store(self, chunks):
        """Create a new vector store from document chunks"""
        print(f"[VectorStore] Creating store with {len(chunks)} chunks")
        
        # Clear existing store for this session
        self.clear_store()
        
        # Create new vector store
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            collection_name=self.collection_name,
            persist_directory=self.persist_directory
        )
        
        print(f"[VectorStore] Store created successfully")
        print(f"[VectorStore] Collection count: {self.vector_store._collection.count()}")
        
        return self.vector_store

    def get_retriever(self, k: int = 3):
        """Get retriever for searching documents"""
        print(f"[VectorStore] Getting retriever for session: {self.session_id}")
        
        # Load existing vector store if not already loaded
        if self.vector_store is None:
            if os.path.exists(self.persist_directory):
                print(f"[VectorStore] Loading existing store from: {self.persist_directory}")
                self.vector_store = Chroma(
                    collection_name=self.collection_name,
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_directory
                )
                print(f"[VectorStore] Loaded. Collection count: {self.vector_store._collection.count()}")
            else:
                print(f"[VectorStore] WARNING: No vector store found at {self.persist_directory}")
                raise ValueError(f"No vector store found for session {self.session_id}. Please upload a PDF first.")
        
        return self.vector_store.as_retriever(search_kwargs={"k": k})

    def clear_store(self):
        """Clear the vector store for this session"""
        if os.path.exists(self.persist_directory):
            print(f"[VectorStore] Clearing existing store at: {self.persist_directory}")
            shutil.rmtree(self.persist_directory)

    def delete_store(self):
        """Delete the vector store when session ends"""
        print(f"[VectorStore] Deleting store for session: {self.session_id}")
        self.clear_store()


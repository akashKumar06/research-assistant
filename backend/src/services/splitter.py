from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
        )
    
    def split_documents(self, documents):
        """Split documents into chunks"""
        try:
            return self.text_splitter.split_documents(documents)
        except Exception as e:
            raise Exception(f"Error splitting documents: {str(e)}")


from typing import List
from langchain_core.documents import Document
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter

class DocumentSplitter:
    def __init__(self,chunk_size=1000, chunk_overlap=200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
    
    def split_documents(self, documents: List[Document])->List[Document]:
        self.chunks = self.splitter.split_documents(documents)
        return self.chunks

        
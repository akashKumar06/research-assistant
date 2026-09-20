from langchain_community.document_loaders import PyMuPDFLoader

class DocumentLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path
        
    def load(self):
        """Load PDF document"""
        try:
            loader = PyMuPDFLoader(self.file_path)
            return loader.load()
        except Exception as e:
            raise Exception(f"Error loading PDF: {str(e)}")

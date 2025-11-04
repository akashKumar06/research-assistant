from langchain_community.document_loaders import PyMuPDFLoader
class DocumentLoader:
    def __init__(self, file_path: str):
        self.loader = PyMuPDFLoader(file_path)

    def load(self):
        self.document = self.loader.load()
        return self.document

class DocumentLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self):
        """Load PDF document"""
        try:
            # Deferred: importing langchain_community.document_loaders takes
            # ~30s on its own (pulls in a large set of optional loader deps),
            # so importing it at module load added that cost to every server
            # boot even for requests that never load a PDF.
            from langchain_community.document_loaders import PyMuPDFLoader

            loader = PyMuPDFLoader(self.file_path)
            return loader.load()
        except Exception as e:
            raise Exception(f"Error loading PDF: {str(e)}")

import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpointEmbeddings

load_dotenv()

HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

def embed_text(text: str):
    """
    Generate embeddings for a query or document chunk
    using HuggingFace Inference API.
    Returns a vector (list of floats).
    """

    
    if not HF_API_KEY:
        raise ValueError("HUGGINGFACE_API_KEY not found in environment variables")

    embeddings = HuggingFaceEndpointEmbeddings(model="sentence-transformers/all-MiniLM-L6-v2", task="feature-extraction", huggingfacehub_api_token=HF_API_KEY)
    result = embeddings.embed_query(text)

    if isinstance(result, list) and isinstance(result[0], list):
        return result[0]

    return result

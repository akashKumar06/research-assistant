from langchain.tools import tool
from src.services.arxiv_client import arxiv_client_api
from typing import List
from src.schemas.arxiv_schema import PaperMetadata

@tool
def arxiv_search(query: str, max_results: int, sort_by: str = "", sort_order: str = "")->List[PaperMetadata]:
    """Search research papers from arXiv using a query string"""
    return arxiv_client_api.search(query, max_results, sort_by, sort_order)

def get_research_tools():
    return [arxiv_search]
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class SearchInput(BaseModel):
    """Input schema for search operations"""
    query: str = Field(..., description="Search query string", min_length=1, max_length=500, examples=["attentation mechanisms in transformers"])
    max_results: int = Field(default=10, ge=1, le=100, description="Maximum number of results to return")
    sort_by: str = Field(default="relevance", description="Sort criterion: relevance, lastUpdatedDate, submittedDate")
    sort_order: str = Field(default="descending", description="Sort order: ascending or descending")
    
    @field_validator("sort_by")
    @classmethod
    def validate_sort_by(cls, value):
        allowed = ['relevance', 'lastUpdatedDate', 'submittedDate']
        if value not in allowed:
            raise ValueError(f"sort_by must be one of {allowed}")
        return value
    
    @field_validator('sort_order')
    def validate_sort_order(cls, value):
        allowed = ['ascending', 'descending']
        if value not in allowed:
            raise ValueError(f"sort_order must be one of {allowed}")
        return value
    
class AuthorSearchInput(BaseModel):
    """Input for author-based search"""
    author_name: str = Field(..., min_length=2, max_length=200)
    max_results: int = Field(default=10, ge=1, le=100)

class CategorySearchInput(BaseModel):
    """Input for category-based search"""
    category: str = Field(
        ..., 
        description="arXiv category code (e.g., cs.AI, cs.LG)",
        examples=["cs.AI", "cs.LG", "stat.ML"]
    )
    max_results: int = Field(default=10, ge=1, le=100)


class PaperMetadata(BaseModel):
    """Complete paper metadata"""
    arxiv_id: str
    title: str
    authors: List[str]
    abstract: str
    published_date: str  # ISO format
    updated_date: Optional[str] = None
    pdf_url: str
    arxiv_url: str
    categories: List[str]
    primary_category: str
    comment: Optional[str] = None
    journal_ref: Optional[str] = None
    doi: Optional[str] = None

class SearchOutput(BaseModel):
    """Output schema for search operations"""
    success: bool
    query: str
    total_results: int
    papers: List[PaperMetadata]
    error: Optional[str] = None

class PaperDetailsOutput(BaseModel):
    """Output for single paper details"""
    success: bool
    paper: Optional[PaperMetadata] = None
    error: Optional[str] = None

class DownloadOutput(BaseModel):
    """Output for PDF download operations"""
    success: bool
    arxiv_id: str
    file_path: Optional[str] = None
    file_size_mb: Optional[float] = None
    already_existed: bool = False
    error: Optional[str] = None

import arxiv
from typing import List
from src.schemas.arxiv_schema import PaperMetadata
import logging

logger = logging.getLogger(__name__)
class ArxivAPIClient:
    """
    Low-level client for arXiv API
    Wraps the arxiv Python library with error handling and rate limiting
    """
    def __init__(self):
        self.client = arxiv.Client()
        self.max_results = 50
        logger.info("ArxivAPIClient initialized")
    
    def _parse_result(self, result: arxiv.Result) -> PaperMetadata:
        """
        Convert arxiv.Result to PaperMetadata schema
        
        Args:
            result: arxiv.Result object from arxiv library
                
        Returns:
            PaperMetadata: Validated paper metadata
        """
        arxiv_id = result.entry_id.split("/")[-1].split('v')[0]
        authors = [author.name for author in result.authors]

        return PaperMetadata(arxiv_id=arxiv_id,
            title=result.title.strip(),
            authors=authors,
            abstract=result.summary.strip().replace('\n', ' '),
            published_date=result.published.isoformat(),
            updated_date=result.updated.isoformat() if result.updated else None,
            pdf_url=result.pdf_url,
            arxiv_url=result.entry_id,
            categories=result.categories,
            primary_category=result.primary_category,
            comment=result.comment,
            journal_ref=result.journal_ref,
            doi=result.doi
        )
    
    def search(self,
        query: str,
        max_results: int = 10,
        sort_by: arxiv.SortCriterion = arxiv.SortCriterion.Relevance,
        sort_order: arxiv.SortOrder = arxiv.SortOrder.Descending
    ) -> List[PaperMetadata]:
        """
        Search arXiv for papers
        
        Args:
            query: Search query string
            max_results: Maximum number of results (capped at ARXIV_MAX_RESULTS)
            sort_by: Sort criterion enum
            sort_order: Sort order enum
            
        Returns:
            List of PaperMetadata objects
            
        Raises:
            Exception: If API call fails
        """
        try:
            # Cap max_results
            max_results = min(max_results, self.max_results)
            
            logger.info(f"Searching arXiv: query='{query}', max_results={max_results}")

            # Convert string sort options to enums
            if isinstance(sort_by, str):
                sort_by = self.get_sort_criterion(sort_by)
            if isinstance(sort_order, str):
                sort_order = self.get_sort_order(sort_order)
            
            # Create search object
            search = arxiv.Search(
                query=query,
                max_results=max_results,
                sort_by=sort_by,
                sort_order=sort_order
            )
            
            # Execute search
            results = self.client.results(search)

            # Parse results
            papers = []
            for result in results:
                try:
                    print(result)
                    paper = self._parse_result(result)
                    papers.append(paper)
                except Exception as e:
                    logger.warning(f"Failed to parse result: {e}")
                    continue
            logger.info(f"Successfully retrieved {len(papers)} papers")
            return papers
            
        except Exception as e:
            logger.error(f"arXiv search failed: {str(e)}")
            raise Exception(f"arXiv API error: {str(e)}")

    def search_by_author(self, author_name: str, max_results: int = 10) -> List[PaperMetadata]:
        """Search papers by author name"""
        query = f"au:{author_name}"
        return self.search(query, max_results)
    
    def search_by_category(self, category: str, max_results: int = 10) -> List[PaperMetadata]:
        """Search papers by arXiv category"""
        query = f"cat:{category}"
        return self.search(query, max_results)
    
    def search_by_title(self, title: str, max_results: int = 10) -> List[PaperMetadata]:
        """Search papers by title"""
        query = f"ti:{title}"
        return self.search(query, max_results)
    
    @staticmethod
    def get_sort_criterion(sort_by: str) -> arxiv.SortCriterion:
        """Convert string to arxiv.SortCriterion enum"""
        mapping = {
            'relevance': arxiv.SortCriterion.Relevance,
            'lastUpdatedDate': arxiv.SortCriterion.LastUpdatedDate,
            'submittedDate': arxiv.SortCriterion.SubmittedDate
        }
        return mapping.get(sort_by, arxiv.SortCriterion.Relevance)
    
    @staticmethod
    def get_sort_order(sort_order: str) -> arxiv.SortOrder:
        """Convert string to arxiv.SortOrder enum"""
        mapping = {
            'ascending': arxiv.SortOrder.Ascending,
            'descending': arxiv.SortOrder.Descending
        }
        return mapping.get(sort_order, arxiv.SortOrder.Descending)
    
arxiv_client_api = ArxivAPIClient()
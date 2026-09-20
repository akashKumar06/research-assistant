# Research Paper Assistant

A FastAPI backend service that combines research paper search capabilities with PDF document analysis.

## Features

### 1. Research Paper Search

- Integrated with arXiv API for academic paper search
- Supports searching by:
  - Query string
  - Author name
  - Category
  - Title
- Configurable sorting and result limits
- Streaming response support for real-time AI interactions

### 2. PDF Document Analysis

- Upload and process PDF documents
- Document chunking and vectorization
- RAG (Retrieval Augmented Generation) support
- Streaming chat responses

## API Endpoints

### Research Chat Endpoints (`/api/research-chat`)

- POST `/`: Chat endpoint with arXiv research paper search capabilities

### Document Chat Endpoints (`/api/chat`)

- POST `/upload`: Upload PDF documents for analysis
- POST `/`: Query uploaded PDF documents

## Technical Stack

- **Framework**: FastAPI
- **AI Models**:
  - HuggingFace Endpoint (deepseek-ai/DeepSeek-V3.2-Exp)
  - Sentence Transformers for embeddings
- **Vector Store**: Chroma DB
- **Document Processing**:
  - PyMuPDF for PDF loading
  - LangChain for document splitting and RAG

## Setup

1. Environment Variables:

```env
HUGGINGFACE_API_KEY=your_api_key_here
```

2. Install Dependencies:

```bash
pip install -r requirements.txt
```

3. Run Development Server:

```bash
uvicorn src.main:app --reload --port 8000
```

## Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── chat_router.py         # PDF chat endpoints
│   │   └── research_chat_router.py # Research paper chat endpoints
│   ├── services/
│   │   ├── arxiv_client.py        # arXiv API integration
│   │   ├── arxiv_tools.py         # arXiv search tools
│   │   ├── loader.py              # PDF document loader
│   │   ├── llm_model.py           # LLM configuration
│   │   ├── splitter.py            # Document chunking
│   │   ├── tool_agent.py          # Tool-enabled chat agent
│   │   └── vector_store.py        # Vector database management
│   ├── schemas/
│   │   └── arxiv_schema.py        # Data models
│   └── main.py                    # Application entry point
```

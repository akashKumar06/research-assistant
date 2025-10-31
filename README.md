```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                       │
│              (React + TypeScript + Tailwind)                │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Search Bar │  │ Chat Window  │  │ Paper List   │         │
│  └────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND API LAYER                       │
│                    (FastAPI + Python)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Chat API     │  │ Search API   │  │ Paper API    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ MCP SERVER   │   │ RAG PIPELINE │   │ CACHE LAYER  │
│              │   │              │   │              │
│ • arXiv API  │   │ • LangChain  │   │ • Redis      │
│ • IEEE API   │   │ • Embeddings │   │              │
│ • PDF Fetch  │   │ • VectorDB   │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │
        ▼                   ▼
┌──────────────┐   ┌──────────────┐
│ PDF Storage  │   │ Vector DB    │
│              │   │              │
│ • Local FS   │   │ • ChromaDB   │
│ • S3 (opt)   │   │ • Embeddings │
└──────────────┘   └──────────────┘
                            │
                            ▼
                   ┌──────────────┐
                   │ PostgreSQL   │
                   │              │
                   │ • Metadata   │
                   │ • User Data  │
                   └──────────────┘
```

---

## 3. 🔄 **Intended Workflow**

### **Workflow A: Paper Search & Indexing**

```
1. User enters query → "deep learning transformers"
                ↓
2. Frontend sends request to Backend API
                ↓
3. Backend calls MCP Server
                ↓
4. MCP Server queries arXiv API
                ↓
5. Returns list of papers (title, abstract, PDF URL, metadata)
                ↓
6. User selects papers to "Add to Knowledge Base"
                ↓
7. Backend downloads PDF → Extracts text → Chunks text
                ↓
8. Generate embeddings using sentence-transformers
                ↓
9. Store in ChromaDB (vectors) + PostgreSQL (metadata)
                ↓
10. Paper is now searchable in RAG pipeline
```

### **Workflow B: Chatbot Q&A (RAG)**

```
1. User asks → "What are the main advantages of attention mechanisms?"
                ↓
2. Frontend sends question to Chat API
                ↓
3. Backend converts question to embedding
                ↓
4. Search ChromaDB for relevant chunks (top K=5)
                ↓
5. Retrieved chunks passed to LLM with prompt:
   "Answer based on this context: [chunks]"
                ↓
6. LLM generates answer with citations
                ↓
7. Backend returns answer + source papers
                ↓
8. Frontend displays answer + clickable paper links
```

### **Workflow C: PDF Download & Full Text**

```
1. User clicks "View Paper" or "Download PDF"
                ↓
2. Backend checks if PDF already cached
                ↓
3. If not → MCP fetches from arXiv
                ↓
4. Stores locally and returns download link
                ↓
5. User can read or download
```

---

## 4. 📂 **Project Structure**

```
research-paper-assistant/
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Main pages
│   │   ├── services/         # API calls
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # Python FastAPI
│   ├── app/
│   │   ├── api/              # REST endpoints
│   │   ├── mcp/              # MCP server logic
│   │   ├── rag/              # RAG pipeline
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── utils/            # Helper functions
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── data/                      # Local storage
│   ├── pdfs/                 # Downloaded PDFs
│   ├── chroma_db/            # Vector database
│   └── cache/                # Temporary files
│
├── docker-compose.yml        # PostgreSQL, Redis
└── README.md
```

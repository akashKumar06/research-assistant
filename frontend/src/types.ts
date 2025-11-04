export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  source: "arXiv" | "IEEE" | "Other";
  pdfUrl: string;
  addedToKB: boolean;
  indexingStatus: "pending" | "processing" | "complete" | "failed";
  chunks: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: SourceReference[];
}

export interface SourceReference {
  paperId: string;
  title: string;
  excerpt: string;
}

export interface SearchFilters {
  query: string;
  yearMin: number;
  yearMax: number;
  researchArea: string;
}

export interface KnowledgeBaseStats {
  totalPapers: number;
  totalChunks: number;
  lastUpdated: Date;
  processingCount: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

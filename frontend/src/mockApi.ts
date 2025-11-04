import type {
  Paper,
  ChatMessage,
  Conversation,
  KnowledgeBaseStats,
} from "./types";

export const RESEARCH_AREAS = [
  "Deep Learning",
  "NLP",
  "Computer Vision",
  "Reinforcement Learning",
  "ML Theory",
  "Graph Neural Networks",
  "Time Series",
  "Generative Models",
];

export const MOCK_PAPERS: Paper[] = [
  {
    id: "arxiv_2023_001",
    title: "Attention Is All You Need: Transformers for Machine Learning",
    authors: [
      "Ashish Vaswani",
      "Noam Shazeer",
      "Parmar Arun",
      "Jakob Uszkoreit",
    ],
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    year: 2023,
    source: "arXiv",
    pdfUrl: "https://arxiv.org/pdf/2023.00001",
    addedToKB: true,
    indexingStatus: "complete",
    chunks: 145,
  },
  {
    id: "arxiv_2023_002",
    title: "Large Language Models as Zero-Shot Reasoners",
    authors: ["Takeshi Kojima", "Shixiang Shane Gu", "Machel Reid"],
    abstract:
      "Pretrained large language models are effective at few-shot learning via in-context learning. We investigate whether LLMs can perform reasoning tasks without task-specific training examples. We propose Chain-of-Thought prompting, which instructs models to produce intermediate reasoning steps before giving a final answer.",
    year: 2023,
    source: "arXiv",
    pdfUrl: "https://arxiv.org/pdf/2023.00002",
    addedToKB: false,
    indexingStatus: "pending",
    chunks: 0,
  },
  {
    id: "arxiv_2023_003",
    title: "Vision Transformers: Image Recognition with Transformers",
    authors: ["Alexei Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov"],
    abstract:
      "While the Transformer architecture has become the dominant choice in NLP, its applications to computer vision remain limited. In this work, we show that a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.",
    year: 2023,
    source: "arXiv",
    pdfUrl: "https://arxiv.org/pdf/2023.00003",
    addedToKB: true,
    indexingStatus: "complete",
    chunks: 128,
  },
  {
    id: "ieee_2022_001",
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee"],
    abstract:
      "We introduce BERT, a new method of pre-training language representations unlike recent work in the field. BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    year: 2022,
    source: "IEEE",
    pdfUrl: "https://arxiv.org/pdf/2022.00001",
    addedToKB: false,
    indexingStatus: "failed",
    chunks: 0,
  },
  {
    id: "arxiv_2023_004",
    title: "GPT-4: Language Models are Few-Shot Learners",
    authors: ["OpenAI Research", "Tom Brown", "Benjamin Mann"],
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. In this work, we demonstrate that language models begin to learn from very few examples.",
    year: 2023,
    source: "arXiv",
    pdfUrl: "https://arxiv.org/pdf/2023.00004",
    addedToKB: true,
    indexingStatus: "processing",
    chunks: 89,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    title: "Understanding Attention Mechanisms",
    messages: [
      {
        id: "msg_1",
        role: "user",
        content: "What are the main advantages of attention mechanisms?",
        timestamp: new Date("2025-11-03T14:00:00Z"),
      },
      {
        id: "msg_2",
        role: "assistant",
        content:
          "Attention mechanisms provide several key advantages in modern neural networks:\n\n1. **Parallelization**: Unlike RNNs, attention allows all tokens to be processed in parallel, enabling faster training.\n\n2. **Long-range Dependencies**: The attention mechanism can directly connect distant tokens, solving the long-range dependency problem better than RNNs.\n\n3. **Interpretability**: Attention weights can be visualized to understand which parts of the input the model focuses on.\n\n4. **Flexibility**: Can be applied to various tasks and modalities without significant architectural changes.\n\n5. **Scalability**: Works well with very large models and datasets.",
        timestamp: new Date("2025-11-03T14:00:30Z"),
        sources: [
          {
            paperId: "arxiv_2023_001",
            title: "Attention Is All You Need",
            excerpt:
              "The attention mechanism allows the model to focus on different parts of the input sequence when producing each element of the output sequence",
          },
        ],
      },
    ],
    createdAt: new Date("2025-11-03T14:00:00Z"),
    updatedAt: new Date("2025-11-03T14:00:30Z"),
  },
];

// Mock API functions - Replace these with actual API calls to your backend
export const mockApi = {
  // Search API - Maps to Workflow A
  searchPapers: async (
    query: string,
    filters?: { yearMin?: number; yearMax?: number; researchArea?: string }
  ): Promise<Paper[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return MOCK_PAPERS.filter((paper) => {
      const matchesQuery =
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
        paper.authors.some((author) =>
          author.toLowerCase().includes(query.toLowerCase())
        );

      if (!matchesQuery) return false;

      if (filters?.yearMin && paper.year < filters.yearMin) return false;
      if (filters?.yearMax && paper.year > filters.yearMax) return false;

      return true;
    });
  },

  // Add paper to knowledge base - Workflow A
  addPaperToKB: async (paperId: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  // Chat API - Maps to Workflow B
  sendChatMessage: async (
    conversationId: string,
    message: string
  ): Promise<ChatMessage> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: `This is a mock response to: "${message}". In production, this would be replaced with actual LLM responses from your FastAPI backend using the RAG pipeline.`,
      timestamp: new Date(),
      sources: MOCK_PAPERS.filter((p) => p.addedToKB)
        .slice(0, 2)
        .map((p) => ({
          paperId: p.id,
          title: p.title,
          excerpt: p.abstract.substring(0, 100) + "...",
        })),
    };
  },

  // Get conversations - Workflow B
  getConversations: async (): Promise<Conversation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CONVERSATIONS;
  },

  // Get knowledge base papers - Workflow C
  getKnowledgeBasePapers: async (): Promise<Paper[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PAPERS.filter((p) => p.addedToKB);
  },

  // Get knowledge base stats
  getKnowledgeBaseStats: async (): Promise<KnowledgeBaseStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const papers = MOCK_PAPERS.filter((p) => p.addedToKB);
    return {
      totalPapers: papers.length,
      totalChunks: papers.reduce((sum, p) => sum + p.chunks, 0),
      lastUpdated: new Date(),
      processingCount: MOCK_PAPERS.filter(
        (p) => p.indexingStatus === "processing"
      ).length,
    };
  },
};

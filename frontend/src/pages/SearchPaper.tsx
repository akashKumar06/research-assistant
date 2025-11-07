import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ChatWindow } from "@/components/ChatWindow";
import type { ChatMessage } from "@/types";
import { usePaperAI } from "@/hooks/mutations/usePaperAI";
import { useChatContext } from "@/context/ChatContext";

// ⭐ Helper function to extract arXiv links and convert to PDF
const extractPapersFromContent = (content: string) => {
  const papers: any[] = [];
  
  // Match arXiv URLs (both http and https, with or without version)
  const arxivRegex = /https?:\/\/arxiv\.org\/abs\/([\d.]+)(?:v\d+)?/g;
  const matches = content.matchAll(arxivRegex);
  
  for (const match of matches) {
    const arxivId = match[1]; // Extract the arXiv ID
    const url = match[0]; // Full URL
    
    papers.push({
      title: `arXiv:${arxivId}`, // Placeholder title
      url: url,
      pdf_url: `https://arxiv.org/pdf/${arxivId}.pdf`, // ⭐ Convert to PDF URL
      abstract: "Click to view paper details",
    });
  }
  
  return papers;
};

export default function SearchPaper() {
  const {
    searchResults: messages,
    setSearchResults: setMessages,
    searchQuery: isChatActive,
    setSearchQuery: setIsChatActive,
    isSearching: isAIResponding,
    setIsSearching: setIsAIResponding,
  } = useChatContext();

  const [query, setQuery] = useState("");
  const { getPaperAIResponse, isPending } = usePaperAI();

  const clearChat = () => {
    setMessages?.([]);
    setIsChatActive?.(false);
    setIsAIResponding?.(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setIsChatActive?.(true);
    setMessages?.((prev: ChatMessage[]) => [...prev, userMessage]);
    
    setQuery("");

    const aiMessageId = `msg_${Date.now()}_ai`;

    setMessages?.((prev: ChatMessage[]) => [
      ...prev,
      {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    setIsAIResponding?.(true);

    try {
      const body = { query: userMessage.content };
      getPaperAIResponse(body, {
        onError: (err) => {
          console.error("❌ Error getting AI response:", err);
          setIsAIResponding?.(false);
          setMessages?.((prev: ChatMessage[]) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content:
                      "Sorry, there was an error processing your request. Please try again.",
                  }
                : msg
            )
          );
        },
        onSuccess: async (reader) => {
          if (!reader) {
            setIsAIResponding?.(false);
            return;
          }

          const decoder = new TextDecoder();
          let isFirstChunk = true;
          let fullContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setIsAIResponding?.(false);
              
              // ⭐ Extract papers from the full content
              const extractedPapers = extractPapersFromContent(fullContent);
              
              console.log("📄 Extracted papers:", extractedPapers);
              
              // ⭐ Add metadata to the message
              if (extractedPapers.length > 0) {
                setMessages?.((prev: ChatMessage[]) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { 
                          ...msg, 
                          metadata: { papers: extractedPapers }
                        }
                      : msg
                  )
                );
              }
              break;
            }

            const chunk = decoder.decode(value);
            fullContent += chunk;

            if (isFirstChunk) {
              setIsAIResponding?.(false);
              isFirstChunk = false;
            }

            setMessages?.((prev: ChatMessage[]) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        },
      });
    } catch (err) {
      console.error("Search error:", err);
      setIsAIResponding?.(false);
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center relative">
      {/* ⭐ Clear Chat Button */}
      {isChatActive && messages && messages.length > 0 && (
        <Button
          onClick={clearChat}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 z-10"
        >
          <Trash2 size={16} className="mr-2" />
          Clear Chat
        </Button>
      )}

      {!isChatActive && (
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 text-5xl font-extrabold text-center mb-8"
        >
          Welcome to Research AI
        </motion.h1>
      )}

      {/* ⭐ Pass isSearchPage flag */}
      <ChatWindow
        isChatActive={!!isChatActive}
        messages={messages || []}
        isSearchPage={true}
      />

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`w-full max-w-2xl flex gap-2 bg-zinc-800/40 backdrop-blur-xl p-2 rounded-2xl border border-zinc-700 shadow-lg transition-transform ${
          isChatActive ? "absolute bottom-10" : ""
        }`}
      >
        <Input
          type="text"
          placeholder="Search research papers, authors, or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-slate-200 placeholder:text-zinc-500 border-none focus:ring-0 focus-visible:ring-0"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          variant="secondary"
          disabled={isPending || isAIResponding}
          className="dark:bg-zinc-900 hover:dark:bg-zinc-800 text-white rounded-xl px-4 py-2"
        >
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
      </motion.div>

      {/* Footer or Hint */}
      {!isChatActive && (
        <p className="mt-6 text-sm text-zinc-500 text-center">
          Try queries like{" "}
          <span className="text-slate-300">"Generative AI 2024"</span> or{" "}
          <span className="text-slate-300">"LLM reasoning benchmarks"</span>
        </p>
      )}
    </div>
  );
}
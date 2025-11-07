import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/context/ChatContext";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  isChatActive: boolean;
  messages: ChatMessage[];
  isSearchPage?: boolean;
}

const LoadingDots = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
      </div>
      <span className="text-xs text-zinc-400">AI is thinking...</span>
    </div>
  );
};

// ⭐ Paper Card Component
const PaperCard = ({ paper }: { paper: any }) => {
  return (
    <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors">
      <h3 className="font-semibold text-white mb-2">{paper.title}</h3>
      
      {paper.authors && (
        <p className="text-sm text-zinc-400 mb-2">
          {paper.authors.join(", ")}
        </p>
      )}
      
      {paper.year && (
        <p className="text-xs text-zinc-500 mb-3">Year: {paper.year}</p>
      )}
      
      {paper.abstract && (
        <p className="text-sm text-zinc-300 mb-3 line-clamp-3">
          {paper.abstract}
        </p>
      )}
      
      <div className="flex gap-2">
        {paper.pdf_url && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => window.open(paper.pdf_url, "_blank")}
          >
            <Download className="w-3 h-3 mr-1" />
            Download PDF
          </Button>
        )}
        
        {paper.url && (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => window.open(paper.url, "_blank")}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View Online
          </Button>
        )}
      </div>
    </div>
  );
};

export function ChatWindow({ isChatActive, messages, isSearchPage = false }: ChatWindowProps) {
  const { isAIResponding, isSearching } = useChatContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = isSearchPage ? isSearching : isAIResponding;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isChatActive) return null;

  return (
    <div className="w-full max-w-3xl mx-auto h-[calc(100vh-300px)] mb-4">
      <ScrollArea className="h-full pr-4">
        <div ref={scrollRef} className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                {message.role === "assistant" && message.content === "" && isLoading ? (
                  <LoadingDots />
                ) : message.role === "assistant" ? (
                  <div className="space-y-4">
                    {/* ⭐ Main content */}
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code: ({ node, inline, className, children, ...props }) => {
                            return inline ? (
                              <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          a: ({ node, children, ...props }) => (
                            <a
                              className="text-blue-400 hover:text-blue-300 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    
                    {/* ⭐ Paper cards if metadata exists */}
                    {message.metadata?.papers && message.metadata.papers.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <h4 className="text-sm font-semibold text-zinc-300">
                          Related Papers ({message.metadata.papers.length})
                        </h4>
                        {message.metadata.papers.map((paper, idx) => (
                          <PaperCard key={idx} paper={paper} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

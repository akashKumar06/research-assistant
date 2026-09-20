import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { ChatMessage } from "@/types";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, User } from "lucide-react";
import { LoadingDots } from "./ui/LoadingDots";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoadingHistory?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoadingHistory,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingHistory && messages.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-thin px-4 sm:px-8 pt-6 pb-40">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, i) => {
          const isUser = message.role === "user";
          const isEmpty = !isUser && !message.content;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.15) }}
              className={`flex w-full items-start gap-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow-sm mt-0.5">
                  <Sparkles size={15} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-linear-to-br from-indigo-500 to-violet-500 text-white rounded-br-md"
                    : "bg-card border border-border text-card-foreground rounded-bl-md prose prose-sm dark:prose-invert max-w-none prose-pre:bg-zinc-900 prose-pre:rounded-lg"
                }`}
              >
                {isEmpty ? (
                  <LoadingDots />
                ) : isUser ? (
                  <p className="whitespace-pre-wrap wrap-break-words">
                    {message.content}
                  </p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}

                {!isEmpty && (
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser
                        ? "text-white/70 text-right"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border mt-0.5">
                  <User size={15} className="text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { ChatMessage } from "@/types";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  messages: ChatMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-4/5 h-96 m-auto mb-25 text-white overflow-y-auto px-4 py-6 space-y-4 no-scrollbar">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex w-full ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-md ${
              message.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-zinc-800 text-zinc-100 rounded-bl-none prose prose-invert max-w-none"
            }`}
          >
            {message.role === "assistant" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap wrap-break-words">
                {message.content}
              </p>
            )}

            <span className="block text-xs text-zinc-400 mt-1 text-right">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // ====== HANDLE STREAMING MESSAGE ======
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setInput("");

    const eventSource = new EventSource(
      `http://localhost:8000/research/chat/stream?query=${encodeURIComponent(
        input
      )}`
    );

    eventSource.onmessage = (event) => {
      const chunk = event.data;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };

    eventSource.onopen = () => setLoading(true);

    eventSource.addEventListener("done", () => {
      eventSource.close();
      setLoading(false);
    });
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col px-6 py-4">
      <ThemeToggle />

      {/* Header */}
      <div className="pb-4 border-b border-zinc-700/40 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Chat
        </h1>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md
                ${
                  msg.role === "user"
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : "bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700 backdrop-blur-md rounded-bl-none"
                }
              `}
            >
              {msg.content || (
                <Loader2 className="animate-spin w-4 h-4 text-cyan-400" />
              )}
            </div>
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="border-t border-zinc-700/40 pt-4">
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Ask something..."
            className="flex-1 bg-white/60 dark:bg-zinc-900/60 border-zinc-300 dark:border-zinc-700 backdrop-blur-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <Button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 py-3 rounded-xl shadow-lg bg-cyan-600 hover:bg-cyan-700"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

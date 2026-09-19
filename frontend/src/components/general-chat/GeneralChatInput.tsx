import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface GeneralChatInputProps {
  onSend: (text: string) => void;
}

export default function GeneralChatInput({ onSend }: GeneralChatInputProps) {
  const [question, setQuestion] = useState("");

  function handleClick() {
    if (question.trim() === "") return;
    onSend(question);
    setQuestion("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        absolute bottom-6 left-0 right-0 px-4
        w-full max-w-2xl mx-auto
      "
    >
      <div
        className="
          flex items-center gap-2 p-2 pl-4
          glass-panel rounded-2xl
          shadow-xl shadow-black/5 dark:shadow-black/30
          focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/40
          transition-all
        "
      >
        <input
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground py-2"
          placeholder="Ask anything about research..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
        />

        <button
          onClick={handleClick}
          disabled={!question.trim()}
          className="shrink-0 p-2.5 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2">
        Nexus can make mistakes. Verify important research findings.
      </p>
    </motion.div>
  );
}

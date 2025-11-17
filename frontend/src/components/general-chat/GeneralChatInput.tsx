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
        absolute bottom-6 left-0 right-0   /* <-- Replaced mb-6 */
        w-full max-w-3xl mx-auto p-3    
        bg-white/50 dark:bg-zinc-900/50 
        backdrop-blur-xl rounded-2xl 
        border border-zinc-300/40 dark:border-zinc-700 
        flex items-center gap-3 shadow-lg
      "
    >
      <input
        className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500"
        placeholder="Ask anything about research..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleClick}
        className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <Send size={18} />
      </button>
    </motion.div>
  );
}

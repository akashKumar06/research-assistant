import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    console.log("Searching for:", query);
    setIsChatActive(true);
    // You can trigger your arxiv API call here
  };

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center">
      {!isChatActive && (
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-teal-400 text-5xl font-extrabold text-center mb-8"
        >
          Welcome to Research AI
        </motion.h1>
      )}
      {isChatActive && <div className="bg-zinc-900 text-white">Hwllo</div>}

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`w-full max-w-2xl flex items-center gap-2 bg-zinc-800/40 backdrop-blur-xl p-2 rounded-2xl border border-zinc-700 shadow-lg transition-transform ${
          isChatActive ? "translate-y-48" : ""
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

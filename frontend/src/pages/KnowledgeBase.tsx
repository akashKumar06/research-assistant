import { useMemo, useState } from "react";
import KBItemCard from "@/components/knowledge-base/KBItemCard";
import KBSearchBar from "@/components/knowledge-base/KBSearchBar";
import KBEmptyState from "@/components/knowledge-base/KBEmptyState";
import { motion } from "framer-motion";
import { Library } from "lucide-react";

const dummyPapers = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: "2017",
    abstract:
      "A Transformer-based model that replaces recurrent networks with self-attention mechanisms...",
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    year: "2018",
    abstract:
      "A bidirectional Transformer model enabling contextual understanding of natural language...",
  },
  {
    id: "3",
    title: "GPT-4 Technical Report",
    authors: "OpenAI",
    year: "2023",
    abstract:
      "A detailed description of the GPT-4 model architecture, training, and capabilities...",
  },
];

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");

  const filteredPapers = useMemo(() => {
    if (!query.trim()) return dummyPapers;
    const q = query.toLowerCase();
    return dummyPapers.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="relative min-h-full p-6 sm:p-10 max-w-6xl mx-auto">
      {/* Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow-md shadow-indigo-500/25">
          <Library className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Your Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground">
            {dummyPapers.length} papers saved
          </p>
        </div>
      </motion.div>

      <div className="mb-8">
        <KBSearchBar query={query} setQuery={setQuery} />
      </div>

      {/* Paper Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <KBItemCard key={paper.id} {...paper} />
          ))}
        </div>
      ) : (
        <KBEmptyState />
      )}
    </div>
  );
}

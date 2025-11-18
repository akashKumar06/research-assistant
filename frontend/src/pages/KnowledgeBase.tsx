import KBItemCard from "@/components/knowledge-base/KBItemCard";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

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
  return (
    <div className="relative p-10">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          text-4xl font-extrabold 
          text-zinc-900 dark:text-white mb-10
        "
      >
        Your Knowledge Base
      </motion.h1>

      {/* Paper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPapers.map((paper) => (
          <KBItemCard key={paper.id} {...paper} />
        ))}
      </div>
    </div>
  );
}



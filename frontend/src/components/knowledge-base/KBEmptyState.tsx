import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function KBEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center mt-20"
    >
      <BookOpen size={50} className="text-zinc-400 dark:text-zinc-600 mb-4" />
      <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
        No papers saved yet
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
        Save papers from search results or upload PDFs to start building your
        knowledge library.
      </p>
    </motion.div>
  );
}

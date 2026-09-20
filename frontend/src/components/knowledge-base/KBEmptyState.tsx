import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function KBEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center mt-16 py-16 rounded-2xl border border-dashed border-border"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/15 to-fuchsia-500/15 mb-4">
        <BookOpen size={26} className="text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No papers found
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Save papers from search results or upload PDFs to start building your
        knowledge library.
      </p>
    </motion.div>
  );
}

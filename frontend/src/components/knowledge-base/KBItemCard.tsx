import { motion } from "framer-motion";
import { FileText, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KBItemCardProps {
  title: string;
  authors: string;
  year: string;
  abstract: string;
  onOpenPdf?: () => void;
  onChat?: () => void;
  onDelete?: () => void;
}

export default function KBItemCard({
  title,
  authors,
  year,
  abstract,
  onOpenPdf,
  onChat,
  onDelete,
}: KBItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="
        h-full flex flex-col justify-between
        bg-white/60 dark:bg-zinc-900/40 
        backdrop-blur-xl rounded-xl p-6
        border border-zinc-300/40 dark:border-zinc-800
        hover:shadow-xl hover:shadow-blue-500/10
        transition
      "
    >
      {/* TOP SECTION */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {authors} • {year}
        </p>

        <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-4">
          {abstract}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          onClick={onOpenPdf}
          variant="secondary"
          className="flex-1 flex items-center gap-2 text-zinc-900 dark:text-white bg-zinc-200/60 dark:bg-zinc-800"
        >
          <FileText size={16} />
          Open PDF
        </Button>

        <Button
          onClick={onChat}
          variant="default"
          className="flex-1 flex items-center gap-2"
        >
          <MessageSquare size={16} />
          Chat
        </Button>

        <Button
          onClick={onDelete}
          variant="destructive"
          className="flex items-center gap-2 px-3 bg-red-600 hover:bg-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  );
}

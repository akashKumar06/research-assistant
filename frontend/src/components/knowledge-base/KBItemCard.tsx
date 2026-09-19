import { motion } from "framer-motion";
import { FileText, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      viewport={{ once: true }}
      className="
        h-full flex flex-col justify-between
        glass-panel rounded-2xl p-6
        hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1
        transition-all
      "
    >
      {/* TOP SECTION */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-foreground line-clamp-2">
            {title}
          </h3>
          <Badge
            variant="secondary"
            className="shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20"
          >
            {year}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5">{authors}</p>

        <p className="mt-4 text-sm text-foreground/80 line-clamp-4">
          {abstract}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex items-center gap-2">
        <Button
          onClick={onOpenPdf}
          variant="secondary"
          size="sm"
          className="flex-1 flex items-center gap-1.5"
        >
          <FileText size={14} />
          Open
        </Button>

        <Button
          onClick={onChat}
          size="sm"
          className="flex-1 flex items-center gap-1.5 bg-linear-to-r from-indigo-500 to-violet-500 hover:brightness-110"
        >
          <MessageSquare size={14} />
          Chat
        </Button>

        <Button
          onClick={onDelete}
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
}

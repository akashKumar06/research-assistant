import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface GreetingScreenProps {
  heading: string;
  subHeading: string;
  suggestions?: string[];
  onSuggestionClick?: (text: string) => void;
}

export default function GreetingScreen({
  heading,
  subHeading,
  suggestions,
  onSuggestionClick,
}: GreetingScreenProps) {
  return (
    <div className="w-4/5 max-w-2xl m-auto flex flex-col justify-center items-center pb-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30"
      >
        <Sparkles className="h-7 w-7 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl font-bold text-foreground mb-3"
      >
        {heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-muted-foreground max-w-xl"
      >
        {subHeading}
      </motion.p>

      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mt-7"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick?.(s)}
              className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-muted/60 text-foreground/80 hover:text-foreground hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-colors"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

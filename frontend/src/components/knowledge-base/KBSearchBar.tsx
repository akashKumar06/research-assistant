import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function KBSearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  return (
    <div
      className="
      flex items-center gap-3 
      bg-white/60 dark:bg-zinc-900/40 
      border border-zinc-300/40 dark:border-zinc-800
      backdrop-blur-md
      rounded-xl px-4 py-3 shadow
      "
    >
      <Search size={20} className="text-zinc-500 dark:text-zinc-400" />
      <Input
        placeholder="Search your saved papers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none shadow-none focus-visible:ring-0 text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}

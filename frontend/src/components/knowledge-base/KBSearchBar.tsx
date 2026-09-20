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
      glass-panel
      rounded-xl px-4 py-2.5 shadow-sm
      focus-within:ring-2 focus-within:ring-indigo-500/40
      transition-all
      "
    >
      <Search size={18} className="text-muted-foreground shrink-0" />
      <Input
        placeholder="Search your saved papers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none shadow-none focus-visible:ring-0 text-sm"
      />
    </div>
  );
}

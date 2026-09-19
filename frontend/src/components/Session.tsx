import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";

interface SessionProps {
  session: { id: string | number; title: string };
  isActive?: boolean;
  onDelete: (id: string | number) => void;
  isDeleting?: boolean;
}

function Session({ session, isActive, onDelete, isDeleting }: SessionProps) {
  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onDelete(session.id);
  }

  return (
    <Link
      to={`${session.id}`}
      key={session.id}
      className={cn(
        "group w-full flex items-center justify-between gap-2 pl-3 pr-2 py-2.5 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-foreground/80 hover:bg-accent/60"
      )}
    >
      {/* Left section (icon + title) */}
      <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
        <MessageSquare
          size={15}
          className={cn(
            "shrink-0",
            isActive ? "text-indigo-500" : "text-muted-foreground"
          )}
        />
        <span className="truncate text-sm">{session.title}</span>
      </div>

      {/* Right: delete button — visible only on hover */}
      {!isDeleting ? (
        <button
          onClick={handleDelete}
          className="
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  text-muted-foreground hover:text-destructive
                  p-1 rounded shrink-0
                "
        >
          <Trash2 size={14} />
        </button>
      ) : (
        <Loader2 size={14} className="animate-spin text-muted-foreground shrink-0" />
      )}
    </Link>
  );
}

export default Session;

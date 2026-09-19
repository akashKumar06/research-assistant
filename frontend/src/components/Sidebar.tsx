import { Loader2, Plus, MessagesSquare } from "lucide-react";
import { Link, useParams } from "react-router";
import Session from "./Session";

interface SidebarProps {
  sessions: { id: string | number; title: string }[];
  pending: boolean;
  onDelete: (id: string | number) => void;
  deletingId?: string | number | null;
}

export default function Sidebar({
  sessions,
  pending,
  onDelete,
  deletingId,
}: SidebarProps) {
  const params = useParams();

  return (
    <aside
      className="
      w-72 h-full shrink-0 border-r
      border-border
      bg-sidebar/70
      backdrop-blur-2xl
      flex flex-col
      p-4
    "
    >
      {/* New chat button */}
      <Link
        to="new"
        className="
          w-full flex items-center justify-center gap-2 px-4 py-2.5
          rounded-xl bg-linear-to-r from-indigo-500 to-violet-500
          text-white font-medium text-sm
          shadow-md shadow-indigo-500/25
          hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5
          active:translate-y-0
          transition-all
        "
      >
        <Plus size={17} strokeWidth={2.5} /> New Chat
      </Link>

      {/* Sessions list */}
      <div className="mt-2 flex items-center gap-2 px-2 pt-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-1 flex-1 pr-1 overflow-y-auto scrollbar-thin">
        {pending ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : sessions?.length ? (
          sessions.map((session) => (
            <Session
              key={session.id}
              session={session}
              isActive={
                String(session.id) === params.sessionId ||
                String(session.id) === params.id
              }
              onDelete={onDelete}
              isDeleting={String(deletingId) === String(session.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 px-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MessagesSquare size={18} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No conversations yet
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

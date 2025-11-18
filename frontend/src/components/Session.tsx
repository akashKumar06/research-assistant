import { useDeleteResearchSession } from "@/hooks/research/useDeleteResearchSession";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderIcon, MessageSquare, Trash2 } from "lucide-react";
import { Link } from "react-router";

function Session({ session }) {
  const qc = useQueryClient();

  const { deleteSession, isDeleting } = useDeleteResearchSession();

  function handleDelete(session_id: number) {
    deleteSession(session_id, {
      onSuccess: () => {
        qc.invalidateQueries(["research-sessions"]);
      },
    });
  }
  return (
    <Link
      to={`${session.id}`}
      key={session.id}
      className="
                group w-full flex items-center justify-between 
                px-4 py-3 rounded-lg 
                hover:bg-zinc-200 dark:hover:bg-zinc-800 
                text-zinc-700 dark:text-zinc-300
                cursor-pointer
              "
    >
      {/* Left section (icon + title) */}
      <button className="flex items-center gap-2 flex-1 overflow-hidden">
        <MessageSquare size={16} className="text-zinc-500 dark:text-zinc-400" />
        <span className="truncate">{session.title}</span>
      </button>

      {/* Right: delete button → visible only on hover */}

      {!isDeleting ? (
        <button
          onClick={() => handleDelete(Number(session.id))}
          className="
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200
                  text-red-500 hover:text-red-600
                  p-1 rounded
                "
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <LoaderIcon size={16} />
      )}
    </Link>
  );
}

export default Session;

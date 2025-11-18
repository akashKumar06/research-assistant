import { Loader, Plus } from "lucide-react";
import Session from "./Session";

export default function Sidebar({ sessions, pending }) {
  return (
    <aside
      className="
      w-64 h-full border-r 
      border-zinc-300 dark:border-zinc-800 
      bg-white/60 dark:bg-zinc-900/40 
      backdrop-blur-2xl 
      flex flex-col 
      p-4
    "
    >
      {/* New chat button */}
      <button
        className="
          w-full flex items-center gap-2 px-4 py-3 
          rounded-xl bg-blue-500/10 dark:bg-blue-700/20 
          text-blue-600 dark:text-blue-300 
          border border-blue-500/20 
          hover:bg-blue-500/20 transition
        "
      >
        <Plus size={18} /> New Chat
      </button>

      {/* Sessions list */}
      <div className="mt-6 space-y-2 flex-1 pr-1 overflow-y-auto no-scrollbar">
        {pending ? (
          <Loader />
        ) : (
          sessions.map((session) => (
            <Session key={session.id} session={session} />
          ))
        )}
      </div>
    </aside>
  );
}

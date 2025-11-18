import Sidebar from "@/components/Sidebar";
import { useResearchSessions } from "@/hooks/research/useResearchSessions";
import { Outlet } from "react-router";

export default function PDFChatLayout() {
  const { sessions, isPending } = useResearchSessions();

  return (
    <div className="flex h-full overflow-hidden bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <Sidebar sessions={sessions} pending={isPending} />
      <div className="flex-1 h-full relative flex flex-col justify-between">
        <Outlet />
      </div>
    </div>
  );
}

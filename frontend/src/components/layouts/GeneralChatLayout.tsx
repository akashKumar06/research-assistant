import Sidebar from "@/components/Sidebar";
import { useResearchSessions } from "@/hooks/research/useResearchSessions";
import { useDeleteResearchSession } from "@/hooks/research/useDeleteResearchSession";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Outlet } from "react-router";

export default function GeneralChatLayout() {
  const { sessions, isPending } = useResearchSessions();
  const { deleteSession, isDeleting, deletingId } = useDeleteResearchSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const handleDelete = (id: string | number) => {
    deleteSession(Number(id), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["research-sessions"] });
        if (String(id) === sessionId) {
          navigate("/chat/new");
        }
      },
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        sessions={sessions ?? []}
        pending={isPending}
        onDelete={handleDelete}
        deletingId={isDeleting ? deletingId : null}
      />
      <div className="flex-1 h-full relative flex flex-col justify-between overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

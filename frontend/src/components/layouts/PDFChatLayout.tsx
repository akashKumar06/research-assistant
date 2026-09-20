import Sidebar from "@/components/Sidebar";
import { usePdfSessions } from "@/hooks/pdf/usePdfSessions";
import { useDeletePdf } from "@/hooks/pdf/usePdfDelete";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Outlet } from "react-router";

export default function PDFChatLayout() {
  const { sessions, isPending } = usePdfSessions();
  const { mutate: deletePdf, isPending: isDeleting, variables: deletingId } =
    useDeletePdf();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = (pdfId: string | number) => {
    deletePdf(String(pdfId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pdf-sessions"] });
        if (String(pdfId) === id) {
          navigate("/chat-pdf/new");
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

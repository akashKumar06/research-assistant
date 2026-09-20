import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

interface PdfSession {
  id: string;
  file_name: string;
}

export function usePdfSessions() {
  const { data, isPending } = useQuery({
    queryKey: ["pdf-sessions"],
    queryFn: async () => {
      const res = await api.get("/chat");
      return res.data.pdfs as PdfSession[];
    },
    refetchOnWindowFocus: false,
  });

  const sessions = (data ?? []).map((pdf) => ({
    id: pdf.id,
    title: pdf.file_name,
  }));

  return { sessions, isPending };
}

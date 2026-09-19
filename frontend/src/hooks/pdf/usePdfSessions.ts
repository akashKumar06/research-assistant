import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function usePdfSessions() {
  const { data, isPending } = useQuery({
    queryKey: ["pdf-sessions"],
    queryFn: async () => {
      const res = await api.get("/chat");
      return res.data.pdfs;
    },
    refetchOnWindowFocus: false,
  });

  const sessions = (data ?? []).map((pdf: any) => ({
    id: pdf.id,
    title: pdf.file_name,
  }));

  return { sessions, isPending };
}

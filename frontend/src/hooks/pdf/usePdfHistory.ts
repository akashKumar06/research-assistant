import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function usePdfHistory(pdf_id: string | null | undefined) {
  const { data: messages } = useQuery({
    queryKey: ["pdf-history", pdf_id],
    queryFn: async () => {
      const res = await api.get(`/chat/${pdf_id}/history`);
      return res.data;
    },
    enabled: !!pdf_id,
  });

  return { messages };
}

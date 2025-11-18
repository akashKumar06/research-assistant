import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useResearchMessages(sessionId: number | null) {
  return useQuery({
    queryKey: ["research-messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const res = await api.get(`/research/sessions/${sessionId}/messages`);
      return res.data.messages;
    },
    enabled: !!sessionId,
  });
}

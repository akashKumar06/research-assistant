import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useResearchSessions() {
  const { data: sessions, isPending } = useQuery({
    queryKey: ["research-sessions"],
    queryFn: async () => {
      const res = await api.get("/research/sessions");
      return res.data.sessions;
    },
    refetchOnWindowFocus: false,
  });
  return { sessions, isPending };
}

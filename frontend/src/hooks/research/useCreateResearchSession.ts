import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

interface CreateSessionPayload {
  user_id: number;
  title: string | null;
}

export function useCreateResearchSession() {
  const { mutate: createSession, isPending } = useMutation({
    mutationFn: async (payload: CreateSessionPayload) => {
      const res = await api.post("/research/sessions", payload);
      return res.data;
    },
  });
  return { createSession, isPending };
}

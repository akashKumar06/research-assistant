import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

interface CreateSessionPayload {
  user_id: number;
  title: string | null;
}

export function useCreateResearchSession() {
  const {
    mutate: createSession,
    mutateAsync: createSessionAsync,
    isPending,
  } = useMutation({
    mutationFn: async (payload: CreateSessionPayload) => {
      const res = await api.post("/research/sessions", payload);
      return res.data;
    },
  });
  return { createSession, createSessionAsync, isPending };
}

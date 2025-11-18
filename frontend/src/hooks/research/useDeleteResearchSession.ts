import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export function useDeleteResearchSession() {
  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationFn: async (sessionId: number) => {
      await api.delete(`/research/sessions/${sessionId}`);
    },
  });
  return { deleteSession, isDeleting };
}

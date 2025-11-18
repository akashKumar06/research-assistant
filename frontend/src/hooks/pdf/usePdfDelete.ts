import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export function useDeletePdf() {
  return useMutation({
    mutationFn: async (pdf_id: string) => {
      await api.delete(`/chat/${pdf_id}`);
    },
  });
}

import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export function usePdfUpload() {
  const {
    mutate: uploadFile,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
  });
  return { uploadFile, isPending, isSuccess };
}

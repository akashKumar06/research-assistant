import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useUploadFile() {
  const {
    mutate: uploadFile,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (file: FormData) => {
      return axios.post("http://localhost:8000/api/upload", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
  return { uploadFile, isPending, isSuccess };
}

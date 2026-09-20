import { useMutation } from "@tanstack/react-query";

interface PdfChatRequest {
  pdf_id: string;
  question: string;
}

export function usePdfChat() {
  const token = localStorage.getItem("access_token");
  let authorization = "";
  if (token) {
    authorization = `Bearer ${token}`;
  }

  const {
    mutate: getResponse,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: PdfChatRequest) => {
      const pdf_id = data.pdf_id;
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/chat/${pdf_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify({ question: data.question }),
      });

      const reader = response.body?.getReader();
      return reader;
    },
  });

  return { getResponse, isPending, isSuccess };
}

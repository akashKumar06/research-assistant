import { useMutation } from "@tanstack/react-query";

export function useChat() {
  const {
    mutate: getAIResponse,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (query: object) => {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      const reader = response.body?.getReader();
      return reader;
    },
  });

  return { getAIResponse, isPending, isSuccess };
}

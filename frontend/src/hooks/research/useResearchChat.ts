import { useMutation } from "@tanstack/react-query";

export function useResearchChat() {
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
    mutationFn: async (data: object) => {
      const response = await fetch("http://localhost:8000/research/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(data),
      });

      const reader = response.body?.getReader();
      return reader;
    },
  });

  return { getResponse, isPending, isSuccess };
}

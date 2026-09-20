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
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/research/chat`, {
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

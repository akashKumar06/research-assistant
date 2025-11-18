import { useMutation } from "@tanstack/react-query";

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
    mutationFn: async (data: object) => {
      const pdf_id = data.pdf_id;
      const response = await fetch(`http://localhost:8000/chat/${pdf_id}`, {
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

import { useMutation } from "@tanstack/react-query";

interface ChatBody {
  query: string;
}

export function useChat() {
  const {
    mutate: getAIResponse,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (body: ChatBody) => {
      // Get session ID from localStorage
      const sessionId = localStorage.getItem("pdf_session_id");

      console.log("📨 Sending chat message:", body.query);
      console.log("🔑 Session ID from localStorage:", sessionId);

      if (!sessionId) {
        console.error("❌ No session ID found!");
        throw new Error("Please upload a PDF first to create a session.");
      }

      // Make fetch request with session-id header
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "session-id": sessionId, // ⭐ This is the key change
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("✅ Response received, returning reader");

      // Return the readable stream reader
      return response.body?.getReader();
    },
  });

  return { getAIResponse, isPending, isSuccess };
}

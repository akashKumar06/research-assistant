import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { ChatMessage } from "@/types";
import { ChatWindow } from "../ChatWindow";
import PDFChatInput from "./PDFChatInput";
import { usePdfChat } from "@/hooks/pdf/usePdfChat";
import { usePdfHistory } from "@/hooks/pdf/usePdfHistory";
import GreetingScreen from "../GreetScreen";

export default function PDFChat() {
  const { id } = useParams();

  const pdfId = id === "new" ? null : id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { getResponse } = usePdfChat();

  const { messages: loadedMessages, isLoading: isLoadingHistory } =
    usePdfHistory(pdfId);

  useEffect(() => {
    if (id === "new") {
      setMessages([]);
      return;
    }
    if (loadedMessages) {
      setMessages(loadedMessages);
    }
  }, [loadedMessages, id]);

  const navigate = useNavigate();

  const streamAssistantReply = async (
    reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
    aiMessageId: string
  ) => {
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }
  };

  const handleSend = async (text: string, pdf_id_from_upload: string) => {
    const finalPdfId = pdfId ?? pdf_id_from_upload;

    if (!finalPdfId) {
      alert("Please upload a file");
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const aiMessageId = `msg_${Date.now()}_ai`;

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: aiMessageId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    if (!pdfId) {
      navigate(`/chat-pdf/${finalPdfId}`);
    }

    try {
      const body = { pdf_id: finalPdfId, question: text };
      getResponse(body, {
        onError: (err) => {
          console.error("❌ Error getting AI response:", err);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content:
                      "Sorry, there was an error processing your request. Please try again.",
                  }
                : msg
            )
          );
        },
        onSuccess: (reader) => streamAssistantReply(reader, aiMessageId),
      });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const showGreeting = id === "new" && messages.length === 0;

  return (
    <>
      {showGreeting ? (
        <GreetingScreen
          heading={"✨ How can I help you today?"}
          subHeading={
            "Upload a PDF below, then ask questions about it — summaries, key findings, or anything you need explained."
          }
        />
      ) : (
        <ChatWindow messages={messages} isLoadingHistory={isLoadingHistory} />
      )}

      <PDFChatInput onSend={handleSend} />
    </>
  );
}

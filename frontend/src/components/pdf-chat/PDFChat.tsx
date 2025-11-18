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

  const { messages: loadedMessages } = usePdfHistory(pdfId);

  useEffect(() => {
    if (loadedMessages) {
      setMessages(loadedMessages);
    }
  }, [loadedMessages]);

  const navigate = useNavigate();

  const handleSend = async (text: string, pdf_id_from_upload: string) => {
    let finalPdfId = pdfId;

    if (!finalPdfId) {
      finalPdfId = pdf_id_from_upload;

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const aiMessageId = `msg_${Date.now()}_ai`;
      setMessages?.((prev: ChatMessage[]) => [
        ...prev,
        {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      try {
        const body = {
          pdf_id: finalPdfId,
          question: text,
        };
        getResponse(body, {
          onError: (err) => {
            console.error("❌ Error getting AI response:", err);
            setMessages?.((prev: ChatMessage[]) =>
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
          onSuccess: async (reader) => {
            if (!reader) {
              return;
            }

            const decoder = new TextDecoder();
            let isFirstChunk = true;

            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              const chunk = decoder.decode(value);

              if (isFirstChunk) {
                isFirstChunk = false;
              }

              setMessages?.((prev: ChatMessage[]) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
            }
          },
        });
      } catch (err) {
        console.error("Search error:", err);
      }
      navigate(`/chat-pdf/${finalPdfId}`);
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const aiMessageId = `msg_${Date.now()}_ai`;
    setMessages?.((prev: ChatMessage[]) => [
      ...prev,
      {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const body = {
        pdf_id: finalPdfId,
        question: text,
      };
      getResponse(body, {
        onError: (err) => {
          console.error("❌ Error getting AI response:", err);
          setMessages?.((prev: ChatMessage[]) =>
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
        onSuccess: async (reader) => {
          if (!reader) {
            return;
          }

          const decoder = new TextDecoder();
          let isFirstChunk = true;

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const chunk = decoder.decode(value);

            if (isFirstChunk) {
              isFirstChunk = false;
            }

            setMessages?.((prev: ChatMessage[]) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        },
      });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <>
      {id === "new" ? (
        <GreetingScreen
          heading={"✨How can I help you today?"}
          subHeading={
            "Ask anything — research questions, paper summaries, explanations, or technical help."
          }
        />
      ) : (
        <ChatWindow messages={messages} />
      )}

      <PDFChatInput onSend={handleSend} />
    </>
  );
}

import { useParams } from "react-router";
import GreetingScreen from "./GreetScreen";
import { ChatWindow } from "./ChatWindow";
import GeneralChatInput from "./general-chat/GeneralChatInput";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { useResearchChat } from "@/hooks/research/useResearchChat";
import { useResearchMessages } from "@/hooks/research/useResearchMessages";
import { useCreateResearchSession } from "@/hooks/research/useCreateResearchSession";
import type { ChatMessage } from "@/types";
import { extractPapersFromContent } from "@/utils/paper-extract";

export default function Chat() {
  const { sessionId } = useParams();

  const [activeSession, setActiveSession] = useState<number | null>(() =>
    sessionId === "new" ? null : Number(sessionId)
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { createSession } = useCreateResearchSession();

  const { data: loadedMessages } = useResearchMessages(activeSession);
  const { getResponse } = useResearchChat();

  const user = getUser();

  useEffect(() => {
    if (loadedMessages) {
      setMessages(loadedMessages);
    }
  }, [loadedMessages]);

  const handleNewChat = async (text: string) => {
    createSession(
      {
        user_id: user.id,
        title: text,
      },
      {
        onSuccess: (s) => {
          setActiveSession(s.id);
          setMessages([]);
        },
      }
    );
  };

  const handleSend = async (text: string) => {
    if (!activeSession) {
      await handleNewChat(text);
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
        user_id: user.id,
        session_id: activeSession,
        query: userMessage.content,
      };
      getResponse(body, {
        onError: (err) => {
          console.error("❌ Error getting AI response:", err);
          // setIsAIResponding?.(false);
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
            // setIsAIResponding?.(false);
            return;
          }

          const decoder = new TextDecoder();
          let isFirstChunk = true;
          let fullContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // setIsAIResponding?.(false);

              const extractedPapers = extractPapersFromContent(fullContent);

              console.log("📄 Extracted papers:", extractedPapers);

              if (extractedPapers.length > 0) {
                setMessages?.((prev: ChatMessage[]) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          metadata: { papers: extractedPapers },
                        }
                      : msg
                  )
                );
              }
              break;
            }

            const chunk = decoder.decode(value);
            fullContent += chunk;

            if (isFirstChunk) {
              // setIsAIResponding?.(false);
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
      // setIsAIResponding?.(false);
    }
  };

  return (
    <>
      {sessionId === "new" ? (
        <GreetingScreen
          heading={"✨How can I help you today?"}
          subHeading={
            "Ask anything — research questions, paper summaries, explanations, or technical help."
          }
        />
      ) : (
        <ChatWindow messages={messages} />
      )}

      <GeneralChatInput onSend={handleSend} />
    </>
  );
}

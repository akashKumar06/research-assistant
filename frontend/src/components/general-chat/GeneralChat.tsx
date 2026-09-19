import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/utils/auth";
import { useResearchChat } from "@/hooks/research/useResearchChat";
import { useResearchMessages } from "@/hooks/research/useResearchMessages";
import { useCreateResearchSession } from "@/hooks/research/useCreateResearchSession";
import type { ChatMessage } from "@/types";
import { extractPapersFromContent } from "@/utils/paper-extract";
import { ChatWindow } from "../ChatWindow";
import GeneralChatInput from "./GeneralChatInput";
import GreetingScreen from "../GreetScreen";

const SUGGESTIONS = [
  "Summarize the latest research on transformer efficiency",
  "Explain diffusion models like I'm new to ML",
  "Find recent papers on multi-agent reinforcement learning",
];

export default function GeneralChat() {
  const { sessionId } = useParams();
  const activeSession = sessionId === "new" ? null : Number(sessionId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Remembers the last session whose messages we already have an authoritative
  // local copy of — either loaded from the server or just built locally after
  // creating a brand new session. Prevents the history fetch for a session we
  // just created (which resolves *after* we've already started streaming into
  // it) from racing in and wiping the in-progress conversation.
  const hydratedSessionRef = useRef<number | null>(null);

  const { createSessionAsync } = useCreateResearchSession();
  const { data: loadedMessages, isLoading: isLoadingHistory } =
    useResearchMessages(activeSession);
  const { getResponse } = useResearchChat();
  const queryClient = useQueryClient();
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId === "new") {
      setMessages([]);
      hydratedSessionRef.current = null;
      return;
    }
    if (activeSession === hydratedSessionRef.current) return;
    if (loadedMessages) {
      setMessages(loadedMessages);
      hydratedSessionRef.current = activeSession;
    }
  }, [loadedMessages, activeSession, sessionId]);

  const streamAssistantReply = async (
    reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
    aiMessageId: string
  ) => {
    if (!reader) return;

    const decoder = new TextDecoder();
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        const extractedPapers = extractPapersFromContent(fullContent);
        if (extractedPapers.length > 0) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, metadata: { papers: extractedPapers } }
                : msg
            )
          );
        }
        break;
      }

      const chunk = decoder.decode(value);
      fullContent += chunk;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }
  };

  const handleSend = async (text: string) => {
    let sessionIdToUse = activeSession;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const aiMessageId = `msg_${Date.now()}_ai`;

    // Optimistically show both bubbles immediately — don't wait on session
    // creation or the network round-trip before the user sees their message.
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: aiMessageId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    if (!sessionIdToUse) {
      try {
        const newSession = await createSessionAsync({
          user_id: user.id,
          title: text,
        });
        sessionIdToUse = newSession.id;
        // Mark hydrated *before* navigating so the history fetch that
        // `useResearchMessages` kicks off once the route changes never
        // overwrites the conversation we're actively streaming into.
        hydratedSessionRef.current = newSession.id;
        queryClient.invalidateQueries({ queryKey: ["research-sessions"] });
        navigate(`/chat/${newSession.id}`);
      } catch (err) {
        console.error("❌ Error creating session:", err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content:
                    "Sorry, couldn't start a new chat. Please try again.",
                }
              : msg
          )
        );
        return;
      }
    }

    try {
      const body = {
        user_id: user.id,
        session_id: sessionIdToUse,
        query: text,
      };
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

  const showGreeting = sessionId === "new" && messages.length === 0;

  return (
    <>
      {showGreeting ? (
        <GreetingScreen
          heading={"✨ How can I help you today?"}
          subHeading={
            "Ask anything — research questions, paper summaries, explanations, or technical help."
          }
          suggestions={SUGGESTIONS}
          onSuggestionClick={handleSend}
        />
      ) : (
        <ChatWindow messages={messages} isLoadingHistory={isLoadingHistory} />
      )}

      <GeneralChatInput onSend={handleSend} />
    </>
  );
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ChatMessage } from "@/types";

interface ChatContextType {
  // Chat state
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isChatActive: boolean;
  setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>;
  isAIResponding: boolean;
  setIsAIResponding: React.Dispatch<React.SetStateAction<boolean>>;
  clearChat: () => void;
  
  // ⭐ Search Papers state
  searchResults: any[];
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);

  // ⭐ Search Papers state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Clear session on component mount (page refresh)
  useEffect(() => {
    console.log("🔄 Page refreshed - clearing old session");
    
    // Clear session ID from localStorage
    localStorage.removeItem("pdf_session_id");
    
    // Clear any cached chat data
    localStorage.removeItem("chat_messages");
    localStorage.removeItem("chat_active");
    
    console.log("✅ Session cleared - ready for new upload");
  }, []);

  const clearChat = () => {
    setMessages([]);
    setIsChatActive(false);
    setIsAIResponding(false);
    localStorage.removeItem("pdf_session_id");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isChatActive,
        setIsChatActive,
        isAIResponding,
        setIsAIResponding,
        clearChat,
        // ⭐ Search Papers state
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
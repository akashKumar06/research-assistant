"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, Search, Loader, CheckCircle, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/types";
import { motion } from "framer-motion";
import { useUploadFile } from "@/hooks/mutations/useUploadFile";
import { useChat } from "@/hooks/mutations/useChat";
import { ChatWindow } from "@/components/ChatWindow";
import { useChatContext } from "@/context/ChatContext";

const FilePlaceholder = ({
  file,
  index,
  onRemoveFile,
}: {
  file: File;
  index: number;
  onRemoveFile: (index: number) => void;
}) => {
  const { uploadFile, isPending, isSuccess, sessionData } = useUploadFile();
  
  useEffect(() => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("📄 Uploading file:", file.name);
    uploadFile(formData);
  }, [file, uploadFile]);

  useEffect(() => {
    if (isSuccess && sessionData) {
      console.log("✅ File uploaded successfully!");
      console.log("📋 Session ID:", sessionData.session_id);
    }
  }, [isSuccess, sessionData]);

  return (
    <div
      key={index}
      className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md"
    >
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-zinc-600 dark:text-zinc-300" />
        <span className="text-sm text-zinc-700 dark:text-zinc-100 truncate w-40">
          {file.name}
        </span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRemoveFile(index)}
        className="text-red-500 hover:text-red-600"
      >
        {isPending && <Loader className="animate-spin" size={16} />}
        {isSuccess && <CheckCircle size={16} className="text-green-500" />}
        {!isPending && !isSuccess && <X size={16} />}
      </Button>
    </div>
  );
};

const Chat = () => {
  // ⭐ Get ALL context states including loading state
  const { 
    messages, 
    setMessages, 
    isChatActive, 
    setIsChatActive, 
    clearChat,
    isAIResponding,
    setIsAIResponding
  } = useChatContext();
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");

  const { getAIResponse, isPending } = useChat();

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const sessionId = localStorage.getItem("pdf_session_id");
    if (!sessionId) {
      console.error("❌ No session ID - please upload a PDF first");
      alert("Please upload a PDF document first!");
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setIsChatActive(true);
    setMessages((prev) => [...prev, userMessage]);
    
    // ⭐ Clear input immediately after adding user message
    setQuery("");

    const aiMessageId = `msg_${Date.now()}_ai`;

    // ⭐ Add empty AI message
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    setIsAIResponding(true); // ⭐ Start loading

    try {
      const body = { query: userMessage.content }; // ⭐ Use saved query content
      getAIResponse(body, {
        onError: (err) => {
          console.error("❌ Error getting AI response:", err);
          setIsAIResponding(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { 
                    ...msg, 
                    content: "Sorry, there was an error processing your request. Please try again." 
                  }
                : msg
            )
          );
        },
        onSuccess: async (reader) => {
          if (!reader) {
            setIsAIResponding(false);
            return;
          }

          const decoder = new TextDecoder();
          let isFirstChunk = true;

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setIsAIResponding(false);
              break;
            }
            
            const chunk = decoder.decode(value);
            
            if (isFirstChunk) {
              setIsAIResponding(false);
              isFirstChunk = false;
            }
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsAIResponding(false);
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center relative">
      {/* ⭐ Clear Chat Button */}
      {isChatActive && messages.length > 0 && (
        <Button
          onClick={clearChat}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 z-10"
        >
          <Trash2 size={16} className="mr-2" />
          Clear Chat
        </Button>
      )}

      {!isChatActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-3xl font-bold text-white mb-2">Start a Conversation</h1>
          <p className="text-zinc-400 mb-6">
            Ask questions about your indexed papers or start by uploading PDFs
          </p>
        </motion.div>
      )}

      <ChatWindow isChatActive={isChatActive} messages={messages} />

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`w-full max-w-2xl flex flex-col gap-2 bg-zinc-800/40 backdrop-blur-xl p-2 rounded-2xl border border-zinc-700 shadow-lg transition-transform ${
          isChatActive ? "absolute bottom-10" : ""
        }`}
      >
        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {uploadedFiles.map((file, index) => (
              <FilePlaceholder
                key={index}
                file={file}
                index={index}
                onRemoveFile={handleRemoveFile}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100/80 p-2 rounded-md">
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload size={16} />
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="file-input"
              multiple
              accept=".pdf"
              onChange={(e) =>
                setUploadedFiles(() =>
                  e.target.files ? Array.from(e.target.files) : []
                )
              }
              hidden
            />
          </div>

          <Input
            type="text"
            placeholder="Ask questions about your PDF..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-slate-200 placeholder:text-zinc-500 border-none focus:ring-0 focus-visible:ring-0"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            variant="secondary"
            disabled={isPending || isAIResponding}
            className="dark:bg-zinc-900 hover:dark:bg-zinc-800 text-white rounded-xl px-4 py-2"
          >
            <Search className="w-4 h-4 mr-1" />
            Ask
          </Button>
        </div>
      </motion.div>

      {!isChatActive && (
        <p className="mt-6 text-sm text-zinc-500 text-center max-w-2xl">
          Try queries like{" "}
          <span className="text-slate-300">
            "What are the main advantages of attention mechanisms?"
          </span>{" "}
          or{" "}
          <span className="text-slate-300">
            "Explain the concept of embeddings in NLP"
          </span>
        </p>
      )}
    </div>
  );
};

export default Chat;

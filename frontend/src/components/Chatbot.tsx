import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatBoxProps {
  file: File;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function Chatbox({ file }: ChatBoxProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Processing your query" },
    ]);
    setQuery("");
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardContent className="p-4">
        <div className="h-[400px] overflow-y-auto flex flex-col gap-3 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 self-end"
                  : "bg-zinc-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={`Ask something about ${file.name}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}

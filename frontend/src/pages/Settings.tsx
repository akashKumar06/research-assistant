import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [modelName, setModelName] = useState("gpt-4");
  const [chunkSize, setChunkSize] = useState("500");
  const [topK, setTopK] = useState("5");
  //   const { toast } = useToast();

  const handleSave = () => {
    // toast({
    //   title: "Settings saved",
    //   description: "Your preferences have been updated",
    // });
    console.log("will be built");
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure your RAG chatbot</p>
      </section>

      {/* API Configuration */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">API Configuration</h2>
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Backend API URL
            </label>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-2">
              The URL where your FastAPI backend is running
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              LLM Model
            </label>
            <Select value={modelName} onValueChange={setModelName}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
                <SelectItem value="llama-2">Llama 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </section>

      {/* RAG Configuration */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">RAG Configuration</h2>
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Chunk Size
            </label>
            <Input
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(e.target.value)}
              placeholder="500"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-2">
              Number of characters per chunk for vectorization
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Top K Results
            </label>
            <Input
              type="number"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              placeholder="5"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-2">
              Number of relevant chunks to retrieve for each query
            </p>
          </div>
        </Card>
      </section>

      {/* Database Configuration */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">
          Database Configuration
        </h2>
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Vector Database
            </label>
            <Input
              value="ChromaDB"
              disabled
              className="bg-slate-700 border-slate-600 text-slate-400"
            />
            <p className="text-xs text-slate-400 mt-2">
              Currently using ChromaDB for vector storage
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Metadata Database
            </label>
            <Input
              value="PostgreSQL"
              disabled
              className="bg-slate-700 border-slate-600 text-slate-400"
            />
            <p className="text-xs text-slate-400 mt-2">
              Currently using PostgreSQL for metadata storage
            </p>
          </div>
        </Card>
      </section>

      {/* Actions */}
      <section className="flex gap-4">
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>
        <Button variant="outline">Reset to Defaults</Button>
      </section>

      {/* Info Section */}
      <section>
        <Card className="p-6 bg-slate-800 border-slate-700 space-y-4">
          <h3 className="text-lg font-semibold text-white">About</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              <strong className="text-slate-300">Version:</strong> 1.0.0
            </p>
            <p>
              <strong className="text-slate-300">Last Updated:</strong> November
              3, 2025
            </p>
            <p>
              <strong className="text-slate-300">Backend:</strong> FastAPI with
              LangChain
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Settings;

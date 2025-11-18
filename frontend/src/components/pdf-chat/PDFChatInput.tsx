import { CheckCircle, FileText, Loader, Send, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePdfUpload } from "@/hooks/pdf/usePdfUpload";

const FilePlaceholder = ({
  file,
  index,
  onRemoveFile,
  setFile,
}: {
  file: File;
  index: number;
  onRemoveFile: (index: number) => void;
  setFile: (data) => void;
}) => {
  const { uploadFile, isPending, isSuccess } = usePdfUpload();

  useEffect(() => {
    uploadFile(file, {
      onSuccess: (data) => {
        setFile(data);
      },
    });
  }, [uploadFile, file, setFile]);

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

export default function PDFChatInput({ onSend }) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    if (uploadedFiles.length == 0) {
      alert("Please upload a file");
      return;
    }

    if (query.trim() === "") return;
    onSend(query, file.pdf_id);
    setQuery("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-0 right-0 mx-auto dark:bg-zinc-900/50 dark:border-zinc-700 w-full max-w-2xl flex flex-col gap-2 bg-zinc-800/40 backdrop-blur-xl p-2 rounded-2xl border border-zinc-700 shadow-lg"
    >
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {uploadedFiles.map((file, index) => (
            <FilePlaceholder
              key={index}
              file={file}
              index={index}
              onRemoveFile={handleRemoveFile}
              setFile={setFile}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md">
          <label className="cursor-pointer p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition">
            <Upload size={18} />
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
          </label>
        </div>

        <Input
          placeholder="Ask about your PDF..."
          className="flex-1 bg-transparent border-none focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button size="icon" className="rounded-xl" onClick={handleSearch}>
          <Send size={18} />
        </Button>
      </div>
    </motion.div>
  );
}

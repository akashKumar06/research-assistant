import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePdfUpload } from "@/hooks/pdf/usePdfUpload";
import { getErrorMessage } from "@/lib/utils";

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // matches the backend's Cloudinary limit

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
  const { uploadFile, isPending, isSuccess, isError, error } = usePdfUpload();

  useEffect(() => {
    uploadFile(file, {
      onSuccess: (data) => {
        setFile(data);
      },
      onError: (err) => {
        toast.error(getErrorMessage(err, "Failed to upload PDF"));
      },
    });
  }, [uploadFile, file, setFile]);

  return (
    <div
      key={index}
      className={`flex flex-col gap-1 p-2 pl-3 rounded-xl border ${
        isError
          ? "bg-destructive/5 border-destructive/30"
          : "bg-secondary border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText
            size={16}
            className={`shrink-0 ${
              isError ? "text-destructive" : "text-indigo-500"
            }`}
          />
          <span className="text-sm text-secondary-foreground truncate max-w-52">
            {file.name}
          </span>
        </div>
        <button
          onClick={() => onRemoveFile(index)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
        >
          {isPending && <Loader2 className="animate-spin" size={15} />}
          {isSuccess && <CheckCircle2 size={15} className="text-emerald-500" />}
          {isError && <AlertCircle size={15} className="text-destructive" />}
          {!isPending && !isSuccess && !isError && <X size={15} />}
        </button>
      </div>
      {isError && (
        <p className="text-xs text-destructive pl-6">
          {getErrorMessage(error, "Upload failed. Remove the file and try again.")}
        </p>
      )}
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
    setFile(null);
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : [];

    const accepted: File[] = [];
    for (const f of files) {
      if (f.size > MAX_PDF_SIZE_BYTES) {
        toast.error(
          `${f.name} is ${(f.size / (1024 * 1024)).toFixed(1)}MB — the upload limit is ${
            MAX_PDF_SIZE_BYTES / (1024 * 1024)
          }MB.`
        );
        continue;
      }
      accepted.push(f);
    }

    setFile(null);
    setUploadedFiles(accepted);
  };

  const handleSearch = () => {
    if (uploadedFiles.length == 0) {
      toast.error("Please upload a file first");
      return;
    }

    if (!file) {
      toast.error("Please wait for the upload to finish");
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
      className="absolute bottom-6 left-0 right-0 px-4 mx-auto w-full max-w-2xl flex flex-col gap-2"
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

      <div
        className="
          flex items-center gap-2 p-2 pl-3
          glass-panel rounded-2xl
          shadow-xl shadow-black/5 dark:shadow-black/30
          focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/40
          transition-all
        "
      >
        <label className="cursor-pointer p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0">
          <Paperclip size={18} />
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            multiple
            accept=".pdf"
            onChange={(e) => handleFilesSelected(e.target.files)}
            hidden
          />
        </label>

        <Input
          placeholder="Ask about your PDF..."
          className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="shrink-0 p-2.5 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  );
}

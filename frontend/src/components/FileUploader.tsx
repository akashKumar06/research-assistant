import { Card, CardContent } from "@/components/ui/card";
import { useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";

interface FileUploaderProps {
  onUpload: (file: File) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      onUpload(selected);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="w-full border border-dashed border-zinc-600 p-6 text-center rounded-lg cursor-pointer hover:bg-zinc-800 transition"
        >
          {file ? (
            <span className="text-green-400">{file.name}</span>
          ) : (
            <span className="text-zinc-400">Click or drag PDF to upload</span>
          )}
        </label>
        {file && <Button variant="outline">Upload Complete</Button>}
      </CardContent>
    </Card>
  );
}

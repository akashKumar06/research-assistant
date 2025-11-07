import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useUploadFile() {
  const {
    mutate: uploadFile,
    isPending,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: async (file: FormData) => {
      console.log("📤 Uploading file...");
      
      const response = await axios.post(
        "http://localhost:8000/api/chat/upload",
        file,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("✅ Upload response:", response.data);
      
      // Store session_id in localStorage
      if (response.data.session_id) {
        localStorage.setItem("pdf_session_id", response.data.session_id);
        console.log("💾 Stored session ID:", response.data.session_id);
        
        // Verify it was stored
        const storedId = localStorage.getItem("pdf_session_id");
        console.log("✔️ Verified stored ID:", storedId);
      } else {
        console.error("❌ No session_id in response!");
      }
      
      return response.data;
    },
  });
  
  return { uploadFile, isPending, isSuccess, sessionData: data };
}

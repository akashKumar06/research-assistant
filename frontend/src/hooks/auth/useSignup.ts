import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export default function useSignup() {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const res = await api.post("/auth/signup", payload);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(`Account created for ${data.name}. Please login.`);
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.detail ||
        "Signup failed. Please try a different email.";

      toast.error(message);
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveAuthData } from "@/utils/auth";
import api from "@/api/axios";

interface LoginPayload {
  email: string;
  password: string;
}

export default function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post("/users/login", payload);
      return res.data;
    },

    onSuccess: (data) => {
      saveAuthData(data.access_token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Invalid credentials");
    },
  });
}

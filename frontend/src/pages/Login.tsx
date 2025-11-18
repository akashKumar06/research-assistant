import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import useLogin from "../hooks/auth/useLogin";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    login.mutate(form, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center px-6 
                    bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900"
    >
      <ThemeToggle />

      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] 
                      bg-blue-600/10 dark:bg-blue-500/20 rounded-full blur-[140px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.3 }}
        className="absolute top-[25%] right-[12%] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.15 }}
        className="absolute top-[65%] left-[10%] w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl
                   bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl
                   border border-zinc-300 dark:border-zinc-800 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-6">
          Welcome Back
        </h2>

        {/* Email Input */}
        <Input
          placeholder="Email"
          type="email"
          className="mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password Input */}
        <Input
          placeholder="Password"
          type="password"
          className="mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Submit Button */}
        <Button
          className="w-full py-5 rounded-xl text-lg shadow-lg shadow-blue-500/20"
          onClick={handleSubmit}
          disabled={login.isPending}
        >
          {login.isPending ? "Logging in..." : "Login"}
        </Button>

        {/* Signup Redirect */}
        <p className="text-center text-zinc-600 dark:text-zinc-400 mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

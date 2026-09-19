import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import useLogin from "../hooks/auth/useLogin";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { Mail, Lock } from "lucide-react";

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
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.3 }}
        className="absolute top-[25%] right-[12%] w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.15 }}
        className="absolute top-[65%] left-[10%] w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl font-bold text-center text-foreground mb-1">
          Welcome back
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Log in to continue your research
        </p>

        {/* Email Input */}
        <div className="relative mb-4">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Email"
            type="email"
            className="pl-9 h-11"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Password"
            type="password"
            className="pl-9 h-11"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-11 rounded-xl text-base bg-linear-to-r from-indigo-500 to-violet-500 hover:brightness-110 shadow-lg shadow-indigo-500/25"
          onClick={handleSubmit}
          disabled={login.isPending}
        >
          {login.isPending ? "Logging in..." : "Login"}
        </Button>

        {/* Signup Redirect */}
        <p className="text-center text-muted-foreground mt-5 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 hover:text-indigo-400 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

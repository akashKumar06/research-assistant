import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import useSignup from "@/hooks/auth/useSignup";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const signup = useSignup();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = () => {
    signup.mutate(form, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background glows */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-fuchsia-500/15 dark:bg-fuchsia-500/20 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-[15%] left-[10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl font-bold text-center mb-1 text-foreground">
          Create your account
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Start building your research space
        </p>

        {/* Name */}
        <div className="relative mb-4">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Full Name"
            className="pl-9 h-11"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="email"
            placeholder="Email"
            className="pl-9 h-11"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="password"
            placeholder="Password"
            className="pl-9 h-11"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {/* Signup Button */}
        <Button
          onClick={submit}
          disabled={signup.isPending}
          className="w-full h-11 rounded-xl text-base bg-linear-to-r from-indigo-500 to-violet-500 hover:brightness-110 shadow-lg shadow-indigo-500/25"
        >
          {signup.isPending ? "Creating account..." : "Sign up"}
        </Button>

        {/* Divider */}
        <div className="text-center mt-5">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 hover:text-indigo-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

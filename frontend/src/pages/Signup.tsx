import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import useSignup from "@/hooks/auth/useSignup";
import ThemeToggle from "@/components/ThemeToggle";

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
    <div
      className="relative min-h-screen flex items-center justify-center px-6 
                    bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900"
    >
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Background glows */}
      <div
        className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] 
                      bg-purple-600/10 dark:bg-purple-500/20 rounded-full blur-[160px]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-[15%] left-[10%] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl 
                   border border-zinc-300/40 dark:border-zinc-700/60 
                   bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-zinc-900 dark:text-white">
          Create Your Account
        </h2>

        {/* Name */}
        <Input
          type="text"
          placeholder="Full Name"
          className="mb-4"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <Input
          type="email"
          placeholder="Email"
          className="mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <Input
          type="password"
          placeholder="Password"
          className="mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Signup Button */}
        <Button
          onClick={submit}
          disabled={signup.isPending}
          className="w-full py-5 rounded-xl text-lg shadow-md shadow-purple-500/10"
        >
          {signup.isPending ? "Creating account..." : "Signup"}
        </Button>

        {/* Divider */}
        <div className="text-center mt-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

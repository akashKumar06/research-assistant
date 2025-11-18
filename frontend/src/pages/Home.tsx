import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrainCircuit, Search, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <ThemeToggle />
      {/* Background Glow */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] 
                      bg-blue-600/10 dark:bg-blue-500/20 rounded-full blur-[180px] pointer-events-none"
      />

      {/* Floating Circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute top-[20%] right-[10%] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="absolute top-[60%] left-[5%] w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl"
      />

      {/* ========== HERO SECTION ========== */}
      <div className="relative z-10 flex flex-col items-center text-center mt-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white leading-tight"
        >
          Your Personal
          <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {" "}
            Research Assistant
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl"
        >
          Search papers, explore new ideas, chat with research content, and get
          clear explanations — all in one simple space.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex gap-5 mt-10"
        >
          <Link to="/signup">
            <Button className="px-6 py-5 text-lg rounded-xl shadow-lg shadow-blue-500/20">
              Get Started
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="outline"
              className="px-6 py-5 text-lg rounded-xl border-zinc-600 dark:border-zinc-500
                         hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Login
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 mt-24 mb-16 px-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-center text-zinc-900 dark:text-white"
        >
          What You Can Do
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 border border-zinc-300 dark:border-zinc-700 rounded-xl 
                       bg-white/60 dark:bg-zinc-900/40 backdrop-blur-lg hover:shadow-xl 
                       hover:shadow-blue-500/20 transition"
          >
            <Search className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Discover Papers
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Search for the latest research across fields and get instant
              summaries.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 border border-zinc-300 dark:border-zinc-700 rounded-xl 
                       bg-white/60 dark:bg-zinc-900/40 backdrop-blur-lg hover:shadow-xl 
                       hover:shadow-purple-500/20 transition"
          >
            <BrainCircuit className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Chat With Ideas
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Ask questions, explore concepts, and get AI-powered explanations.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 border border-zinc-300 dark:border-zinc-700 rounded-xl 
                       bg-white/60 dark:bg-zinc-900/40 backdrop-blur-lg hover:shadow-xl 
                       hover:shadow-emerald-500/20 transition"
          >
            <Sparkles className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Learn Faster
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Turn complex research into simple explanations and insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} Research Assistant — Built for curious
        minds.
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrainCircuit, Search, Sparkles, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const features = [
  {
    icon: Search,
    title: "Discover Papers",
    desc: "Search for the latest research across fields and get instant summaries.",
    glow: "hover:shadow-indigo-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: BrainCircuit,
    title: "Chat With Ideas",
    desc: "Ask questions, explore concepts, and get AI-powered explanations.",
    glow: "hover:shadow-violet-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: Sparkles,
    title: "Learn Faster",
    desc: "Turn complex research into simple explanations and insights.",
    glow: "hover:shadow-fuchsia-500/20",
    iconColor: "text-fuchsia-500",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[180px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute top-[18%] right-[8%] w-56 h-56 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="absolute top-[55%] left-[4%] w-44 h-44 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" className="text-sm">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/70 text-xs font-medium text-muted-foreground mb-6"
        >
          <Sparkles size={13} className="text-indigo-500" />
          AI-powered research, reimagined
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold text-foreground leading-tight tracking-tight max-w-3xl"
        >
          Your Personal
          <span className="text-gradient-brand"> Research Assistant</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl"
        >
          Search papers, explore new ideas, chat with research content, and
          get clear explanations — all in one simple space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <Link to="/signup">
            <Button className="px-6 py-5 text-base rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 hover:brightness-110 shadow-lg shadow-indigo-500/25 group">
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="outline"
              className="px-6 py-5 text-base rounded-xl border-border hover:bg-accent"
            >
              Login
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 pb-20 px-6 max-w-5xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-foreground mb-12"
        >
          What You Can Do
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`p-6 rounded-2xl glass-panel hover:shadow-xl ${f.glow} hover:-translate-y-1 transition-all`}
            >
              <div className="inline-flex p-2.5 rounded-xl bg-background border border-border mb-4">
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Nexus Research Assistant — Built for
        curious minds.
      </div>
    </div>
  );
}

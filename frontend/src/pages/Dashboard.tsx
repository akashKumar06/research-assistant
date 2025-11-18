import { Link } from "react-router";
import { Search, MessageSquare, Database, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="relative p-10 space-y-10">
      {/* Floating Theme Toggle */}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-3xl p-10
          bg-linear-to-tr from-blue-500/10 to-purple-500/10
          dark:from-blue-700/10 dark:to-purple-700/10
          border border-zinc-200 dark:border-zinc-800
          backdrop-blur-xl shadow-xl
        "
      >
        <h2
          className="text-4xl font-extrabold mb-4 
                       text-zinc-900 dark:text-white"
        >
          Welcome back 👋
        </h2>

        <p
          className="text-lg max-w-xl 
                      text-zinc-600 dark:text-zinc-300 mb-6"
        >
          Discover papers, chat with ideas, and build your personal research
          space.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/search">
            <button
              className="
              px-6 py-3 rounded-xl 
              bg-zinc-900/10 dark:bg-white/10 
              hover:bg-zinc-900/20 dark:hover:bg-white/20
              transition shadow 
              border border-zinc-300/40 dark:border-white/20 
              flex gap-2 items-center 
              text-zinc-900 dark:text-white
            "
            >
              <Search size={18} /> Search Papers
            </button>
          </Link>

          <Link to="chat">
            <button
              className="
              px-6 py-3 rounded-xl 
              bg-zinc-900/10 dark:bg-white/10 
              hover:bg-zinc-900/20 dark:hover:bg-white/20
              transition shadow 
              border border-zinc-300/40 dark:border-white/20 
              flex gap-2 items-center 
              text-zinc-900 dark:text-white
            "
            >
              <MessageSquare size={18} /> Start Chat
            </button>
          </Link>

          <Link to="/knowledge-base">
            <button
              className="
              px-6 py-3 rounded-xl 
              bg-zinc-900/10 dark:bg-white/10 
              hover:bg-zinc-900/20 dark:hover:bg-white/20
              transition shadow 
              border border-zinc-300/40 dark:border-white/20 
              flex gap-2 items-center 
              text-zinc-900 dark:text-white
            "
            >
              <Database size={18} /> Knowledge Base
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Search for Papers",
            icon: <Search />,
            desc: "Find papers by keywords, topics, or authors.",
            link: "/search",
          },
          {
            title: "Chat with Papers",
            icon: <MessageSquare />,
            desc: "Ask questions and get contextual insights.",
            link: "/chat-pdf",
          },
          {
            title: "Your Knowledge Base",
            icon: <Database />,
            desc: "Save papers and build your research library.",
            link: "/knowledge-base",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className="
                cursor-pointer
                hover:shadow-xl hover:shadow-cyan-500/10
                transition
                bg-white/40 dark:bg-zinc-900/40
                backdrop-blur-md
                border border-zinc-300/40 dark:border-zinc-800
              "
            >
              <CardHeader>
                <CardTitle
                  className="
                    flex items-center gap-3 text-lg font-semibold
                    text-zinc-900 dark:text-white
                  "
                >
                  {item.icon} {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-zinc-700 dark:text-zinc-300">
                <p>{item.desc}</p>
                <Link
                  to={item.link}
                  className="flex items-center gap-1 mt-4 
                             text-cyan-600 dark:text-cyan-400"
                >
                  Explore <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { Search, MessageSquare, Database, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { getUser } from "@/utils/auth";

const quickActions = [
  {
    title: "Search for Papers",
    icon: Search,
    desc: "Find papers by keywords, topics, or authors.",
    link: "/search",
    color: "from-indigo-500/15 to-indigo-500/5",
    iconColor: "text-indigo-500",
  },
  {
    title: "Chat with Papers",
    icon: MessageSquare,
    desc: "Ask questions and get contextual insights.",
    link: "/chat-pdf",
    color: "from-violet-500/15 to-violet-500/5",
    iconColor: "text-violet-500",
  },
  {
    title: "Your Knowledge Base",
    icon: Database,
    desc: "Save papers and build your research library.",
    link: "/knowledge-base",
    color: "from-fuchsia-500/15 to-fuchsia-500/5",
    iconColor: "text-fuchsia-500",
  },
];

export default function Dashboard() {
  const user = getUser();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px] dark:bg-fuchsia-500/10" />

      <Header />

      <div className="relative z-10 p-6 sm:p-10 space-y-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-3xl p-8 sm:p-10
            bg-linear-to-tr from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10
            border border-border
            backdrop-blur-xl shadow-xl
          "
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </h2>

          <p className="text-lg max-w-xl text-muted-foreground mb-7">
            Discover papers, chat with ideas, and build your personal
            research space.
          </p>

          <Link to="/chat">
            <button
              className="
              px-5 py-2.5 rounded-xl
              bg-linear-to-r from-indigo-500 to-violet-500
              hover:brightness-110
              transition shadow-md shadow-indigo-500/25
              flex gap-2 items-center w-fit
              text-white text-sm font-medium
            "
            >
              <MessageSquare size={16} /> Start Chatting
            </button>
          </Link>
        </motion.div>

        {/* Quick Actions — pick where you want to go */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Jump back in
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={item.link}>
                <Card
                  className={`
                  cursor-pointer h-full
                  hover:shadow-xl hover:-translate-y-1
                  transition-all
                  bg-linear-to-b ${item.color}
                  glass-panel
                `}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                      <div className="p-2 rounded-lg bg-background border border-border">
                        <item.icon size={18} className={item.iconColor} />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-muted-foreground">
                    <p>{item.desc}</p>
                    <div className="flex items-center gap-1 mt-4 text-indigo-500 dark:text-indigo-400 text-sm font-medium">
                      Explore <ArrowRight size={16} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

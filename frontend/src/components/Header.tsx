import { NavLink } from "react-router";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const navItems = [
    { label: "General Chat", path: "/chat" },
    { label: "PDF Chat", path: "/chat-pdf" },
    { label: "Knowledge Base", path: "/knowledge-base" },
  ];

  return (
    <header
      className="
      flex justify-between items-center px-6 py-4
      bg-white/40 dark:bg-zinc-900/40
      backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800
      shadow-sm
    "
    >
      {/* Left - Nav Switcher */}
      <nav className="flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 dark:bg-blue-500/10 shadow"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40"
              }
              `
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right - Theme + User */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Avatar className="border border-zinc-300 dark:border-zinc-700 shadow">
          <AvatarFallback className="bg-zinc-700 text-white">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

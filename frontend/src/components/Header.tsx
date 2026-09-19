import { Link, NavLink } from "react-router";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { getUser } from "@/utils/auth";
import { MessageCircle, FileStack, Library } from "lucide-react";

export default function Header() {
  const navItems = [
    { label: "General Chat", path: "/chat", icon: MessageCircle },
    { label: "PDF Chat", path: "/chat-pdf", icon: FileStack },
    { label: "Knowledge Base", path: "/knowledge-base", icon: Library },
  ];

  const user = getUser();
  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-6 py-3.5 glass-panel border-x-0 border-t-0">
      {/* Left - Brand */}
      <Link to="/dashboard" className="shrink-0">
        <Logo />
      </Link>

      {/* Center - Nav Switcher */}
      <nav className="flex items-center gap-1 rounded-full border border-border bg-muted/60 p-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`
            }
          >
            <item.icon size={15} />
            <span className="hidden sm:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right - Theme + User */}
      <div className="flex items-center gap-3 shrink-0">
        <ThemeToggle />

        <Avatar className="border-2 border-background ring-1 ring-border shadow-sm">
          <AvatarFallback className="bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold text-sm">
            {initial}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

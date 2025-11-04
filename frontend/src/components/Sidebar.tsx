import { Link, useLocation } from "react-router";
import {
  Home,
  Search,
  MessageSquare,
  BookOpen,
  Settings,
  Brain,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/search", icon: Search, label: "Search Papers" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/knowledge-base", icon: BookOpen, label: "Knowledge Base" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col h-screen border-r border-zinc-800">
      <div className="p-5 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <Brain />
          Research AI
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-cyan-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

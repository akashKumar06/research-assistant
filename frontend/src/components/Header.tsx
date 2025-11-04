import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const pathMap = new Map([
  ["dashboard", "Dashboard"],
  ["search", "Search"],
  ["chat", "Chat"],
  ["knowledge-base", "Knowledge Base"],
  ["settings", "Settings"],
]);
function Header() {
  const location = useLocation();
  const [heading, setHeading] = useState("Dashboard");
  useEffect(() => {
    let pathName = location.pathname.split("/")[1];
    if (pathName == "") pathName = "dashboard";
    setHeading(() => pathMap.get(pathName) || "Dashboard");
  }, [location]);
  return (
    <header className="bg-stone-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-4 py-5 flex justify-between items-center">
      <h1 className="text-xl font-bold dark:text-stone-200/80 text-zinc-900">
        {heading}
      </h1>
      {/* <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button> */}
    </header>
  );
}

export default Header;

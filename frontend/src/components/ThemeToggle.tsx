import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/theme/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="absolute top-6 right-6 
                 bg-white/40 dark:bg-zinc-900/40 
                 backdrop-blur-md border border-zinc-300 dark:border-zinc-800
                 hover:scale-110 transition-all shadow-sm z-50"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-zinc-700" />
      )}
    </Button>
  );
}

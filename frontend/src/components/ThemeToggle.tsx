import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/theme/useTheme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "rounded-full border border-border bg-white/60 dark:bg-white/5 backdrop-blur-md hover:scale-105 hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.1rem] w-[1.1rem] text-amber-400" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] text-indigo-600" />
      )}
    </Button>
  );
}

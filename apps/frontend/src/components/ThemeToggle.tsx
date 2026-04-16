import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/10 bg-surface-high text-on-surface-variant transition-all hover:text-white hover:bg-surface-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";

type ThemeMode = "light" | "dark";

type ThemeControllerProps = {
  children: ReactNode;
};

const STORAGE_KEY = "unilearn-theme";

export default function ThemeController({ children }: ThemeControllerProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className={isDark ? "theme-dark dark min-h-screen" : "theme-light min-h-screen"}>
      <ThemeToggle isDark={isDark} onToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />
      {children}
    </div>
  );
}

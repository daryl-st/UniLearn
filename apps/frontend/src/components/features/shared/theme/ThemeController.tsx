import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/stores/themeStore";

type ThemeControllerProps = {
  children: ReactNode;
};

export function useThemeController() {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { isDark, toggleTheme };
}

export default function ThemeController({ children }: ThemeControllerProps) {
  const mode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    setTheme(mode);
  }, [mode, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("theme-dark", mode === "dark");
    root.classList.toggle("theme-light", mode === "light");
  }, [mode]);

  return <div className="min-h-screen">{children}</div>;
}

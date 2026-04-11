import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "light" | "dark";

type ThemeControllerProps = {
  children: ReactNode;
};

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const STORAGE_KEY = "unilearn-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeController() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useThemeController must be used within ThemeController");
  }
  return value;
}

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
  const themeContextValue = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className={isDark ? "theme-dark dark min-h-screen" : "theme-light min-h-screen"}>{children}</div>
    </ThemeContext.Provider>
  );
}

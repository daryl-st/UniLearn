export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

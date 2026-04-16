import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'unilearn-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark', 'dark');

  if (theme === 'dark') {
    root.classList.add('theme-dark', 'dark');
  } else {
    root.classList.add('theme-light');
  }
}

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, theme);
      }

      applyTheme(theme);
      set({ theme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      get().setTheme(nextTheme);
    },
  };
});
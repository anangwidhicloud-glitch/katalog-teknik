'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type SiteTheme = 'dark' | 'light';

type ThemeContextValue = {
  theme: SiteTheme;
  toggleTheme: () => void;
  setTheme: (theme: SiteTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'mp-site-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as SiteTheme | null;
    const preferred: SiteTheme = window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
    const nextTheme = saved === 'dark' || saved === 'light' ? saved : preferred;

    document.documentElement.dataset.siteTheme = nextTheme;
    const frame = window.requestAnimationFrame(() => setThemeState(nextTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const setTheme = (nextTheme: SiteTheme) => {
    document.documentElement.dataset.siteTheme = nextTheme;
    const frame = window.requestAnimationFrame(() => setThemeState(nextTheme));
    return () => window.cancelAnimationFrame(frame);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="site-shell">{children}</div>
    </ThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useSiteTheme harus digunakan di dalam ThemeProvider.');
  }

  return context;
}

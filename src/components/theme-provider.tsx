import React, { useEffect, useState } from 'react';
import { ThemeProviderContext, type Theme } from './theme-context';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme',
}: ThemeProviderProps) {
  // Null until mounted: the prerendered HTML can't know the saved theme, so the first
  // browser render must match it. The inline script in index.html paints the right
  // colours before then.
  const [storedTheme, setTheme] = useState<Theme | null>(null);
  const theme = storedTheme ?? defaultTheme;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    setTheme((localStorage.getItem(storageKey) as Theme) || defaultTheme);
  }, [storageKey, defaultTheme]);

  useEffect(() => {
    if (storedTheme === null) return;
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (systemIsDark: boolean) => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        root.classList.add(systemIsDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };

    // Apply the theme immediately
    applyTheme(mediaQuery.matches);

    // Only listen for system changes if the theme is set to 'system'
    if (theme !== 'system') return;

    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, storedTheme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

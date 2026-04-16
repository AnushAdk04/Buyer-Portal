import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (nextTheme) => {
    if (nextTheme !== 'dark' && nextTheme !== 'light') {
      return;
    }
    setTheme(nextTheme);
  };

  const setDarkMode = (enabled) => {
    setTheme(enabled ? 'dark' : 'light');
  };

  const value = useMemo(() => ({ theme, toggleTheme, setThemeMode, setDarkMode }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};
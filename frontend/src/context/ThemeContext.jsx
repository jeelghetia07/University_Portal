import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "themePreference";
const ROLE_STORAGE_KEY = "userRole";
const VALID_THEMES = new Set(["light", "dark", "auto"]);

const resolveSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return VALID_THEMES.has(stored) ? stored : "light";
  });
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_STORAGE_KEY) || "student");

  const applyTheme = (themeMode) => {
    const root = document.documentElement;
    const activeTheme = themeMode === "auto" ? resolveSystemTheme() : themeMode;
    root.classList.remove("dark");
    if (activeTheme === "dark") {
      root.classList.add("dark");
    }
    root.style.colorScheme = activeTheme;
  };

  useEffect(() => {
    applyTheme(theme);
    const root = document.documentElement;
    root.setAttribute("data-role", role);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [theme, role]);

  useEffect(() => {
    if (theme !== "auto") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("auto");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      role,
      setRole,
      activeTheme: theme === "auto" ? resolveSystemTheme() : theme,
    }),
    [theme, role],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

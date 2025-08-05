// src/components/ui/theme-provider.jsx
import { useEffect } from "react";

export const ThemeProvider = ({
  children,
  defaultTheme = "light",
  storageKey = "theme",
}) => {
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) || defaultTheme;
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  return <>{children}</>;
};

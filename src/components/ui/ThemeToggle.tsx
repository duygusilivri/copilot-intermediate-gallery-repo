"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="btn-icon rounded-md p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      )}
    </button>
  );
}

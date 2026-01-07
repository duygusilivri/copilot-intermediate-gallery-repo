'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { effectiveTheme, setTheme, mounted } = useTheme();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle between light and dark (simplified for better UX)
  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  const transitionClass = isReducedMotion ? '' : 'transition-all duration-300';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${transitionClass}`}
      aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {effectiveTheme === 'dark' ? (
        <Sun className={`h-5 w-5 text-yellow-500 ${transitionClass}`} />
      ) : (
        <Moon className={`h-5 w-5 text-slate-700 ${transitionClass}`} />
      )}
    </button>
  );
}

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Toggle between light and dark, always setting explicit preference
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 rounded-lg 
                 text-slate-700 dark:text-slate-300 
                 hover:bg-slate-100 dark:hover:bg-slate-800 
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 dark:focus:ring-offset-slate-900"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-200 rotate-0" />
      )}
    </button>
  );
}

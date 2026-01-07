'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This runs on mount to initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const effectiveTheme = savedTheme === 'system' ? getSystemTheme() : savedTheme;
    const root = document.documentElement;

    root.setAttribute('data-theme', effectiveTheme);
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}

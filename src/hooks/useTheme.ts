'use client';

import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Get effective theme (resolves 'system' to actual theme)
  const getEffectiveTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const effectiveTheme = getEffectiveTheme(newTheme);
    const root = document.documentElement;

    // Set data-theme attribute for manual control
    root.setAttribute('data-theme', effectiveTheme);

    // Also set class for compatibility
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [getEffectiveTheme]);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // Update theme
  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [applyTheme]);

  return {
    theme,
    effectiveTheme: mounted ? getEffectiveTheme(theme) : 'light',
    setTheme: updateTheme,
    mounted,
  };
}

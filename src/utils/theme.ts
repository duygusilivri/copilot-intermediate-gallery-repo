/**
 * Shared theme utility functions to ensure consistent theme handling
 * across the application (blocking script, ThemeProvider, and useTheme hook)
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Gets the system's preferred color scheme
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolves a theme value to an actual theme ('light' or 'dark')
 * by converting 'system' to the actual system preference
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Returns the theme initialization script to prevent FOUC
 * This should be injected as an inline blocking script in the document head
 */
export function getThemeScript(): string {
  return `
    (function() {
      try {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const effectiveTheme = savedTheme === 'system' ? systemTheme : savedTheme;
        const root = document.documentElement;
        root.setAttribute('data-theme', effectiveTheme);
        if (effectiveTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;
}

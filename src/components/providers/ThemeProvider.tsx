'use client';

/**
 * ThemeProvider component that wraps the application.
 * The actual theme initialization is handled by:
 * 1. Blocking script in layout.tsx (prevents FOUC)
 * 2. useTheme hook (for runtime theme management)
 * 
 * This component exists primarily as a client-side wrapper
 * for any future theme-related context or functionality.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

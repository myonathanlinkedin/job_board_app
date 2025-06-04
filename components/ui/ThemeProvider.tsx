'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create context with a safe default value that won't error during SSR
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Debug function to log theme changes
const logThemeChange = (message: string, theme: string) => {
  if (typeof window !== 'undefined') {
    console.log(`Theme Debug: ${message}`, theme);
  }
};

// Utility function to apply theme to document
const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  
  // Remove both theme classes first
  document.documentElement.classList.remove('light', 'dark');
  // Add the new theme class
  document.documentElement.classList.add(theme);
  // Update color-scheme property
  document.documentElement.style.colorScheme = theme;
  // Store in localStorage
  localStorage.setItem('theme', theme);
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  
  // Only access localStorage after component has mounted on client
  useEffect(() => {
    setMounted(true);
    
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (defaultTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [defaultTheme, storageKey]);
  
  // SSR safety: No theme changes during server rendering
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (!mounted) return;
      
      try {
        localStorage.setItem(storageKey, newTheme);
        
        // Apply theme directly to avoid flicker
        if (newTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(systemTheme);
        } else {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(newTheme);
        }
        
        setTheme(newTheme);
      } catch (error) {
        console.error('Error setting theme:', error);
      }
    },
  };

  // Apply theme directly to avoid flicker (only after mounting)
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const root = document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      
      // Determine actual theme (resolve system preference if needed)
      const resolvedTheme = 
        theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : theme;
      
      // Apply theme class
      document.documentElement.classList.add(resolvedTheme);
      
      // Emit custom event for other components that might need to know theme has changed
      document.dispatchEvent(new CustomEvent('themechange', { detail: resolvedTheme }));
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme, mounted]);
  
  // During SSR and initial client render, render null to avoid hydration issues
  // Only render children once mounted on client
  if (!mounted) {
    // Return a simple non-interactive version for SSR
    return <>{children}</>;
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Safe version of useTheme that includes error handling
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider');
    // Return the default value to avoid crashing in SSR
    return initialState;
  }
  
  return context;
}

// Utility function for applying theme manually outside React
// Useful for modifying theme in vanilla JS or outside React components
export function applyThemeManually(theme: Theme) {
  try {
    if (typeof window === 'undefined') return;
    
    // Store to localStorage
    localStorage.setItem('ui-theme', theme);
    
    // Apply class to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Notify listeners
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    
    return true;
  } catch (error) {
    console.error('Failed to manually apply theme:', error);
    return false;
  }
} 
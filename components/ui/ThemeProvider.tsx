'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Only run client-side
    if (typeof window === 'undefined') return;
    
    try {
      logThemeChange('Initializing theme provider', 'start');
      
      // Check if user has a theme preference in local storage
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        logThemeChange('Using stored theme', storedTheme);
        setTheme(storedTheme);
        applyThemeToDocument(storedTheme);
      } else {
        // Check user's system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        logThemeChange('Using system preference', systemTheme);
        setTheme(systemTheme);
        applyThemeToDocument(systemTheme);
      }
      
      setMounted(true);
      
      // Handle system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update based on system preference if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          logThemeChange('System preference changed', newTheme);
          setTheme(newTheme);
          applyThemeToDocument(newTheme);
        }
      };

      // Use modern event listener API with fallback
      try {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      } catch (err) {
        // Fallback for older browsers
        mediaQuery.addListener(handleSystemThemeChange);
      }

      return () => {
        try {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } catch (err) {
          // Fallback for older browsers
          mediaQuery.removeListener(handleSystemThemeChange);
        }
      };
    } catch (error) {
      console.error('Error in theme initialization:', error);
      // If there's an error, ensure we have a usable state
      setTheme('light');
      applyThemeToDocument('light');
      setMounted(true);
    }
  }, []);

  // Ensure theme is synchronized with document
  useEffect(() => {
    if (!mounted) return;
    logThemeChange('Applying theme from state change', theme);
    applyThemeToDocument(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      logThemeChange('Toggling theme to', newTheme);
      
      // Update state (effect will apply theme to document)
      setTheme(newTheme);
      
      // Directly apply theme as well for immediate feedback
      applyThemeToDocument(newTheme);
      
      // Log the current classes on document element
      console.log('Current document classes:', document.documentElement.className);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  // Provide a static version during SSR to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
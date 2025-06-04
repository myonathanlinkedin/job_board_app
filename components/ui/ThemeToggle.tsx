'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Icons } from './Icons';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>('light');
  const [isToggling, setIsToggling] = useState(false);
  
  // Safely access theme context
  const themeContext = (() => {
    try {
      return useTheme();
    } catch (e) {
      console.error('Theme context error:', e);
      return { 
        theme: localTheme, 
        toggleTheme: () => {
          console.log('Using fallback toggle');
          setLocalTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            // Apply theme changes directly to document when context fails
            if (typeof document !== 'undefined') {
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(newTheme);
              localStorage.setItem('theme', newTheme);
            }
            return newTheme;
          });
        }
      };
    }
  })();
  
  const { theme, toggleTheme } = themeContext;
  
  // Initialize from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detect current theme from document or localStorage
      const detectTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
          setLocalTheme('dark');
        } else if (document.documentElement.classList.contains('light')) {
          setLocalTheme('light');
        } else {
          const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
          if (stored) {
            setLocalTheme(stored);
          } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setLocalTheme(prefersDark ? 'dark' : 'light');
          }
        }
      };

      detectTheme();
      setMounted(true);
      
      // Add a listener to detect theme changes from other components
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class' && !isToggling) {
            detectTheme();
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, [isToggling]);

  // Sync localTheme with context theme
  useEffect(() => {
    if (mounted && theme) {
      setLocalTheme(theme);
    }
  }, [theme, mounted]);

  // Direct DOM manipulation as a fallback if React state is not updating correctly
  const forceThemeChange = (newTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    
    console.log('Force applying theme:', newTheme);
    
    // Remove both classes and add the new one
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Update localStorage directly
    localStorage.setItem('theme', newTheme);
    
    // Update local state
    setLocalTheme(newTheme);
  };

  const handleToggle = () => {
    try {
      setIsToggling(true);
      
      // Get current effective theme
      const currentTheme = localTheme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      console.log('ThemeToggle: Toggling theme from', currentTheme, 'to', newTheme);
      
      // Try both methods for maximum reliability
      toggleTheme(); // Context-based toggle
      forceThemeChange(newTheme); // Direct DOM manipulation
      
      // Set a timeout to prevent the mutation observer from responding immediately
      setTimeout(() => setIsToggling(false), 100);
    } catch (error) {
      console.error('Error in handleToggle:', error);
      
      // Fallback to direct DOM manipulation
      const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      forceThemeChange(newTheme);
      
      setIsToggling(false);
    }
  };

  // Determine the current visual theme regardless of state
  const effectiveTheme = mounted 
    ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    : localTheme;

  // Always render a button, but make it functional only after mounting
  return (
    <button
      onClick={mounted ? handleToggle : undefined}
      className={`relative p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${!mounted ? 'opacity-50' : ''}`}
      aria-label={mounted ? `Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode` : 'Loading theme'}
      disabled={!mounted || isToggling}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sun icon */}
      <Icons.Sun 
        className={`absolute w-5 h-5 text-orange-500 transition-opacity duration-300 ${effectiveTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Moon icon */}
      <Icons.Moon 
        className={`w-5 h-5 text-slate-700 dark:text-gray-200 transition-opacity duration-300 ${effectiveTheme === 'light' ? 'opacity-100' : 'opacity-0'}`} 
      />
    </button>
  );
} 
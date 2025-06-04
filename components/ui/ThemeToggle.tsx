'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Icons } from './Icons';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  function cycleTheme() {
    try {
      if (theme === 'dark') {
        setTheme('light');
      } else if (theme === 'light') {
        setTheme('system');
      } else {
        setTheme('dark');
      }
    } catch (err) {
      console.error('Failed to toggle theme:', err);
      setError('Theme toggle failed');
      
      // Direct DOM fallback if React context fails
      try {
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        html.classList.remove('dark', 'light');
        html.classList.add(currentTheme === 'dark' ? 'light' : 'dark');
      } catch (domError) {
        console.error('DOM fallback failed:', domError);
      }
    }
  }

  // During SSR, render a simplified version
  if (!mounted) {
    return (
      <button className="w-10 h-10 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
        <span className="sr-only">Toggle theme</span>
        <Icons.Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      </button>
    );
  }

  // Display the appropriate icon based on the current theme
  return (
    <button
      onClick={cycleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      title={`Change theme (current: ${theme})`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {error && <span className="text-red-500 text-xs absolute bottom-0 right-0">!</span>}
      
      {theme === 'dark' ? (
        <Icons.Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : theme === 'light' ? (
        <Icons.Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <div className="relative h-[1.2rem] w-[1.2rem]">
          <Icons.Moon className="absolute inset-0 h-full w-full opacity-50" />
          <Icons.Sun className="absolute inset-0 h-full w-full opacity-50" />
        </div>
      )}
    </button>
  );
} 
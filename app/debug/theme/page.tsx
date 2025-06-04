'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';
import Link from 'next/link';

export default function ThemeDebugPage() {
  const [documentClasses, setDocumentClasses] = useState('');
  const [localStorageTheme, setLocalStorageTheme] = useState<string | null>(null);
  const [systemPreference, setSystemPreference] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  let contextTheme: string | undefined;
  try {
    contextTheme = useTheme().theme;
  } catch (error) {
    console.error('Error accessing theme context:', error);
  }
  
  useEffect(() => {
    try {
      // Get document classes
      setDocumentClasses(document.documentElement.className);
      
      // Get localStorage theme
      setLocalStorageTheme(localStorage.getItem('theme'));
      
      // Get system preference
      setSystemPreference(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      );
      
      setMounted(true);
      
      // Set up a mutation observer to watch for class changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setDocumentClasses(document.documentElement.className);
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    } catch (err) {
      setError(`Error initializing debug: ${err}`);
    }
  }, []);
  
  function forceTheme(theme: 'light' | 'dark') {
    try {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem('theme', theme);
      setDocumentClasses(document.documentElement.className);
      setLocalStorageTheme(theme);
    } catch (err) {
      setError(`Error setting theme: ${err}`);
    }
  }
  
  function clearTheme() {
    try {
      document.documentElement.classList.remove('light', 'dark');
      localStorage.removeItem('theme');
      setDocumentClasses(document.documentElement.className);
      setLocalStorageTheme(null);
    } catch (err) {
      setError(`Error clearing theme: ${err}`);
    }
  }
  
  if (!mounted) {
    return <div className="p-8">Loading theme information...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Theme Debugging</h1>
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/30 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Current Theme State</h2>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <span className="font-medium">Document Classes:</span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{documentClasses || 'none'}</code>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <span className="font-medium">LocalStorage Theme:</span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{localStorageTheme || 'not set'}</code>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <span className="font-medium">Context Theme:</span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{contextTheme || 'not available'}</code>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <span className="font-medium">System Preference:</span>
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{systemPreference}</code>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <span className="font-medium">Effective Theme:</span>
            <code className={`px-2 py-1 rounded ${
              document.documentElement.classList.contains('dark') 
                ? 'bg-blue-900 text-white' 
                : 'bg-yellow-200 text-yellow-800'
            }`}>
              {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            </code>
          </div>
        </div>
      </div>
      
      <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Theme Controls</h2>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => forceTheme('light')}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded hover:bg-yellow-200"
          >
            Force Light Theme
          </button>
          
          <button 
            onClick={() => forceTheme('dark')}
            className="px-4 py-2 bg-blue-900 text-white border border-blue-800 rounded hover:bg-blue-800"
          >
            Force Dark Theme
          </button>
          
          <button 
            onClick={clearTheme}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Clear Theme Preference
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        <Link href="/" className="underline">Return to home page</Link>
      </div>
    </div>
  );
} 
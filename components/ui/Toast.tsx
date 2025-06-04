'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'success', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Configure colors based on type
  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  };

  const color = colors[type];
  
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs animate-fade-in">
      <div className={`${color.bg} ${color.border} border rounded-md p-4 flex items-start shadow-md`}>
        <div className={`${color.text} flex-shrink-0 mr-3`}>
          {color.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm ${color.text}`}>{message}</p>
        </div>
        <button 
          className={`ml-4 ${color.text} hover:opacity-70`}
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ToastContainer component to manage multiple toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{id: string, props: ToastProps}>>([]);

  // Use useEffect to ensure this only runs on the client side
  useEffect(() => {
    // Global method to add a toast - only defined in the browser
    window.showToast = (props: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prevToasts => [...prevToasts, { id, props }]);
    };
    
    // Clean up function to remove the global method when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore - Safe to delete the property
        delete window.showToast;
      }
    };
  }, []);

  return (
    <div>
      {toasts.map(({id, props}) => (
        <Toast
          key={id}
          {...props}
          onClose={() => {
            setToasts(toasts.filter(toast => toast.id !== id));
            if (props.onClose) props.onClose();
          }}
        />
      ))}
    </div>
  );
}

// Extend the Window interface to include our toast method
declare global {
  interface Window {
    showToast: (props: ToastProps) => void;
  }
} 
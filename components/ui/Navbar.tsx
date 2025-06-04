'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from './ThemeToggle';
import { Icons } from './Icons';
import * as auth from '@/lib/auth-client';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // User dropdown menu items when authenticated
  const userDropdownItems = user ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Change Password', href: '/auth/reset-password' },
    { label: 'Debug Auth', href: '/debug/auth-status' },
    { label: 'Sign out', onClick: handleSignOut }
  ] : [
    { label: 'Sign in', href: '/auth/login' },
    { label: 'Sign up', href: '/auth/signup' },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo.svg" width={32} height={32} alt="JB Logo" className="w-8 h-8" />
          <span className="self-center text-4xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text" style={{fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '-1px'}}>
            JobBoard
          </span>
        </Link>
        
        <div className="flex items-center md:order-2 space-x-3">
          {/* Theme toggle with error handling */}
          <div className="relative">
            {(() => {
              try {
                return <ThemeToggle />;
              } catch (error) {
                console.error('Error rendering ThemeToggle:', error);
                return (
                  <button
                    onClick={() => {
                      try {
                        // Direct DOM manipulation as fallback
                        const html = document.documentElement;
                        html.classList.toggle('dark');
                        html.classList.toggle('light');
                      } catch (e) {
                        console.error('Fallback theme toggle failed:', e);
                      }
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-md border"
                    aria-label="Toggle theme (fallback)"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                  </button>
                );
              }
            })()}
          </div>
          
          {loading ? (
            <div className="h-10 w-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : user ? (
            <div className="relative" id="user-dropdown">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded"
              >
                <Icons.User className="w-4 h-4 mr-2" />
                <span className="mr-1">{user.user_metadata?.full_name?.split(' ')[0] || 'Account'}</span>
                <Icons.ChevronDown className="w-4 h-4" />
              </button>
              
              {showUserDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userDropdownItems.map((item, index) => (
                    <Fragment key={index}>
                      {item.href ? (
                        <Link 
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setShowUserDropdown(false);
                            item.onClick?.();
                          }}
                        >
                          {item.label}
                        </button>
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link href="/auth/login" className="flex items-center text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded">
                <Icons.User className="w-4 h-4 mr-2" />
                Log In
              </Link>
              <Link href="/auth/signup" className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Sign Up
              </Link>
            </div>
          )}
          
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <Icons.Close className="w-5 h-5" />
            ) : (
              <Icons.Menu className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-menu">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link 
                href="/jobs" 
                className="flex items-center py-2 px-4 text-gray-900 rounded hover:bg-gray-100 hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-2 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-colors font-semibold"
              >
                <Icons.Search className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link 
                href="/employers" 
                className="flex items-center py-2 px-4 text-gray-900 rounded hover:bg-gray-100 hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-2 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-colors font-semibold"
              >
                <Icons.Briefcase className="w-4 h-4 mr-2" />
                For Employers
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 
// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  // Get initial theme from localStorage (default to light)
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    // (Optional) Log the current dark state to verify changes
    console.log('Dark mode state:', dark);

    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-blue-600 dark:bg-blue-900 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <div>
            <Link to="/" className="mr-4 hover:text-gray-200">Home</Link>
            <Link to="/about" className="hover:text-gray-200">About</Link>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1 px-3 rounded transition-colors duration-300"
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        {/* This Outlet renders the child routes */}
        <Outlet />

        {/* Debug element to see style changes */}
        <p className="mt-4 text-black dark:text-white">
          This text should change color when switching themes.
        </p>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-700 text-center py-4">
        <p>© 2025 Your Website</p>
      </footer>
    </div>
  );
}

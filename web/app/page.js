'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Gaza Aid
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400">
                About
              </Link>
              <Link href="/donate" className="hover:text-primary-600 dark:hover:text-primary-400">
                Donate
              </Link>
              <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Register
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Supporting Communities in Gaza
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            A humanitarian platform connecting those in need with those who can help.
            Register to create your profile, share your needs, or contribute to the cause.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700">
              Get Started
            </Link>
            <Link href="/about" className="px-8 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg text-lg font-semibold hover:bg-primary-50 dark:hover:bg-gray-800">
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your profile and connect with the community
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-4xl mb-4">💚</div>
            <h3 className="text-xl font-semibold mb-2">Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contribute to help those in need
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Impact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Make a real difference in people&apos;s lives
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Gaza Humanitarian Platform. Supporting communities in need.</p>
        </div>
      </footer>
    </div>
  );
}

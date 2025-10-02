'use client';

import Link from 'next/link';

export default function Donate() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Gaza Aid
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400">
                About
              </Link>
              <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support Our Cause</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your contribution helps us support communities in need
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <div className="text-6xl mb-6">💚</div>
          <h2 className="text-2xl font-semibold mb-4">Donation System Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're working on implementing a secure donation system. Check back soon!
          </p>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold">Planned Features:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Secure payment processing</li>
              <li>Multiple payment methods</li>
              <li>Transparent fund allocation</li>
              <li>Donation tracking and receipts</li>
              <li>Impact reporting</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🏥</div>
            <h3 className="font-semibold mb-2">Medical Aid</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Support healthcare and medical supplies
            </p>
          </div>
          <div className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🍞</div>
            <h3 className="font-semibold mb-2">Food & Water</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide essential food and clean water
            </p>
          </div>
          <div className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="font-semibold mb-2">Shelter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help rebuild and provide safe housing
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

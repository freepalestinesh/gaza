'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Gaza Aid
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/donate" className="hover:text-primary-600 dark:hover:text-primary-400">
                Donate
              </Link>
              <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">About Gaza Humanitarian Platform</h1>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Gaza Humanitarian Platform is dedicated to connecting communities in need with 
              those who can provide support. We believe in the power of technology to facilitate 
              humanitarian aid and create meaningful impact.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 Connect</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We provide a platform for individuals to create profiles, share their needs, 
                  and connect with potential supporters.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">💚 Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We facilitate donations and support mechanisms to ensure aid reaches those 
                  who need it most.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">📊 Transparency</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We maintain transparency in our operations and ensure accountability in 
                  aid distribution.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">🌍 Impact</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We measure and report the real-world impact of contributions to demonstrate 
                  the difference being made.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Platform</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Built with modern technology, our platform includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Secure user registration and authentication</li>
              <li>Profile management system</li>
              <li>Donation processing (coming soon)</li>
              <li>MCP agent integration for automated support</li>
              <li>Transparent tracking and reporting</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Whether you&apos;re looking for support or want to help others, we welcome you to 
              join our community.
            </p>
            <div className="flex space-x-4">
              <Link href="/register" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Register Now
              </Link>
              <Link href="/donate" className="px-6 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
                Learn About Donations
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-600 dark:text-gray-400">
              For questions or support, please reach out through our GitHub repository.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

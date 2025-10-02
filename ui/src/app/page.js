export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Gaza Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          Support Gaza through donations and community engagement
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="/auth/login" 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Login
          </a>
          <a 
            href="/auth/register" 
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}

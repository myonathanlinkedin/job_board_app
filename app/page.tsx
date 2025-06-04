export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Job Board App</h1>
      <p className="text-xl mb-8">Find your next opportunity</p>
      <div className="flex gap-4">
        <a href="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Browse Jobs
        </a>
        <a href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Post a Job
        </a>
      </div>
    </main>
  );
} 
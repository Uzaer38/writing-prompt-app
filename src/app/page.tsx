import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-pink-300">Writing Prompts</h1>
        <div className="space-y-4">
          <Link
            href="/prompts/new"
            className="block w-full bg-pink-500 text-white text-center px-4 py-2 rounded hover:bg-pink-600"
          >
            Create New Prompt
          </Link>
          <Link
            href="/prompts"
            className="block w-full bg-pink-400 text-white text-center px-4 py-2 rounded hover:bg-pink-500"
          >
            View All Prompts
          </Link>
        </div>
      </main>
    </div>
  );
}
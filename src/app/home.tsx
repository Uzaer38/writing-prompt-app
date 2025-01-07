import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Writing Prompts</h1>
      <div className="space-y-4">
        <Link
          href="/prompts/new"
          className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Prompt
        </Link>
        <Link
          href="/prompts"
          className="block w-full bg-gray-500 text-white text-center px-4 py-2 rounded hover:bg-gray-600"
        >
          View All Prompts
        </Link>
      </div>
    </main>
  );
}
import PromptList from '@/components/PromptList';
import Navbar from '@/components/Navbar';
import { getDb } from '@/app/lib/db';

export default async function PromptsPage() {
  const db = await getDb();
  const prompts = await db.all('SELECT * FROM prompts ORDER BY createdAt DESC');

  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-pink-300">All Prompts</h1>
        <PromptList prompts={prompts} />
      </main>
    </div>
  );
}
import PromptList from '@/components/PromptList';
import { getDb } from '@/app/lib/db';

export default async function PromptsPage() {
  const db = await getDb();
  const prompts = await db.all('SELECT * FROM prompts ORDER BY createdAt DESC');

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">All Prompts</h1>
      <PromptList prompts={prompts} />
    </main>
  );
}
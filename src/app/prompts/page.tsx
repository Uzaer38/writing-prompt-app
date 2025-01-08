// PromptsPage.tsx
import ClientPromptsPage from '@/components/ClientPromptsPage';
import { getDb } from '@/app/lib/db';

export default async function PromptsPage() {
  const db = await getDb();
  const prompts = await db.all('SELECT * FROM prompts ORDER BY createdAt DESC');

  return <ClientPromptsPage prompts={prompts} />;
}
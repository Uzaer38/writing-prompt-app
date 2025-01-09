import { NextResponse } from 'next/server';
import { getDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await getDb();
  const prompt = await db.get('SELECT * FROM prompts WHERE id = ?', id);

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }
  return NextResponse.json(prompt);
}
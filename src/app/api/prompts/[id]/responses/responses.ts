import { NextResponse } from 'next/server';
import { getDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await getDb();
  const responses = await db.all(
    'SELECT * FROM responses WHERE promptId = ? ORDER BY createdAt DESC',
    id
  );
  return NextResponse.json(responses);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await getDb();
  const body = await request.json();
  const response = {
    id: Date.now().toString(),
    promptId: id,
    content: body.content,
    createdAt: new Date().toISOString()
  };

  await db.run(
    'INSERT INTO responses (id, promptId, content, createdAt) VALUES (?, ?, ?, ?)',
    [response.id, response.promptId, response.content, response.createdAt]
  );

  return NextResponse.json(response);
}
import { NextResponse } from 'next/server';
import { getDb } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const prompt = {
      id: Date.now().toString(),
      title: body.title,
      text: body.text,
      createdAt: new Date().toISOString()
    };

    await db.run(
      'INSERT INTO prompts (id, title, text, createdAt) VALUES (?, ?, ?, ?)',
      [prompt.id, prompt.title, prompt.text, prompt.createdAt]
    );

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
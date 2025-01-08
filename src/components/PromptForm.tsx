'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PromptForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text })
    });
    if (res.ok) {
      router.push('/prompts');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2 text-black"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2 text-black"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Prompt
      </button>
    </form>
  );
}
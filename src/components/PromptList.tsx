'use client';
import Link from 'next/link';
import { Prompt } from '@/types';

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <Link
          key={prompt.id}
          href={`/prompts/${prompt.id}`}
          className="block p-4 border rounded hover:bg-purple-800 group"
        >
          <h2 className="text-xl font-semibold text-pink-300 group-hover:text-pink-100">
            {prompt.title}
          </h2>
          <p className="mt-2 text-pink-300 group-hover:text-pink-100">
            {prompt.text}
          </p>
        </Link>
      ))}
    </div>
  );
}
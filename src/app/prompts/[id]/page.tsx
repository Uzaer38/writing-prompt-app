'use client';
import { useEffect, useState } from 'react';
import LexicalEditor from '@/components/LexicalEditor';
import ResponseDisplay from '@/components/ResponseDisplay';
import Navbar from '@/components/Navbar';
import { Prompt, Response } from '@/types';

async function fetchPrompt(id: string): Promise<Prompt> {
  const res = await fetch(`/api/prompts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch prompt');
  return res.json();
}

async function fetchResponses(id: string): Promise<Response[]> {
  const res = await fetch(`/api/prompts/${id}/responses`);
  if (!res.ok) throw new Error('Failed to fetch responses');
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PromptPage({ params }: PageProps) {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [promptId, setPromptId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setPromptId(resolvedParams.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page parameters');
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!promptId) return;

    const loadData = async () => {
      try {
        const [promptData, responsesData] = await Promise.all([
          fetchPrompt(promptId),
          fetchResponses(promptId)
        ]);

        setPrompt(promptData);
        setResponses(responsesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    loadData();
  }, [promptId]);

  const handleNewResponse = (newResponse: Response) => {
    setResponses(prev => [newResponse, ...prev]);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-purple-900">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!prompt || !promptId) {
    return (
      <div className="min-h-screen bg-purple-900">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <article className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-pink-300">{prompt.title}</h1>
          <div className="prose max-w-none text-pink-200">
            <p className="text-lg">{prompt.text}</p>
          </div>
        </article>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-pink-300">Write a Response</h2>
          <LexicalEditor
            promptId={promptId}
            onChange={(content) => console.log('Editor content changed:', content)}
            onSubmitSuccess={handleNewResponse}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-pink-300">Responses</h2>
          <div className="space-y-6">
            {responses.map((response) => (
              <article
                key={response.id}
                className="bg-purple-800 border border-purple-700 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <ResponseDisplay content={response.content} />
                  <div className="mt-4 text-sm text-pink-300 flex items-center">
                    <time dateTime={new Date(response.createdAt).toISOString()}>
                      {new Date(response.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {responses.length === 0 && (
            <div className="text-center py-12 text-pink-300">
              No responses yet. Be the first to respond!
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
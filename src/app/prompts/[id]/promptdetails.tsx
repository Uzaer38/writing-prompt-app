'use client';
import { useEffect, useState } from 'react';
import LexicalEditor from '@/components/LexicalEditor';
import { Prompt, Response } from '@/types';

// Separate async functions for data fetching
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

async function submitResponse(id: string, content: string): Promise<Response> {
  const res = await fetch(`/api/prompts/${id}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Failed to submit response');
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

  // First useEffect to handle the async params
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

  // Second useEffect to load data once we have the promptId
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

  const handleResponse = async (content: string) => {
    if (!promptId) return;

    try {
      const newResponse = await submitResponse(promptId, content);
      setResponses(prev => [newResponse, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!prompt) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
      <p className="text-lg mb-8">{prompt.text}</p>

      <h2 className="text-2xl font-bold mb-4">Write a Response</h2>
      <LexicalEditor onChange={handleResponse} />

      <h2 className="text-2xl font-bold mt-8 mb-4">Responses</h2>
      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response.id} className="border rounded p-4">
            <div dangerouslySetInnerHTML={{ __html: response.content }} />
            <small className="text-gray-500">
              {new Date(response.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}
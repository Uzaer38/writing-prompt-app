'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setPromptId(resolvedParams.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page parameters');
        setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [promptId]);

  const handleNewResponse = (newResponse: Response) => {
    setResponses(prev => [newResponse, ...prev]);
  };

  if (error) {
    return (
      <div className="bg-purple-900">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-8"
        >
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-900">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-pink-300"
        >
          <p className="text-lg">Loading prompt...</p>
        </motion.div>
      </div>
    );
  }

  if (!prompt || !promptId) {
    return null;
  }

  return (
    <div className="bg-purple-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8"
      >
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4 text-pink-300">{prompt.title}</h1>
          <div className="prose max-w-none text-pink-200">
            <p className="text-lg">{prompt.text}</p>
          </div>
        </motion.article>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-pink-300">Write a Response</h2>
          <LexicalEditor
            promptId={promptId}
            onChange={(content) => console.log('Editor content changed:', content)}
            onSubmitSuccess={handleNewResponse}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-pink-300">Responses</h2>
          <AnimatePresence>
            {responses.map((response, index) => (
              <motion.article
                key={response.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-purple-800 border border-purple-700 rounded-lg shadow-sm overflow-hidden mb-6"
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
              </motion.article>
            ))}
          </AnimatePresence>

          {responses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center py-12 text-pink-300"
            >
              No responses yet. Be the first to respond!
            </motion.div>
          )}
        </motion.section>
      </motion.main>
    </div>
  );
}


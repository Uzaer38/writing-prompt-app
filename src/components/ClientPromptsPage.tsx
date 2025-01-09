'use client'

import { motion } from 'framer-motion';
import PromptList from '@/components/PromptList';
import Navbar from '@/components/Navbar';
import { Prompt } from '@/types';

interface ClientPromptsPageProps {
  prompts: Prompt[];
}

export default function ClientPromptsPage({ prompts } : ClientPromptsPageProps) {
  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-pink-300"
        >
          All Prompts
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <PromptList prompts={prompts} />
        </motion.div>
      </motion.main>
    </div>
  );
}
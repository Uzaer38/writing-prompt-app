'use client';

import { motion } from 'framer-motion';
import PromptForm from '@/components/PromptForm';
import Navbar from '@/components/Navbar';

export default function NewPromptPage() {
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
          Create New Prompt
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <PromptForm />
        </motion.div>
      </motion.main>
    </div>
  );
}


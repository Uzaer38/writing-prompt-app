'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BackgroundAnimation from '@/components/BackgroundAnimation'

export default function Page() {
  return (
    <div className="min-h-screen bg-purple-900 overflow-hidden relative">
      <BackgroundAnimation />
      <div className="relative z-20">
        <Navbar />
      </div>
      <main className="max-w-4xl mx-auto p-8 relative z-10">
        <motion.h1
          className="text-5xl font-bold mb-12 text-pink-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Writing Prompts
        </motion.h1>
        <div className="space-y-6">
          <Link
            href="/prompts/new"
            className="block w-full bg-pink-500 text-white text-center px-6 py-3 rounded-lg text-xl font-semibold shadow-lg hover:bg-pink-600 transition-colors duration-300 ease-in-out"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Prompt
            </motion.div>
          </Link>
          <Link
            href="/prompts"
            className="block w-full bg-pink-400 text-white text-center px-6 py-3 rounded-lg text-xl font-semibold shadow-lg hover:bg-pink-500 transition-colors duration-300 ease-in-out"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Prompts
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  )
}
"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const Navbar = () => {
  const pathname = usePathname()
  const showBackButton = pathname.startsWith('/prompts/') && pathname !== '/prompts/new'

  return (
    <motion.nav
      className="bg-purple-900 p-7 shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="w-[200px]">
          {showBackButton && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/prompts"
                className="text-pink-300 hover:text-pink-100 flex items-center gap-2 transition-colors duration-200"
              >
                <span className="hidden sm:inline">Back to Prompts List</span>
              </Link>
            </motion.div>
          )}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center justify-center">
            <motion.img
              src="/logo.png"
              alt="Writing Prompts Logo"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
        </div>

        <div className="w-[200px] flex justify-end">
          <motion.div
            className="hidden sm:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NavLink href="/prompts/new">New Prompt</NavLink>
            <NavLink href="/prompts">All Prompts</NavLink>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`text-pink-300 hover:text-pink-100 transition-colors duration-200 ${
        isActive ? 'font-bold' : ''
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.div>
    </Link>
  )
}

export default Navbar
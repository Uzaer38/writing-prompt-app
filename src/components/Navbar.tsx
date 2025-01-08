"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const showBackButton = pathname.startsWith('/prompts/') && pathname !== '/prompts/new';

  return (
    <nav className="bg-purple-900 p-4 shadow-lg">
      <div className="flex justify-center relative">
        {showBackButton ? (
          <Link
            href="/prompts"
            className="text-pink-300 hover:text-pink-100 flex items-center gap-1 absolute left-0"
          >
            <span>← Back to Prompts List</span>
          </Link>
        ) : (
          <div/>
        )}

        <Link href="/" className="items-center">
          <img
            src='/logo.png'
            alt="Logo"
            className="h-15 w-auto"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
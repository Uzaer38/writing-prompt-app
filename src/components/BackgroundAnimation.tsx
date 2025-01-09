'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function BackgroundAnimation() {
  const [particles, setParticles] = useState<Array<{
    width: number
    height: number
    top: string
    left: string
    duration: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client side
    setParticles(
      [...Array(50)].map(() => ({
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700"
        animate={{
          background: [
            'linear-gradient(to bottom right, #4a148c, #880e4f)',
            'linear-gradient(to bottom right, #311b92, #c2185b)',
            'linear-gradient(to bottom right, #1a237e, #ad1457)',
            'linear-gradient(to bottom right, #4a148c, #880e4f)',
          ],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <div className="absolute inset-0 opacity-30">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.width,
              height: particle.height,
              top: particle.top,
              left: particle.left,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
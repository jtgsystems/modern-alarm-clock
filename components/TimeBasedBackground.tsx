"use client"

import { motion } from 'framer-motion'
import { useDynamicTheme } from './DynamicThemeProvider'

export default function TimeBasedBackground() {
  const { currentTheme, timeOfDay } = useDynamicTheme()

  const getBackgroundElements = () => {
    const hour = new Date().getHours()

    // Night/Midnight themes (0-5, 20-23)
    if (hour >= 0 && hour < 5 || hour >= 20) {
      return (
        <>
          {/* Stars */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute h-1 w-1 rounded-full bg-white/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          {/* Moon */}
          <motion.div
            className="absolute top-10 right-10 h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200/30 to-gray-200/20 shadow-lg shadow-yellow-200/10"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )
    }

    // Dawn theme (5-7)
    if (hour >= 5 && hour < 7) {
      return (
        <>
          {/* Sunrise rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent"
              style={{
                width: '200px',
                left: '20%',
                top: `${20 + i * 5}%`,
                transformOrigin: 'left center',
                transform: `rotate(${-30 + i * 7.5}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {/* Sun */}
          <motion.div
            className="absolute top-1/4 left-1/4 h-12 w-12 rounded-full bg-gradient-to-br from-orange-300 to-yellow-400 shadow-lg shadow-orange-300/20"
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />
        </>
      )
    }

    // Morning/Afternoon themes (7-17)
    if (hour >= 7 && hour < 17) {
      return (
        <>
          {/* Floating clouds */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${60 + Math.random() * 40}px`,
                height: `${30 + Math.random() * 20}px`,
                left: `${20 + i * 20}%`,
                top: `${10 + Math.random() * 30}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 2,
              }}
            />
          ))}
          {/* Sun */}
          <motion.div
            className="absolute top-8 right-8 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg shadow-yellow-300/20"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )
    }

    // Evening theme (17-20)
    return (
      <>
        {/* Sunset gradient layers */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-500/20 to-transparent"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        {/* Setting sun */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-400/30"
          animate={{
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
      </>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base atmospheric gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.colors.gradient}`}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* Time-specific elements */}
      {getBackgroundElements()}

      {/* Ambient particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-0.5 w-0.5 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Time of day indicator */}
      <motion.div
        className="absolute top-4 left-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs font-medium text-white/80">{timeOfDay}</span>
        <span className="ml-2 text-xs text-white/60">{currentTheme.name}</span>
      </motion.div>
    </div>
  )
}
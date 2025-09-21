"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDynamicTheme } from "./DynamicThemeProvider"

interface ClockDisplayProps {
  timezone?: string
  is24HourFormat?: boolean
  showSeconds?: boolean
  showDate?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function ClockDisplay({
  timezone = "America/Toronto",
  is24HourFormat = false,
  showSeconds = false,
  showDate = true,
  size = 'large',
  className = ''
}: ClockDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { currentTheme } = useDynamicTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      hour12: !is24HourFormat,
    }

    const time = date.toLocaleTimeString("en-US", options)
    return time.replace(/am|pm/i, match => ` ${match.toUpperCase()}`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const timeString = formatTime(currentTime)
  const timeChars = timeString.split('')

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl md:text-6xl',
    large: 'text-6xl md:text-8xl lg:text-9xl'
  }

  const dateClasses = {
    small: 'text-sm',
    medium: 'text-base md:text-lg',
    large: 'text-lg md:text-xl lg:text-2xl'
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Time Display */}
      <div className={`font-mono font-light tracking-tight ${sizeClasses[size]} mb-4`}>
        <div className="flex items-center justify-center">
          <AnimatePresence>
            {timeChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}-${currentTime.getSeconds()}`}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: index * 0.02
                }}
                className="inline-block"
                style={{ color: currentTheme.colors.accent }}
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Date Display */}
      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${dateClasses[size]} opacity-80`}
        >
          {formatDate(currentTime)}
        </motion.div>
      )}
    </div>
  )
}
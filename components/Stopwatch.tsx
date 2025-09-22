"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { modernTransitions, scaleIn } from './animations/ModernAnimations'

interface Lap {
  time: number
  elapsed: string
}

export default function Stopwatch() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [startTime, setStartTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!)
      setIsRunning(false)
    } else {
      setStartTime(Date.now() - elapsedTime)
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 10)
      setIsRunning(true)
    }
  }

  const handleReset = () => {
    clearInterval(intervalRef.current!)
    setIsRunning(false)
    setElapsedTime(0)
    setLaps([])
    setStartTime(0)
  }

  const handleLap = () => {
    if (isRunning && laps.length === 0) {
      setLaps([{ time: elapsedTime, elapsed: formatTime(elapsedTime) }])
    } else if (isRunning) {
      setLaps(prev => [...prev, { time: elapsedTime, elapsed: formatTime(elapsedTime) }])
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white/90 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-b from-blue-400 to-purple-600"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            Stopwatch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Display */}
          <motion.div
            className={cn(
              'relative mx-auto w-fit rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-6 text-center backdrop-blur-xl border border-white/20 shadow-2xl',
              'text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-wide'
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={modernTransitions.spring}
          >
            {formatTime(elapsedTime)}
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleStartStop}
              variant={isRunning ? 'destructive' : 'default'}
              size="lg"
              className={cn(
                'px-6 py-3 font-semibold text-base',
                isRunning
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              )}
              aria-label={isRunning ? 'Stop the stopwatch' : 'Start the stopwatch'}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button
              onClick={handleLap}
              variant="outline"
              size="lg"
              disabled={!isRunning}
              className="px-6 py-3 font-semibold text-base border-white/20 bg-white/5 hover:bg-white/10"
              aria-label="Record a lap"
            >
              Lap
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-6 py-3 font-semibold text-base border-white/20 bg-white/5 hover:bg-white/10"
              aria-label="Reset the stopwatch"
            >
              Reset
            </Button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 max-h-40 overflow-y-auto"
            >
              <h4 className="text-sm font-medium text-white/80 uppercase tracking-wide">Laps</h4>
              <div className="space-y-1">
                {laps.map((lap, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 text-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-white/70">Lap {index + 1}</span>
                    <span className="font-mono text-white/90">{lap.elapsed}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

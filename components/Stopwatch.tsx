"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useDynamicTheme } from '@/components/DynamicThemeProvider'
import { Timer } from 'lucide-react'
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startRef = useRef<number | null>(null)

  const { currentTheme } = useDynamicTheme()

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  const getTimeParts = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)

    return {
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      cs: centis.toString().padStart(2, '0'),
    }
  }

  const handleStartStop = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsRunning(false)
      return
    }

    startRef.current = Date.now() - elapsedTime
    intervalRef.current = setInterval(() => {
      if (startRef.current != null) {
        setElapsedTime(Date.now() - startRef.current)
      }
    }, 10)
    setIsRunning(true)
  }

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setElapsedTime(0)
    setLaps([])
    startRef.current = null
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
    <div className="w-full">
      <Card className={`border-border/10 ${currentTheme.colors.primary} backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
            <CardTitle className="text-cyber-text-primary font-sans font-medium text-[clamp(1.125rem,2.5vw,1.25rem)]" style={{ textShadow: `0 0 10px ${currentTheme.colors.accent}` }}>
              Stopwatch
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Display */}
          <div
            className={cn(
              'relative mx-auto w-full max-w-[min(720px,92vw)] p-4 sm:p-5',
              'backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.55)]',
              'text-cyber-text-primary'
            )}
            style={{
              background: `linear-gradient(180deg, ${currentTheme.colors.secondary}, rgba(10,10,10,0.4))`
            }}
          >

            {/* Segmented modern time layout */}
            {(() => {
              const { h, m, s, cs } = getTimeParts(elapsedTime)
              const segment = (value: string, label: string) => (
                <div className="bg-black/40 px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                  <div className="text-[clamp(1.2rem,3.6vw,2.2rem)] font-sans font-medium tracking-[0.06em] tabular-nums text-foreground/95">
                    {value}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-[11px] tracking-[0.22em] text-foreground/40 uppercase">{label}</div>
                </div>
              )

              return (
                <div className="z-10 flex items-end justify-center gap-2 sm:gap-3">
                  {segment(h, 'HRS')}
                  <div className="pb-3 sm:pb-3.5 text-foreground/40 text-lg sm:text-2xl">:</div>
                  {segment(m, 'MIN')}
                  <div className="pb-3 sm:pb-3.5 text-foreground/40 text-lg sm:text-2xl">:</div>
                  {segment(s, 'SEC')}
                  <div className="pb-3 sm:pb-3.5 text-foreground/40 text-lg sm:text-2xl">.</div>
                  {segment(cs, 'CS')}
                </div>
              )
            })()}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleStartStop}
              size="lg"
              variant="outline"
              className={cn(
                `px-6 py-3 font-sans font-medium text-base rounded-md border-2 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 ${currentTheme.colors.secondary}`,
                isRunning
                  ? "text-red-400 border-red-500/50 hover:border-red-500 hover:text-red-300 hover:bg-red-500/10 focus-visible:ring-red-500"
                  : "text-cyber-text-primary border-cyber-accent/50 hover:border-cyber-accent hover:text-cyber-accent hover:bg-cyber-accent/10 focus-visible:ring-cyber-accent"
              )}
              style={{ textShadow: isRunning ? `0 0 5px #ff1744` : `0 0 5px ${currentTheme.colors.accent}` }}
              aria-label={isRunning ? 'Stop the stopwatch' : 'Start the stopwatch'}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button
              onClick={handleLap}
              variant="outline"
              size="lg"
              disabled={!isRunning}
              className={cn(
                `px-6 py-3 font-sans font-medium text-cyber-text-primary text-base rounded-md border-2 border-cyber-accent/50 hover:border-cyber-accent hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyber-accent focus-visible:ring-offset-2 ${currentTheme.colors.secondary}`,
                !isRunning ? "opacity-40 cursor-not-allowed" : "hover:bg-cyber-accent/10 hover:text-cyber-accent"
              )}
              style={{ textShadow: `0 0 5px ${currentTheme.colors.accent}` }}
              aria-label="Record a lap"
            >
              Lap
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className={`px-6 py-3 font-sans font-medium text-cyber-text-primary text-base rounded-md border-2 border-cyber-accent/50 hover:border-cyber-accent hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyber-accent focus-visible:ring-offset-2 ${currentTheme.colors.secondary} hover:bg-cyber-accent/10 hover:text-cyber-accent`}
              style={{ textShadow: `0 0 5px ${currentTheme.colors.accent}` }}
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
              className="space-y-2 max-h-44 overflow-y-auto"
            >
              <h4 className="text-sm font-medium text-cyber-text-primary uppercase tracking-wide">Laps</h4>
              <div className="space-y-1">
                {laps.map((lap, index) => (
                  <motion.div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-xl ${currentTheme.colors.secondary} border border-border/10 text-sm`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <span className="text-cyber-text-secondary">Lap {index + 1}</span>
                    <span className="font-sans font-medium text-cyber-text-primary tabular-nums">{lap.elapsed}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

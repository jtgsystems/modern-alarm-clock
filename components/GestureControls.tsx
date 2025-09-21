"use client"

import { motion } from 'framer-motion'
import { useGestures } from '@/hooks/useGestures'
import { useState, useEffect } from 'react'
import { Smartphone, Hand, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'

interface GestureControlsProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  children: React.ReactNode
  showHints?: boolean
}

export default function GestureControls({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  children,
  showHints = false
}: GestureControlsProps) {
  const [activeGesture, setActiveGesture] = useState<string | null>(null)
  const [showGestureHints, setShowGestureHints] = useState(showHints)

  const gestureRef = useGestures({
    onSwipeLeft: () => {
      setActiveGesture('swipe-left')
      setTimeout(() => setActiveGesture(null), 300)
      onSwipeLeft?.()
    },
    onSwipeRight: () => {
      setActiveGesture('swipe-right')
      setTimeout(() => setActiveGesture(null), 300)
      onSwipeRight?.()
    },
    onSwipeUp: () => {
      setActiveGesture('swipe-up')
      setTimeout(() => setActiveGesture(null), 300)
      onSwipeUp?.()
    },
    onSwipeDown: () => {
      setActiveGesture('swipe-down')
      setTimeout(() => setActiveGesture(null), 300)
      onSwipeDown?.()
    },
    onDoubleTap: () => {
      setActiveGesture('double-tap')
      setTimeout(() => setActiveGesture(null), 500)
      onDoubleTap?.()
    },
    onLongPress: () => {
      setActiveGesture('long-press')
      setTimeout(() => setActiveGesture(null), 500)
      onLongPress?.()
    },
    threshold: 50,
    longPressDelay: 600
  })

  // Auto-hide gesture hints after 5 seconds
  useEffect(() => {
    if (showGestureHints) {
      const timer = setTimeout(() => {
        setShowGestureHints(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showGestureHints])

  return (
    <div ref={gestureRef} className="relative touch-manipulation select-none">
      {children}

      {/* Gesture Feedback Overlay */}
      {activeGesture && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="rounded-full bg-white/20 backdrop-blur-sm p-4 shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {activeGesture === 'swipe-left' && <ArrowLeft className="h-8 w-8 text-white" />}
            {activeGesture === 'swipe-right' && <ArrowRight className="h-8 w-8 text-white" />}
            {activeGesture === 'swipe-up' && <ArrowUp className="h-8 w-8 text-white" />}
            {activeGesture === 'swipe-down' && <ArrowDown className="h-8 w-8 text-white" />}
            {activeGesture === 'double-tap' && <Smartphone className="h-8 w-8 text-white" />}
            {activeGesture === 'long-press' && <Hand className="h-8 w-8 text-white" />}
          </motion.div>
        </motion.div>
      )}

      {/* Gesture Hints */}
      {showGestureHints && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-3">
            <div className="mb-2 flex items-center gap-2">
              <Hand className="h-4 w-4 text-white/70" />
              <span className="text-xs font-medium text-white/70">Gesture Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
              {onSwipeLeft && (
                <div className="flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  <span>Swipe left</span>
                </div>
              )}
              {onSwipeRight && (
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  <span>Swipe right</span>
                </div>
              )}
              {onSwipeUp && (
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <span>Swipe up</span>
                </div>
              )}
              {onSwipeDown && (
                <div className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" />
                  <span>Swipe down</span>
                </div>
              )}
              {onDoubleTap && (
                <div className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  <span>Double tap</span>
                </div>
              )}
              {onLongPress && (
                <div className="flex items-center gap-1">
                  <Hand className="h-3 w-3" />
                  <span>Long press</span>
                </div>
              )}
            </div>
            <motion.button
              className="mt-2 text-xs text-white/50 hover:text-white/70"
              onClick={() => setShowGestureHints(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hide hints
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Toggle Hints Button */}
      {!showGestureHints && (
        <motion.button
          className="absolute bottom-4 right-4 z-40 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm p-2 text-white/60 transition-colors hover:text-white/80"
          onClick={() => setShowGestureHints(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <Hand className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  )
}

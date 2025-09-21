"use client"

import { useRef, useEffect, useState } from 'react'

interface GestureConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  threshold?: number
  longPressDelay?: number
}

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export function useGestures(config: GestureConfig) {
  const elementRef = useRef<HTMLElement>(null)
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null)
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null)
  const [lastTap, setLastTap] = useState<number>(0)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onDoubleTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500
  } = config

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    const now = Date.now()

    setTouchEnd(null)
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now
    })

    // Handle pinch gesture start
    if (e.touches.length === 2 && onPinch) {
      setInitialPinchDistance(getDistance(e.touches[0], e.touches[1]))
    }

    // Handle long press
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress()
      }, longPressDelay)
      setLongPressTimer(timer)
    }

    // Handle double tap
    if (onDoubleTap) {
      const timeSinceLastTap = now - lastTap
      if (timeSinceLastTap < 300) {
        onDoubleTap()
        setLastTap(0)
      } else {
        setLastTap(now)
      }
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    // Clear long press timer if user moves
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch && initialPinchDistance) {
      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const scale = currentDistance / initialPinchDistance
      onPinch(scale)
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Reset pinch distance
    setInitialPinchDistance(null)

    const touch = e.changedTouches[0]
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    })

    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Check if it's a swipe gesture
    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    // Prevent default touch behaviors that might interfere
    const preventDefaults = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    element.addEventListener('touchstart', preventDefaults, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchstart', preventDefaults)
    }
  }, [touchStart, longPressTimer, initialPinchDistance, config])

  return elementRef
}
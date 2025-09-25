"use client"

import { memo } from "react"

interface ClockProps {
  currentTime: Date
}

function Clock({ currentTime }: ClockProps) {
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="clock flex items-center justify-center py-12">
      <div 
        className="current-time text-center" 
        aria-live="polite"
        role="timer"
      >
        <time 
          dateTime={currentTime.toISOString()}
        className="time text-[8rem] font-mono font-bold tracking-tighter bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"
        >
          {formattedTime}
        </time>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Clock)

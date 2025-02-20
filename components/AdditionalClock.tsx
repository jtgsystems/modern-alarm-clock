"use client"

import { useState, useEffect, memo } from "react"
import { ArrowUpFromLine, ArrowDownToLine, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCountryFlag } from "./CountryFlags"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

interface AdditionalClockProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  timeZone: string
  countryCode: string
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  is24HourFormat: boolean
  showSeconds: boolean
}

function AdditionalClock({
  name,
  timeZone,
  countryCode,
  onRemove,
  onMoveUp,
  onMoveDown,
  is24HourFormat,
  showSeconds,
  className,
  ...props
}: AdditionalClockProps) {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, showSeconds ? 1000 : 60000) // Update every second or minute based on showSeconds
    return () => clearInterval(timer)
  }, [showSeconds])

  const Flag = getCountryFlag(countryCode)

  return (
    <div 
      className={cn("group relative overflow-hidden backdrop-blur-sm", className)}
      role="timer"
      aria-label={`Clock for ${name}`}
      {...props}
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-200/20 to-purple-200/20 dark:from-cyan-600/20 dark:to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Main container */}
      <div className="relative rounded-lg overflow-hidden">
        <div className="bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors p-2 sm:p-3">
          <div className="flex items-center gap-1.5 sm:gap-2 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
              <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white/90">{name}</span>
            </div>
            <div 
              className="text-sm sm:text-base font-mono text-gray-800 dark:text-white/90 tabular-nums"
              suppressHydrationWarning
            >
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: showSeconds ? "2-digit" : undefined,
                hour12: !is24HourFormat,
                timeZone: timeZone,
              })}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={onMoveUp}
                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
              >
                <ArrowUpFromLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onMoveDown}
                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
              >
                <ArrowDownToLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="sr-only">Move down</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onRemove}
                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-red-500/20"
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AdditionalClock)

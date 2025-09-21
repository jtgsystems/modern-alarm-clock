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
      className={cn(
        "group flex items-center gap-3 neu-layer px-4 py-3",
        "transition-all duration-200",
        className
      )}
      role="timer"
      aria-label={`Clock for ${name}`}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Flag className="h-4 w-4" />
        <span className="truncate text-sm font-medium text-white/80">{name}</span>
      </div>
      <div
        className="text-sm font-mono text-white/80 tabular-nums"
        suppressHydrationWarning
      >
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
          hour12: !is24HourFormat,
          timeZone,
        })}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          onClick={onMoveUp}
          className="h-6 w-6 rounded-full text-white/50 hover:text-white hover:bg-white/10"
        >
          <ArrowUpFromLine className="h-3 w-3" />
          <span className="sr-only">Move up</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onMoveDown}
          className="h-6 w-6 rounded-full text-white/50 hover:text-white hover:bg-white/10"
        >
          <ArrowDownToLine className="h-3 w-3" />
          <span className="sr-only">Move down</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemove}
          className="h-6 w-6 rounded-full text-red-400/70 hover:text-red-300 hover:bg-red-400/10"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AdditionalClock)

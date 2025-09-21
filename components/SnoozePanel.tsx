"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SnoozePanelProps {
  alarm?: { label?: string } | null
  onStop: () => void
  onSnooze: (minutes: number) => void
}

export default function SnoozePanel({ alarm, onStop, onSnooze }: SnoozePanelProps) {
  const [snoozeDuration, setSnoozeDuration] = useState(5)

  return (
    <div
      className="relative overflow-hidden backdrop-blur-xl"
      aria-live="polite"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-cyan-500 to-purple-500 rounded-[2.1rem] opacity-40 blur-sm" />
      
      {/* Main container */}
      <div className="relative rounded-[2rem] overflow-hidden">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-900/80 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold text-white">Time to Wake Up!</h2>
            {alarm?.label && <p className="text-lg text-white/70">{alarm.label}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/80">
              Snooze Duration
            </label>
            <Select value={String(snoozeDuration)} onValueChange={(value) => setSnoozeDuration(Number(value))}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onStop}
              className={cn(
                "flex-1 h-12",
                "bg-red-500/20 text-red-400",
                "hover:bg-red-500/30 hover:text-red-300",
                "border border-red-500/30",
                "transition-colors"
              )}
            >
              Stop
            </Button>
            <Button
              onClick={() => onSnooze(snoozeDuration)}
              className={cn(
                "flex-1 h-12",
                "bg-cyan-500/20 text-cyan-400",
                "hover:bg-cyan-500/30 hover:text-cyan-300",
                "border border-cyan-500/30",
                "transition-colors"
              )}
            >
              Snooze
            </Button>
          </div>
        </div>

        {/* Subtle inner border */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none" />
      </div>
    </div>
  )
}

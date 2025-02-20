"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

export interface Alarm {
  id: string
  time: string
  label?: string
}

interface ActiveAlarmsProps extends ComponentPropsWithoutRef<"section"> {
  alarms: Alarm[]
  removeAlarm: (id: string) => void
}

export default function ActiveAlarms({ alarms, removeAlarm, className, ...props }: ActiveAlarmsProps) {
  if (alarms.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">No active alarms</p>
      </div>
    )
  }

  return (
    <section className={cn("space-y-3", className)} aria-live="polite" {...props}>
      <h2 className="text-lg font-medium text-white/90">Active Alarms</h2>
      <ul className="space-y-2" role="list">
        {alarms.map((alarm) => (
          <li
            key={alarm.id}
            className={cn(
              "group relative overflow-hidden",
              "bg-gray-800/50 hover:bg-gray-700/50",
              "backdrop-blur-sm",
              "rounded-lg p-4",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-mono text-lg text-white/90">{alarm.time}</p>
                {alarm.label && (
                  <p className="text-sm text-white/60">{alarm.label}</p>
                )}
              </div>
              <Button
                onClick={() => removeAlarm(alarm.id)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove alarm</span>
              </Button>
            </div>
            {/* Gradient border effect */}
            <div className="absolute inset-px rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </li>
        ))}
      </ul>
    </section>
  )
}


"use client"

import { Bell, X, Minimize2, Maximize2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface UpcomingAlarmsWidgetProps {
  alarms: Array<{
    id: string
    time: string
    label?: string
    reminderDate?: Date
  }>
}

export default function UpcomingAlarmsWidget({ alarms }: UpcomingAlarmsWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const now = new Date()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + A to toggle widget visibility
      if (e.altKey && e.key === 'a') {
        setIsHidden(!isHidden)
        toast.info(
          isHidden ? "Upcoming alarms visible" : "Upcoming alarms hidden",
          { duration: 1500 }
        )
      }
      // Alt + M to toggle minimize
      if (e.altKey && e.key === 'm') {
        setIsMinimized(!isMinimized)
        toast.info(
          isMinimized ? "Widget expanded" : "Widget minimized",
          { duration: 1500 }
        )
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isHidden, isMinimized])

  const getTimeUntil = (alarm: { time: string; reminderDate?: Date }) => {
    const today = new Date()
    const [hours, minutes] = alarm.time.split(':').map(Number)
    const alarmTime = new Date(today.setHours(hours, minutes, 0, 0))
    
    if (alarm.reminderDate) {
      alarmTime.setFullYear(
        alarm.reminderDate.getFullYear(),
        alarm.reminderDate.getMonth(),
        alarm.reminderDate.getDate()
      )
    }
    
    if (alarmTime < now) {
      if (!alarm.reminderDate) {
        alarmTime.setDate(alarmTime.getDate() + 1)
      }
    }

    const diff = alarmTime.getTime() - now.getTime()
    const hours24 = Math.floor(diff / (1000 * 60 * 60))
    const minutes60 = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours24 >= 24) {
      const days = Math.floor(hours24 / 24)
      return `${days}d`
    } else if (hours24 > 0) {
      return `${hours24}h ${minutes60}m`
    } else if (minutes60 > 0) {
      return `${minutes60}m`
    } else {
      return 'soon'
    }
  }

  const sortedAlarms = [...alarms]
    .sort((a, b) => {
      const aTime = new Date()
      const bTime = new Date()
      const [aHours, aMinutes] = a.time.split(':').map(Number)
      const [bHours, bMinutes] = b.time.split(':').map(Number)
      
      aTime.setHours(aHours, aMinutes, 0, 0)
      bTime.setHours(bHours, bMinutes, 0, 0)
      
      if (a.reminderDate) aTime.setFullYear(a.reminderDate.getFullYear(), a.reminderDate.getMonth(), a.reminderDate.getDate())
      if (b.reminderDate) bTime.setFullYear(b.reminderDate.getFullYear(), b.reminderDate.getMonth(), b.reminderDate.getDate())
      
      if (aTime < now) aTime.setDate(aTime.getDate() + 1)
      if (bTime < now) bTime.setDate(bTime.getDate() + 1)
      
      return aTime.getTime() - bTime.getTime()
    })
    .slice(0, 3)

  if (sortedAlarms.length === 0 || isHidden) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4",
      "w-64 rounded-lg shadow-lg",
      "bg-gray-900/95 backdrop-blur-xl",
      "border border-white/10",
      "transition-all duration-300",
      isMinimized && "w-auto"
    )}>
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-white/70" />
          <span className="text-sm font-medium text-white/90">
            Next Alarms
            <span className="ml-2 text-xs text-white/50">Alt+A to toggle</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-md text-white/50 hover:text-white/90 hover:bg-white/5"
            title={isMinimized ? "Maximize (Alt+M)" : "Minimize (Alt+M)"}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsHidden(true)}
            className="p-1 rounded-md text-white/50 hover:text-white/90 hover:bg-white/5"
            title="Close (Alt+A)"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-2 space-y-1">
          {sortedAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">
                  {alarm.label || "Alarm"}
                </p>
                <p className="text-xs text-white/50">{alarm.time}</p>
              </div>
              <span className="text-xs font-medium text-white/70 tabular-nums">
                {getTimeUntil(alarm)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
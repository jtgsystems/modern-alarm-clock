"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Clock from "./Clock"
import AlarmForm from "./AlarmForm"
import ActiveAlarms from "./ActiveAlarms"
import UpcomingAlarms from "./UpcomingAlarms"
import SnoozePanel from "./SnoozePanel"
import ThemeToggle from "./ThemeToggle"
import AppointmentList from "./AppointmentList"
import AlarmDialog from "./AlarmDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { useNotification } from "@/hooks/use-notification"
import { playAlarmSound, AlarmSound } from "@/lib/sounds"
import UpcomingAlarmsWidget from "./UpcomingAlarmsWidget"
import { cn } from "@/lib/utils"
import ShortcutsHint from "./ShortcutsHint"

interface AlarmSettings {
  time: string
  label: string
  isRecurring: boolean
  showNotification: boolean
  reminderDate?: Date
  sound?: AlarmSound
  volume?: number
}

interface Alarm {
  id: string
  time: string
  label: string
  sound?: AlarmSound
  volume?: number
  isRecurring?: boolean
  showNotification?: boolean
  reminderDate?: Date
}

interface Reminder {
  id: string
  date: Date
  label: string
  time: string
}

interface CalendarContainerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function CalendarContainer({ isOpen, onClose, children }: CalendarContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      // Add quick date navigation with arrow keys when holding Alt
      if (e.altKey && isOpen) {
        const today = new Date()
        switch (e.key) {
          case 'ArrowRight':
            // Jump to next week
            today.setDate(today.getDate() + 7)
            break
          case 'ArrowLeft':
            // Jump to previous week
            today.setDate(today.getDate() - 7)
            break
          case 'ArrowUp':
            // Previous month
            today.setMonth(today.getMonth() - 1)
            break
          case 'ArrowDown':
            // Next month
            today.setMonth(today.getMonth() + 1)
            break
        }
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      containerRef.current?.focus()
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          "relative",
          "bg-gray-900/95 backdrop-blur-xl",
          "border border-white/10 rounded-xl",
          "p-4 shadow-2xl",
          "transform transition-all duration-200",
          "animate-in fade-in-0 zoom-in-95"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function AlarmClock() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isSnoozing, setIsSnoozing] = useState(false)
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showAlarmDialog, setShowAlarmDialog] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const notification = useNotification({
    title: "Alarm Clock",
    icon: "/alarm-icon.png"
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      checkAlarmsAndReminders(now)
    }, 1000)
    return () => clearInterval(timer)
  }, [alarms, reminders])


  useEffect(() => {
    notification.requestPermission()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N to quickly create new alarm
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        setShowAlarmDialog(true)
        toast.info("Set a new alarm", { duration: 1500 })
      }
      // Alt + C to toggle calendar
      if (e.altKey && e.key === 'c') {
        e.preventDefault()
        setIsCalendarOpen(prev => !prev)
        toast.info(isCalendarOpen ? "Calendar closed" : "Calendar opened", { duration: 1500 })
      }
      // Alt + Left/Right for quick week navigation when calendar is open
      if (e.altKey && isCalendarOpen && selectedDate) {
        const newDate = new Date(selectedDate)
        if (e.key === 'ArrowLeft') {
          newDate.setDate(newDate.getDate() - 7)
          setSelectedDate(newDate)
          toast.info(`Jumped to ${newDate.toLocaleDateString()}`, { duration: 1500 })
        } else if (e.key === 'ArrowRight') {
          newDate.setDate(newDate.getDate() + 7)
          setSelectedDate(newDate)
          toast.info(`Jumped to ${newDate.toLocaleDateString()}`, { duration: 1500 })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCalendarOpen, selectedDate])

  const checkAlarmsAndReminders = (now: Date) => {
    const currentTimeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const triggeredAlarm = alarms.find((alarm) => {
      if (alarm.reminderDate) {
        const reminderDate = new Date(alarm.reminderDate)
        return (
          alarm.time === currentTimeString &&
          reminderDate.getDate() === now.getDate() &&
          reminderDate.getMonth() === now.getMonth() &&
          reminderDate.getFullYear() === now.getFullYear()
        )
      }
      return alarm.time === currentTimeString
    })

    if (triggeredAlarm && !activeAlarm) {
      setActiveAlarm(triggeredAlarm)
      triggerAlarm(triggeredAlarm)
    }
  }

  const triggerAlarm = (alarm: Alarm) => {
    playAlarmSound(alarm.sound || "classic", (alarm.volume || 50) / 100)

    if (alarm.showNotification) {
      notification.sendNotification(alarm.label || "Your alarm is ringing!")
    }

    toast("Alarm", {
      description: alarm.label || "Your alarm is ringing!",
      action: {
        label: "Stop",
        onClick: () => stopAlarm(),
      },
    })

    setActiveAlarm(alarm)
    setIsSnoozing(true)
  }

  const handleSetAlarm = useCallback((settings: AlarmSettings) => {
    const newAlarm: Alarm = {
      ...settings,
      id: crypto.randomUUID(),
    }

    setAlarms(prev => [...prev, newAlarm])

    if (settings.reminderDate) {
      const reminder: Reminder = {
        id: crypto.randomUUID(),
        date: settings.reminderDate,
        label: settings.label,
        time: settings.time
      }
      setReminders(prev => [...prev, reminder])
    }

    toast.success("Alarm set successfully", {
      description: settings.reminderDate
        ? `Set for ${settings.reminderDate.toLocaleDateString()} at ${settings.time}`
        : `Set for ${settings.time}`
    })
  }, [])

  const removeAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id))
  }, [])

  const stopAlarm = useCallback(() => {
    setIsSnoozing(false)
    setActiveAlarm(null)
  }, [])

  const snoozeAlarm = useCallback((duration: number) => {
    if (activeAlarm) {
      const snoozeTime = new Date(currentTime.getTime() + duration * 60000)
      const snoozeAlarm: Alarm = {
        ...activeAlarm,
        time: snoozeTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      }
      setAlarms(prev => [...prev, snoozeAlarm])
      stopAlarm()
    }
  }, [activeAlarm, currentTime, stopAlarm])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
    if (date) {
      setShowAlarmDialog(true)
    }
  }

  const getDayReminders = (date: Date) => {
    return reminders.filter(
      (reminder) =>
        reminder.date.getDate() === date.getDate() &&
        reminder.date.getMonth() === date.getMonth() &&
        reminder.date.getFullYear() === date.getFullYear()
    )
  }

  const getAllAppointments = useMemo(() => {
    const alarmAppointments = alarms.map(alarm => ({
      id: alarm.id,
      time: alarm.time,
      label: alarm.label,
      date: alarm.reminderDate,
      isRecurring: alarm.isRecurring
    }))

    const reminderAppointments = reminders.map(reminder => ({
      id: reminder.id,
      time: reminder.time,
      label: reminder.label,
      date: reminder.date
    }))

    return [...alarmAppointments, ...reminderAppointments]
  }, [alarms, reminders])

  return (
    <>
      <div className="space-y-6">
        <ThemeToggle />
        <Clock currentTime={currentTime} />

        {/* Buttons and Upcoming Alarms Section */}
        <div className="space-y-6">
          <div className="flex gap-2">
            <button onClick={() => setShowAlarmDialog(true)} className="flex-1 p-3 rounded-lg bg-gray-900/50 text-white/90 hover:bg-gray-900/70 border border-white/10 transition-colors">
              Set Alarm
            </button>
            <button onClick={() => setIsCalendarOpen(true)} className="flex-1 p-3 rounded-lg bg-gray-900/50 text-white/90 hover:bg-gray-900/70 border border-white/10 transition-colors">
              Add Time Zone
            </button>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/30 border border-white/5 backdrop-blur-sm">
            <UpcomingAlarms alarms={alarms} />
          </div>
        </div>
        <ActiveAlarms alarms={alarms} removeAlarm={removeAlarm} />
        {isSnoozing && <SnoozePanel alarm={activeAlarm} onStop={stopAlarm} onSnooze={snoozeAlarm} />}

        <AppointmentList appointments={getAllAppointments} />

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white/90">Calendar</h2>
          <Button
            variant="outline"
            onClick={() => setIsCalendarOpen(true)}
            className="border-white/10 text-white/80 hover:bg-white/5"
          >
            Open Calendar
          </Button>
        </div>

        <CalendarContainer isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-white/90">Select Date</h2>
                <p className="text-sm text-white/60">Choose a date for your alarm</p>
              </div>
              <div className="text-sm text-white/60">
                <kbd className="px-2 py-1 bg-white/10 rounded">Alt + ←→</kbd> Navigate weeks
                <br />
                <kbd className="px-2 py-1 bg-white/10 rounded ml-1">Alt + ↑↓</kbd> Navigate months
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={{
                hasReminder: (date) => getDayReminders(date).length > 0,
              }}
              className="rounded-lg border border-white/10 p-3"
              classNames={{
                day_selected: "bg-indigo-600 text-white hover:bg-indigo-600",
                day_today: "bg-white/5 text-white font-semibold",
                day: "text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
                nav_button_previous: "text-white/60 hover:text-white",
                nav_button_next: "text-white/60 hover:text-white",
                head_cell: "text-white/60",
                caption: "text-white/90"
              }}
            />

            {selectedDate && getDayReminders(selectedDate).length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-white/80 mb-3">
                  Reminders for {selectedDate.toLocaleDateString()}
                </h4>
                <div className="space-y-2">
                  {getDayReminders(selectedDate).map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm text-white/80">{reminder.label || "Reminder"}</span>
                      <span className="text-xs text-white/60">{reminder.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CalendarContainer>

        <AlarmDialog
          open={showAlarmDialog}
          onOpenChange={setShowAlarmDialog}
          onSetAlarm={handleSetAlarm}
          selectedDate={selectedDate}
        />
      </div>

      {/* Floating Upcoming Alarms Widget */}
      <UpcomingAlarmsWidget alarms={alarms} />
      <ShortcutsHint />

      {/* Help text for new users */}
      <div className="fixed bottom-4 left-4 text-xs text-white/40">
        Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Shift + ?</kbd> for keyboard shortcuts
      </div>
    </>
  )
}


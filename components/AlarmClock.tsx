"use client"

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import ActiveAlarms from "./ActiveAlarms"
import AppointmentList from "./AppointmentList"
import Clock from "./Clock"
import SnoozePanel from "./SnoozePanel"
import ThemeToggle from "./ThemeToggle"
import UpcomingAlarms from "./UpcomingAlarms"
const DynamicAlarmDialog = dynamic(() => import('./AlarmDialog'), { ssr: false, loading: () => <div className="h-96 bg-white/5 rounded-xl animate-pulse" /> })
// Dialog primitives not used directly; AlarmDialog encapsulates them
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useNotification } from "@/hooks/use-notification"
import { useAlarm } from "@/hooks/useAlarm"
import { cn } from "@/lib/utils"
import { useDynamicTheme, type TimeBasedTheme } from "./DynamicThemeProvider"
import { toast } from "sonner"
import ShortcutsHint from "./ShortcutsHint"
import UpcomingAlarmsWidget from "./UpcomingAlarmsWidget"

interface AlarmSettings {
  time: string
  label: string
  isRecurring: boolean
  showNotification: boolean
  reminderDate?: Date
  sound?: string
  volume?: number
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
  currentTheme: TimeBasedTheme
}

function CalendarContainer({ isOpen, onClose, children, currentTheme }: CalendarContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        `bg-gradient-to-b ${currentTheme.colors.primary} backdrop-blur-sm`
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          "relative",
          `bg-gradient-to-b ${currentTheme.colors.primary}`,
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
  const [, startTransition] = useTransition()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSnoozing] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showAlarmDialog, setShowAlarmDialog] = useState(false)
  const { alarms, activeAlarm, setAlarm: hookSetAlarm, removeAlarm: hookRemoveAlarm, stopAlarm: hookStopAlarm, snoozeAlarm: hookSnoozeAlarm, checkAlarms } = useAlarm()
  const notification = useNotification({
    title: "Alarm Clock",
    icon: "/alarm-icon.png"
  })

  const { currentTheme } = useDynamicTheme()




  useEffect(() => {
    notification.requestPermission()
  }, [notification])


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

  // stopAlarm from hook




  const checkAlarmsAndReminders = useCallback((now: Date) => {
    checkAlarms(now)
  }, [checkAlarms])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      checkAlarmsAndReminders(now)
    }, 1000)
    return () => clearInterval(timer)
  }, [checkAlarmsAndReminders])

  const handleSetAlarm = useCallback((settings: AlarmSettings) => {
    hookSetAlarm(settings)

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
  }, [hookSetAlarm])

  const removeAlarm = useCallback((id: string) => {
    hookRemoveAlarm(id)
  }, [hookRemoveAlarm])



  const snoozeAlarm = useCallback((duration: number) => {
    hookSnoozeAlarm(duration, currentTime)
  }, [hookSnoozeAlarm, currentTime])

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
            <button onClick={() => { startTransition(() => setShowAlarmDialog(true)) }} className={`flex-1 p-3 rounded-lg ${currentTheme.colors.secondary} text-cyber-text-primary hover:bg-white/10 border border-white/10 transition-colors`} aria-label="Open dialog to set a new alarm">
              Set Alarm
            </button>
            <button onClick={() => { startTransition(() => setIsCalendarOpen(true)) }} className={`flex-1 p-3 rounded-lg ${currentTheme.colors.secondary} text-cyber-text-primary hover:bg-white/10 border border-white/10 transition-colors`} aria-label="Open calendar to add a time zone">
              Add Time Zone
            </button>
          </div>
          <div className={`p-4 rounded-xl ${currentTheme.colors.secondary} border border-white/10 backdrop-blur-sm`}>
            <UpcomingAlarms alarms={alarms} />
          </div>
        </div>
        <ActiveAlarms alarms={alarms} removeAlarm={removeAlarm} />
        {isSnoozing && <SnoozePanel alarm={activeAlarm} onStop={hookStopAlarm} onSnooze={snoozeAlarm} />}

        <AppointmentList appointments={getAllAppointments} />

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white/90">Calendar</h2>
          <Button
            variant="outline"
            onClick={() => { startTransition(() => setIsCalendarOpen(true)) }}
            className={`border-white/10 text-cyber-text-secondary hover:${currentTheme.colors.secondary}`}
            aria-label="Open calendar dialog"
          >
            Open Calendar
          </Button>
        </div>

        <CalendarContainer isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} currentTheme={currentTheme}>
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
                day_selected: `bg-cyber-accent text-cyber-text-primary hover:bg-cyber-accent`,
                day_today: `${currentTheme.colors.secondary} text-cyber-text-primary font-semibold`,
                day: `text-cyber-text-secondary hover:${currentTheme.colors.secondary} hover:text-cyber-text-primary focus:${currentTheme.colors.secondary} focus:text-cyber-text-primary`,
                nav_button_previous: "text-cyber-text-secondary hover:text-cyber-text-primary",
                nav_button_next: "text-cyber-text-secondary hover:text-cyber-text-primary",
                head_cell: "text-cyber-text-secondary",
                caption: "text-cyber-text-primary"
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

        <DynamicAlarmDialog
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

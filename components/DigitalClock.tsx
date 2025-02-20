"use client"

import { useState, useEffect, useRef } from "react"
import { getMockWeather } from "@/lib/mockWeather"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import AlarmSettings, { type AlarmSettings as AlarmSettingsType } from "./AlarmSettings"
import AdditionalClock from "./AdditionalClock"
import AddTimeZone from "./AddTimeZone"
import WeatherSuggestion from "./WeatherSuggestion"
import WeatherDisplay from "./WeatherDisplay" 
import { cn } from "@/lib/utils"
import { Settings } from "lucide-react"
import RadioPlayer from "./RadioPlayer"
import ThemeToggle from "./ThemeToggle"

const TORONTO_TIMEZONE = "America/Toronto"

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [isAlarmOpen, setIsAlarmOpen] = useState(false)
  const [isAddTimeZoneOpen, setIsAddTimeZoneOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [additionalTimeZones, setAdditionalTimeZones] = useState([
    { name: "Toronto", timeZone: TORONTO_TIMEZONE, countryCode: "CA" }, // UTC-5
    { name: "New York", timeZone: "America/New_York", countryCode: "US" }, // UTC-5
    { name: "Los Angeles", timeZone: "America/Los_Angeles", countryCode: "US" }, // UTC-8
    { name: "London", timeZone: "Europe/London", countryCode: "GB" }, // UTC+0
    { name: "Paris", timeZone: "Europe/Paris", countryCode: "FR" }, // UTC+1
    { name: "Berlin", timeZone: "Europe/Berlin", countryCode: "DE" }, // UTC+1
    { name: "Moscow", timeZone: "Europe/Moscow", countryCode: "RU" }, // UTC+3
    { name: "Dubai", timeZone: "Asia/Dubai", countryCode: "AE" }, // UTC+4
    { name: "Mumbai", timeZone: "Asia/Kolkata", countryCode: "IN" }, // UTC+5:30
    { name: "Singapore", timeZone: "Asia/Singapore", countryCode: "SG" }, // UTC+8
    { name: "Tokyo", timeZone: "Asia/Tokyo", countryCode: "JP" }, // UTC+9
    { name: "Sydney", timeZone: "Australia/Sydney", countryCode: "AU" }, // UTC+11
    { name: "Auckland", timeZone: "Pacific/Auckland", countryCode: "NZ" }, // UTC+13
  ])
  const [is24HourFormat, setIs24HourFormat] = useState(false)
  const [showSeconds, setShowSeconds] = useState(false)
  const [alarms, setAlarms] = useState<AlarmSettingsType[]>([])
  const [activeAlarm, setActiveAlarm] = useState<AlarmSettingsType | null>(null)
  const [weatherData, setWeatherData] = useState<{
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      checkAlarms(now)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadWeather = () => {
      try {
        const data = getMockWeather()
        setWeatherData({
          temperature: data.current.temperature,
          condition: data.current.description,
          humidity: 70,
          windSpeed: 10
        })
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      }
    }
    loadWeather()
  }, [])

  const formatTime = (date: Date) => {
    const time = date.toLocaleTimeString("en-US", {
      timeZone: TORONTO_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      hourCycle: 'h12',
      hour12: !is24HourFormat,
    })
    return time.replace(/am|pm/i, match => match.toUpperCase())
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA", {
      timeZone: TORONTO_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const addTimeZone = (name: string, timeZone: string, countryCode: string) => {
    setAdditionalTimeZones([...additionalTimeZones, { name, timeZone, countryCode }])
  }

  const removeTimeZone = (index: number) => {
    setAdditionalTimeZones(additionalTimeZones.filter((_, i) => i !== index))
  }

  const reorderTimeZones = (fromIndex: number, toIndex: number) => {
    const newTimeZones = [...additionalTimeZones]
    const [removed] = newTimeZones.splice(fromIndex, 1)
    newTimeZones.splice(toIndex, 0, removed)
    setAdditionalTimeZones(newTimeZones)
  }

  const setAlarm = (alarm: AlarmSettingsType) => {
    setAlarms([...alarms, alarm])
  }

  const checkAlarms = (now: Date) => {
    const currentTimeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    const triggeredAlarm = alarms.find((alarm) => alarm.time === currentTimeString)

    if (triggeredAlarm && !activeAlarm) {
      setActiveAlarm(triggeredAlarm)
      triggerAlarm(triggeredAlarm)
    }
  }

  const triggerAlarm = (alarm: AlarmSettingsType) => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${alarm.sound}.mp3`
      audioRef.current.volume = alarm.volume / 100
      audioRef.current.play()
    }
  }

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setActiveAlarm(null)
    setAlarms(alarms.filter((alarm) => alarm.isRecurring))
  }

  return (
    <div className="relative w-[95vw] sm:w-full sm:max-w-4xl mx-auto">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-500 to-cyan-600 rounded-[2.1rem] opacity-40 blur-sm" />

      {/* Main container */}
      <div className="relative rounded-[2rem] overflow-hidden backdrop-blur-xl">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-100/80 dark:from-gray-900/95 dark:to-gray-900/80 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative px-4 sm:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Main display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-center flex flex-col items-center">
              <div className="text-[6rem] font-mono font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
                {formatTime(currentTime)}
              </div>
              <div 
                onClick={() => setIsCalendarOpen(true)}
                className="text-base font-normal text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer mt-1"
              >
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Components Container */}
          <div className="mt-8">
            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] border border-gray-200 dark:border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <WeatherDisplay />
                  {weatherData && <WeatherSuggestion {...weatherData} />}                  
                  <RadioPlayer />
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Additional clocks */}
                  <div className="space-y-2">
                    {additionalTimeZones.map((tz, index) => (
                      <AdditionalClock
                        key={`${tz.countryCode}-${tz.timeZone}`}
                        name={tz.name}
                        timeZone={tz.timeZone}
                        countryCode={tz.countryCode}
                        onRemove={() => removeTimeZone(index)}
                        onMoveUp={() => reorderTimeZones(index, Math.max(0, index - 1))}
                        onMoveDown={() => reorderTimeZones(index, Math.min(additionalTimeZones.length - 1, index + 1))}
                        is24HourFormat={is24HourFormat}
                        showSeconds={showSeconds}
                      />
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsAlarmOpen(true)}
                      className={cn(
                        "relative group overflow-hidden",
                        "h-10 sm:h-12 px-4 rounded-lg",
                        "bg-gradient-to-r from-gray-800/80 to-gray-800/60",
                        "border border-gray-200 dark:border-white/10 backdrop-blur-sm",
                        "transition-all duration-200",
                        "hover:border-white/20 hover:from-gray-800/90 hover:to-gray-700/80"
                      )}
                    >
                      <span className="relative z-10 text-gray-900 dark:text-white font-medium">Set Alarm</span>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    
                    <button
                      onClick={() => setIsAddTimeZoneOpen(true)}
                      className={cn(
                        "relative group overflow-hidden",
                        "h-10 sm:h-12 px-4 rounded-lg",
                        "bg-gradient-to-r from-gray-800/80 to-gray-800/60",
                        "border border-gray-200 dark:border-white/10 backdrop-blur-sm",
                        "transition-all duration-200",
                        "hover:border-white/20 hover:from-gray-800/90 hover:to-gray-700/80"
                      )}
                    >
                      <span className="relative z-10 text-gray-900 dark:text-white font-medium">Add Time Zone</span>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle inner border */}
        <div className="absolute inset-0 rounded-[2rem] border border-gray-200 dark:border-white/10 pointer-events-none" />
      </div>

      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>Select a date to view or set reminders</DialogDescription>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
                setIsCalendarOpen(false)
              }
            }}
            className="rounded-md border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white [&_button:hover]:bg-white/10 [&_button]:text-gray-900 dark:text-white [&_.rdp-day_button:hover]:bg-white/10 [&_.rdp-day_button]:text-gray-900 dark:text-white [&_.rdp-nav_button]:text-gray-900 dark:text-white [&_.rdp-head_cell]:text-gray-900 dark:text-gray-500 dark:text-white/60"
          />
        </DialogContent>
      </Dialog>

      {/* Other Dialogs */}
      <Dialog open={isAlarmOpen} onOpenChange={setIsAlarmOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Set Alarm</DialogTitle>
          </DialogHeader>
          <AlarmSettings onClose={() => setIsAlarmOpen(false)} is24HourFormat={is24HourFormat} onSetAlarm={setAlarm} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTimeZoneOpen} onOpenChange={setIsAddTimeZoneOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Add Time Zone</DialogTitle>
          </DialogHeader>
          <AddTimeZone onAdd={addTimeZone} onClose={() => setIsAddTimeZoneOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="24-hour-format">24-hour format</Label>
              <Switch id="24-hour-format" checked={is24HourFormat} onCheckedChange={setIs24HourFormat} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-seconds">Show seconds</Label>
              <Switch id="show-seconds" checked={showSeconds} onCheckedChange={setShowSeconds} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {activeAlarm && (
        <Dialog open={!!activeAlarm} onOpenChange={() => {}}>
          <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-gray-200 dark:border-white/10" >
            <DialogHeader>
              <DialogTitle>Alarm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-2xl font-bold text-center">{activeAlarm.label || "Alarm"}</p>
              <p className="text-xl text-center">{activeAlarm.time}</p>
              <div className="flex justify-center">
                <Button onClick={stopAlarm} className="bg-red-500 hover:bg-red-600 text-gray-900 dark:text-white">
                  Stop Alarm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <audio ref={audioRef} />
    </div>
  )
}

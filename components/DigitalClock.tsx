"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getMockWeather } from "@/lib/mockWeather"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import AlarmSettings, { type AlarmSettings as AlarmSettingsType } from "./AlarmSettings"
import AdditionalClock from "./AdditionalClock"
import AddTimeZone from "./AddTimeZone"
import WeatherSuggestion from "./WeatherSuggestion"
import WeatherDisplay from "./WeatherDisplay"
// import { cn } from "@/lib/utils" // not used in this component
import RadioPlayer from "./RadioPlayer"
import Soundscapes from "./Soundscapes"
import ThemeToggle from "./ThemeToggle"
import { ThemeSelect } from "./ThemeSelect"
import { Settings as SettingsIcon } from "lucide-react"
import GestureControls from "./GestureControls"
import { useSettings, type AppFont } from "@/context/SettingsContext"

const TORONTO_TIMEZONE = "America/Toronto"

const FONT_OPTIONS: Array<{ value: AppFont; label: string; description: string }> = [
  { value: 'inter', label: 'Inter', description: 'Clean & modern' },
  { value: 'roboto', label: 'Roboto', description: 'Balanced sans-serif' },
  { value: 'montserrat', label: 'Montserrat', description: 'Geometric & bold' },
  { value: 'lora', label: 'Lora', description: 'Elegant serif' },
  { value: 'space-grotesk', label: 'Space Grotesk', description: 'Techy display' },
]

const TEMPERATURE_UNIT_OPTIONS: Array<{ value: 'metric' | 'imperial'; label: string }> = [
  { value: 'metric', label: 'Celsius (°C)' },
  { value: 'imperial', label: 'Fahrenheit (°F)' },
]

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
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
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
  const { settings, setFont, setWeatherUnits } = useSettings()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      checkAlarms(now)
    }, 1000)
    return () => clearInterval(timer)
  }, [alarms, activeAlarm])

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
      hour: "numeric",
      minute: "numeric",
      second: showSeconds ? "numeric" : undefined,
      hourCycle: is24HourFormat ? 'h23' : 'h12',
      hour12: !is24HourFormat,
    })
    return time.replace(/am|pm/i, match => match.toUpperCase())
  }

  const getTimeDigits = (time: string) => {
    const [mainTime, period] = time.split(' ')
    const cleaned = mainTime.replace(/^0/, '')
    const digits = cleaned.split('')
    return { digits, period }
  }

  const currentTimeString = formatTime(currentTime)
  const { digits: timeDigits, period } = getTimeDigits(currentTimeString)
  const selectedFont = settings.app.font
  const temperatureUnits = settings.weather.units

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA", {
      timeZone: TORONTO_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'short',
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

  const handleDragStart = (index: number) => {
    setDraggingIndex(index)
    setDragOverIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggingIndex === null || draggingIndex === index) {
      setDragOverIndex(index)
      return
    }

    setAdditionalTimeZones(prev => {
      const updated = [...prev]
      const [moved] = updated.splice(draggingIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })

    setDraggingIndex(index)
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
    setDragOverIndex(null)
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
    <div className="relative mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
      <GestureControls
        onSwipeLeft={() => {
          // Previous theme
          toast.info("Theme navigation", { duration: 1000 })
        }}
        onSwipeRight={() => {
          // Next theme
          toast.info("Theme navigation", { duration: 1000 })
        }}
        onSwipeUp={() => {
          // Open settings
          setIsSettingsOpen(true)
          toast.info("Settings opened", { duration: 1000 })
        }}
        onSwipeDown={() => {
          // Close any open dialogs
          setIsAlarmOpen(false)
          setIsAddTimeZoneOpen(false)
          setIsSettingsOpen(false)
          setIsCalendarOpen(false)
          toast.info("Dialogs closed", { duration: 1000 })
        }}
        onDoubleTap={() => {
          // Quick alarm toggle
          setIsAlarmOpen(true)
          toast.info("Quick alarm", { duration: 1000 })
        }}
        onLongPress={() => {
          // Toggle 24-hour format
          setIs24HourFormat(!is24HourFormat)
          toast.info(`Switched to ${!is24HourFormat ? '24-hour' : '12-hour'} format`, { duration: 1500 })
        }}
        showHints={true}
      >
        <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

        <div className="relative flex flex-col gap-8 px-6 py-8 sm:px-9 sm:py-9 lg:px-12 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ThemeSelect />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Settings"
                className="relative rounded-full h-10 w-10 flex items-center justify-center border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              <ThemeToggle className="bg-white/5 hover:bg-white/10" />
            </div>
          </div>

          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glassmorphic Clock Panel */}
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative px-8 py-6 sm:px-10 sm:py-7">
                <div className="mb-4 text-center text-sm font-medium text-white/70 uppercase tracking-[0.28em]">
                  {formatDate(currentTime)}
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <AnimatePresence mode="popLayout">
                    {timeDigits.map((digit, index) => (
                      <motion.span
                        key={`${digit}-${index}-${currentTimeString}`}
                        className="text-[clamp(3.5rem,8vw,5.5rem)] font-mono font-bold tracking-tight text-white leading-none"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        style={{ textShadow: '0 12px 32px rgba(0, 0, 0, 0.55)' }}
                      >
                        {digit}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {period && (
                    <motion.span
                      className="ml-2 text-[clamp(1.2rem,3vw,2rem)] font-semibold text-white/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {period}
                    </motion.span>
                  )}
                </div>
                {showSeconds && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTime.getSeconds()}
                      className="mt-2 text-center text-white/60 text-lg font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentTime.getSeconds().toString().padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                )}

              </div>
            </motion.div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-8">
            <div className="space-y-6">
              <WeatherDisplay />
              {weatherData && (
                <motion.div
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Focus for today</h3>
                    <WeatherSuggestion {...weatherData} />
                  </div>
                </motion.div>
              )}
              <RadioPlayer />
              <Soundscapes />
            </div>

            <div className="flex flex-col gap-5">
              <motion.div
                className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)] mt-10"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">World Clocks</h3>
                    <button
                      onClick={() => setIsAddTimeZoneOpen(true)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
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
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggingIndex === index}
                        isDragOver={dragOverIndex === index}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setIsAlarmOpen(true)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <span className="relative z-10">Set Alarm</span>
                  <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
            className="rounded-md border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white [&_button:hover]:bg-white/10 dark:[&_button:hover]:bg-white/5 [&_button]:text-gray-900 dark:[&_button]:text-white [&_.rdp-day_button:hover]:bg-white/10 dark:[&_.rdp-day_button:hover]:bg-white/5 [&_.rdp-day_button]:text-gray-900 dark:[&_.rdp-day_button]:text-white [&_.rdp-nav_button]:text-gray-900 dark:[&_.rdp-nav_button]:text-white [&_.rdp-head_cell]:text-gray-900 dark:[&_.rdp-head_cell]:text-white/60"
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
              <div className="space-y-2">
                <Label htmlFor="font-choice">Font</Label>
                <Select value={selectedFont} onValueChange={(value) => setFont(value as AppFont)}>
                  <SelectTrigger id="font-choice" className="w-full border-white/15 bg-white/5 text-left text-white/80">
                    <SelectValue placeholder="Choose a font" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur border border-white/10">
                    {FONT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white/80">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{option.label}</span>
                          <span className="text-xs text-white/50">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature-units">Temperature Units</Label>
                <Select value={temperatureUnits} onValueChange={(value) => setWeatherUnits(value as 'metric' | 'imperial')}>
                  <SelectTrigger id="temperature-units" className="w-full border-white/15 bg-white/5 text-left text-white/80">
                    <SelectValue placeholder="Choose units" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur border border-white/10">
                    {TEMPERATURE_UNIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white/80">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
      </GestureControls>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { radioStations } from "@/lib/radioStations"
import { alarmSounds as builtInSounds } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { Bell, Radio, Volume2 } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

interface AlarmSettingsProps {
  onClose: () => void
  is24HourFormat: boolean
  onSetAlarm: (alarm: AlarmSettings) => void
}

export interface AlarmSettings {
  time: string
  label: string
  isRecurring: boolean
  sound: string
  volume: number
  showNotification: boolean
  reminderDate?: Date
}
type AlarmSoundValue = string

export default function AlarmSettings({ onClose, onSetAlarm }: AlarmSettingsProps) {
  const [alarmTime, setAlarmTime] = useState("")
  const [alarmLabel, setAlarmLabel] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [alarmSound, setAlarmSound] = useState<AlarmSoundValue>("classic")
  const [volume, setVolume] = useState(50)
  const [showNotification, setShowNotification] = useState(true)
  const [reminderDate, setReminderDate] = useState<Date | undefined>()

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications")
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      setShowNotification(true)
    } else {
      setShowNotification(false)
    }
  }

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setShowNotification(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAlarm: AlarmSettings = {
      time: alarmTime,
      label: alarmLabel,
      isRecurring,
      sound: alarmSound,
      volume,
      showNotification,
      reminderDate,
    }
    onSetAlarm(newAlarm)
    onClose()
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative overflow-hidden rounded-xl p-6 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95" />
        <div className="relative space-y-6">
          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground/80">
              Alarm Time
            </Label>
            <div className="relative">
              <Input
                id="time"
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className={cn(
                  "bg-foreground/5 border-border/10",
                  "text-foreground placeholder:text-foreground/50",
                  "focus:border-border/20 focus:ring-0",
                  "h-12 px-4 rounded-lg",
                )}
                required
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label" className="text-foreground/80">
              Alarm Label (Optional)
            </Label>
            <Input
              id="label"
              type="text"
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
              className={cn(
                "bg-foreground/5 border-border/10",
                "text-foreground placeholder:text-foreground/50",
                "focus:border-border/20 focus:ring-0",
                "h-12 px-4 rounded-lg",
              )}
              placeholder="Enter alarm label"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sound" className="text-foreground/80">
              Alarm Sound
            </Label>
            <Select onValueChange={setAlarmSound} value={alarmSound}>
              <SelectTrigger
                id="sound"
                className={cn(
                  "bg-foreground/5 border-border/10",
                  "text-foreground placeholder:text-foreground/50",
                  "focus:border-border/20 focus:ring-0",
                  "h-12 px-4 rounded-lg",
                )}
              >
                <SelectValue placeholder="Select alarm sound" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-foreground border-border/10">
                <SelectGroup>
                  <SelectLabel className="text-foreground/60">Built-in Tones</SelectLabel>
                  {Object.entries(builtInSounds).map(([value, info]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        {info.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="mt-2 text-foreground/60">Radio Stations</SelectLabel>
                  {radioStations.map((station) => (
                    <SelectItem key={station.id} value={`radio:${station.id}`}>
                      <div className="flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        <span>{station.name}</span>
                        <span className="text-foreground/40 text-xs">{station.genre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-foreground/50">
              Streaming alarms require an internet connection. If a station cannot connect, we automatically fall back to the Classic Bell tone.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume" className="text-foreground/80">
              Alarm Volume
            </Label>
            <div className="flex items-center gap-3 px-1">
              <Volume2 className="h-4 w-4 text-foreground/60" />
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                className="flex-grow"
              />
              <span className="text-foreground/60 text-sm tabular-nums w-9">{volume}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-date" className="text-foreground/80">
              Reminder Date (Optional)
            </Label>
            <Input
              id="reminder-date"
              type="date"
              value={reminderDate ? reminderDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setReminderDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={new Date().toISOString().split('T')[0]}
              className={cn(
                "bg-foreground/5 border-border/10",
                "text-foreground placeholder:text-foreground/50",
                "focus:border-border/20 focus:ring-0",
                "h-12 px-4 rounded-lg",
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-foreground/80">
                Show Notifications
              </Label>
              <p className="text-xs text-foreground/50">Get popup notifications when the alarm triggers</p>
            </div>
            <Switch
              id="notifications"
              checked={showNotification}
              onCheckedChange={(checked) => {
                if (checked) {
                  requestNotificationPermission()
                } else {
                  setShowNotification(false)
                }
              }}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recurring" className="text-foreground/80">
              Recurring Alarm
            </Label>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className={cn(
            "border-border/10 text-foreground/80",
            "hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={cn(
            "bg-gradient-to-r from-cyan-500 to-purple-500",
            "text-foreground font-medium",
            "border-0",
            "hover:from-cyan-600 hover:to-purple-600",
            "focus:ring-0",
          )}
        >
          Set Alarm
        </Button>
      </div>
    </form>
  )
}

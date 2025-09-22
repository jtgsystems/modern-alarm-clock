"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getRadioStationById } from '@/lib/radioStations'
import { alarmSounds as builtInSounds, type AlarmSound as BuiltInAlarmSound } from '@/lib/sounds'
import { useNotification } from './use-notification'

export interface AlarmSettings {
  time: string
  label: string
  isRecurring: boolean
  showNotification: boolean
  reminderDate?: Date
  sound?: string
  volume?: number
}

export interface Alarm {
  id: string
  time: string
  label: string
  sound?: string
  volume?: number
  isRecurring?: boolean
  showNotification?: boolean
  reminderDate?: Date
}

interface UseAlarmProps {
  initialAlarms?: Alarm[]
  enableNotifications?: boolean
}

export function useAlarm({ initialAlarms = [], enableNotifications = true }: UseAlarmProps = {}) {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms)
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const notification = useNotification({ title: 'Alarm Clock', icon: '/alarm-icon.png' })

  useEffect(() => {
    if (enableNotifications) {
      notification.requestPermission()
    }
  }, [notification, enableNotifications])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setActiveAlarm(null)
  }, [])

  const triggerAlarm = useCallback((alarm: Alarm) => {
    const volume = Math.min(Math.max(alarm.volume ?? 50, 0), 100) / 100

    const playBuiltIn = (soundKey: BuiltInAlarmSound = "classic") => {
      const entry = builtInSounds[soundKey] ?? builtInSounds.classic
      const audio = new Audio(entry.url)
      audio.volume = volume
      audio.loop = true
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = audio
      audio.play().catch(() => {
        if (soundKey !== "classic") {
          const fallback = new Audio(builtInSounds.classic.url)
          fallback.volume = volume
          fallback.loop = true
          audioRef.current = fallback
          fallback.play()
        }
      })
    }

    const playRadio = async (stationId: string) => {
      const station = getRadioStationById(stationId)
      if (!station) throw new Error('Unknown station')
      const audio = new Audio(station.url)
      audio.volume = volume
      audio.loop = true
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = audio
      await audio.play()
      toast.success(`Streaming ${station.name} for this alarm`)
    }

    const start = async () => {
      const soundId = alarm.sound || "classic"
      if (soundId.startsWith('radio:')) {
        const stationId = soundId.split(':')[1]
        try {
          await playRadio(stationId)
        } catch {
          toast.error('Could not reach radio stream. Falling back to Classic Bell.')
          playBuiltIn('classic')
        }
      } else {
        playBuiltIn(soundId as BuiltInAlarmSound)
      }
    }

    start().catch(() => {
      playBuiltIn('classic')
    })

    if (alarm.showNotification && enableNotifications) {
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
  }, [notification, stopAlarm, enableNotifications])

  const setAlarm = useCallback((settings: AlarmSettings) => {
    const newAlarm: Alarm = {
      ...settings,
      id: crypto.randomUUID(),
    }

    setAlarms(prev => [...prev, newAlarm])

    toast.success("Alarm set successfully", {
      description: settings.reminderDate
        ? `Set for ${settings.reminderDate.toLocaleDateString()} at ${settings.time}`
        : `Set for ${settings.time}`
    })
  }, [])

  const removeAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id))
  }, [])

  const snoozeAlarm = useCallback((duration: number, currentTime: Date) => {
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
  }, [activeAlarm, stopAlarm])

  const checkAlarms = useCallback((now: Date) => {
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
      triggerAlarm(triggeredAlarm)
    }
  }, [alarms, activeAlarm, triggerAlarm])

  return {
    alarms,
    activeAlarm,
    setAlarm,
    removeAlarm,
    stopAlarm,
    snoozeAlarm,
    checkAlarms,
    audioRef
  }
}

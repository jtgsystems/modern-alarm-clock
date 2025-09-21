"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// 2025 Modern State Management with Zustand
// Following latest patterns: TypeScript-first, Immer for immutability, persistence

export interface AlarmSettings {
  id: string
  time: string
  label: string
  enabled: boolean
  days: boolean[]
  soundUrl?: string
  volume: number
  snoozeEnabled: boolean
  snoozeDuration: number
  createdAt: Date
  updatedAt: Date
}

export interface TimeZone {
  name: string
  timeZone: string
  countryCode: string
}

export interface AppSettings {
  is24HourFormat: boolean
  showSeconds: boolean
  autoTheme: boolean
  weatherEnabled: boolean
  gesturesEnabled: boolean
  notificationsEnabled: boolean
  soundEnabled: boolean
}

interface AlarmStore {
  // State
  alarms: AlarmSettings[]
  additionalTimeZones: TimeZone[]
  settings: AppSettings

  // UI State
  activeModal: string | null
  selectedDate: Date

  // Actions - Modern 2025 pattern: grouped by functionality
  alarm: {
    add: (alarm: Omit<AlarmSettings, 'id' | 'createdAt' | 'updatedAt'>) => void
    remove: (id: string) => void
    update: (id: string, updates: Partial<AlarmSettings>) => void
    toggle: (id: string) => void
    snooze: (id: string) => void
  }

  timezone: {
    add: (timezone: TimeZone) => void
    remove: (name: string) => void
    reorder: (from: number, to: number) => void
  }

  ui: {
    setModal: (modal: string | null) => void
    setSelectedDate: (date: Date) => void
  }

  settingsActions: {
    update: (updates: Partial<AppSettings>) => void
    reset: () => void
  }
}

// Default settings following 2025 best practices
const defaultSettings: AppSettings = {
  is24HourFormat: false,
  showSeconds: false,
  autoTheme: true,
  weatherEnabled: true,
  gesturesEnabled: true,
  notificationsEnabled: true,
  soundEnabled: true
}

const defaultTimeZones: TimeZone[] = [
  { name: "Toronto", timeZone: "America/Toronto", countryCode: "CA" },
  { name: "New York", timeZone: "America/New_York", countryCode: "US" },
  { name: "Los Angeles", timeZone: "America/Los_Angeles", countryCode: "US" },
  { name: "London", timeZone: "Europe/London", countryCode: "GB" },
  { name: "Paris", timeZone: "Europe/Paris", countryCode: "FR" },
  { name: "Tokyo", timeZone: "Asia/Tokyo", countryCode: "JP" },
]

// 2025 Modern Zustand Store with Immer and Persistence
export const useAlarmStore = create<AlarmStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      alarms: [],
      additionalTimeZones: defaultTimeZones,
      settings: defaultSettings,
      activeModal: null,
      selectedDate: new Date(),

      // Alarm Actions
      alarm: {
        add: (alarmData) => set((state) => {
          const newAlarm: AlarmSettings = {
            ...alarmData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
          state.alarms.push(newAlarm)
        }),

        remove: (id) => set((state) => {
          state.alarms = state.alarms.filter(alarm => alarm.id !== id)
        }),

        update: (id, updates) => set((state) => {
          const alarm = state.alarms.find(a => a.id === id)
          if (alarm) {
            Object.assign(alarm, updates, { updatedAt: new Date() })
          }
        }),

        toggle: (id) => set((state) => {
          const alarm = state.alarms.find(a => a.id === id)
          if (alarm) {
            alarm.enabled = !alarm.enabled
            alarm.updatedAt = new Date()
          }
        }),

        snooze: (id) => set((state) => {
          const alarm = state.alarms.find(a => a.id === id)
          if (alarm && alarm.snoozeEnabled) {
            // Add snooze duration to current time
            const currentTime = new Date()
            currentTime.setMinutes(currentTime.getMinutes() + alarm.snoozeDuration)
            alarm.time = currentTime.toTimeString().slice(0, 5)
            alarm.updatedAt = new Date()
          }
        })
      },

      // Timezone Actions
      timezone: {
        add: (timezone) => set((state) => {
          if (!state.additionalTimeZones.find(tz => tz.name === timezone.name)) {
            state.additionalTimeZones.push(timezone)
          }
        }),

        remove: (name) => set((state) => {
          state.additionalTimeZones = state.additionalTimeZones.filter(tz => tz.name !== name)
        }),

        reorder: (from, to) => set((state) => {
          const [moved] = state.additionalTimeZones.splice(from, 1)
          state.additionalTimeZones.splice(to, 0, moved)
        })
      },

      // UI Actions
      ui: {
        setModal: (modal) => set((state) => {
          state.activeModal = modal
        }),

        setSelectedDate: (date) => set((state) => {
          state.selectedDate = date
        })
      },

      // Settings Actions
      settingsActions: {
        update: (updates) => set((state) => {
          Object.assign(state.settings, updates)
        }),

        reset: () => set((state) => {
          state.settings = { ...defaultSettings }
        })
      }
    })),
    {
      name: 'modern-alarm-storage', // 2025: Descriptive storage key
      storage: createJSONStorage(() => localStorage),
      // 2025: Selective persistence - only persist what's needed
      partialize: (state) => ({
        alarms: state.alarms,
        additionalTimeZones: state.additionalTimeZones,
        settings: state.settings
        // Don't persist UI state like activeModal, selectedDate
      }),
      version: 1, // 2025: Version for future migrations
    }
  )
)

// 2025 Modern Selectors - Memoized for performance
export const useAlarms = () => useAlarmStore(state => state.alarms)
export const useActiveAlarms = () => useAlarmStore(state =>
  state.alarms.filter(alarm => alarm.enabled)
)
export const useTimeZones = () => useAlarmStore(state => state.additionalTimeZones)
export const useAppSettings = () => useAlarmStore(state => state.settings)
export const useActiveModal = () => useAlarmStore(state => state.activeModal)

// 2025 Modern Actions - Direct exports for cleaner component usage
export const alarmActions = () => useAlarmStore(state => state.alarm)
export const timezoneActions = () => useAlarmStore(state => state.timezone)
export const uiActions = () => useAlarmStore(state => state.ui)
export const settingsActions = () => useAlarmStore(state => state.settingsActions)

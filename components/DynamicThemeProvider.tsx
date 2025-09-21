"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface TimeBasedTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    gradient: string
  }
  atmosphere: string
}

const TIME_THEMES: Record<string, TimeBasedTheme> = {
  midnight: {
    name: 'Midnight Dreams',
    colors: {
      primary: 'from-slate-900 to-blue-950',
      secondary: 'from-blue-900/20 to-indigo-900/20',
      accent: 'rgb(56, 189, 248)',
      gradient: 'from-blue-600/30 via-purple-600/20 to-slate-900/30'
    },
    atmosphere: 'Deep, contemplative, stellar'
  },
  dawn: {
    name: 'Aurora Dawn',
    colors: {
      primary: 'from-orange-100 to-pink-200',
      secondary: 'from-amber-200/30 to-orange-300/30',
      accent: 'rgb(251, 146, 60)',
      gradient: 'from-orange-400/40 via-pink-400/30 to-amber-300/20'
    },
    atmosphere: 'Warm, energizing, hopeful'
  },
  morning: {
    name: 'Morning Light',
    colors: {
      primary: 'from-sky-50 to-blue-100',
      secondary: 'from-blue-100/40 to-cyan-100/40',
      accent: 'rgb(14, 165, 233)',
      gradient: 'from-sky-300/50 via-blue-300/40 to-cyan-200/30'
    },
    atmosphere: 'Fresh, clear, productive'
  },
  afternoon: {
    name: 'Golden Hour',
    colors: {
      primary: 'from-amber-50 to-yellow-100',
      secondary: 'from-yellow-200/30 to-amber-200/30',
      accent: 'rgb(245, 158, 11)',
      gradient: 'from-yellow-300/50 via-amber-300/40 to-orange-200/30'
    },
    atmosphere: 'Bright, vibrant, active'
  },
  evening: {
    name: 'Sunset Glow',
    colors: {
      primary: 'from-purple-900 to-pink-900',
      secondary: 'from-orange-500/20 to-red-500/20',
      accent: 'rgb(244, 114, 182)',
      gradient: 'from-orange-500/40 via-pink-500/30 to-purple-600/20'
    },
    atmosphere: 'Warm, relaxing, romantic'
  },
  night: {
    name: 'Deep Night',
    colors: {
      primary: 'from-gray-900 to-slate-900',
      secondary: 'from-slate-800/30 to-gray-800/30',
      accent: 'rgb(148, 163, 184)',
      gradient: 'from-slate-600/30 via-gray-600/20 to-slate-800/30'
    },
    atmosphere: 'Calm, peaceful, restful'
  }
}

interface DynamicThemeContextType {
  currentTheme: TimeBasedTheme
  timeOfDay: string
  getThemeForTime: (hour: number) => TimeBasedTheme
}

const DynamicThemeContext = createContext<DynamicThemeContextType | undefined>(undefined)

interface DynamicThemeProviderProps {
  children: ReactNode
}

export function DynamicThemeProvider({ children }: DynamicThemeProviderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getThemeForTime = (hour: number): TimeBasedTheme => {
    if (hour >= 0 && hour < 5) return TIME_THEMES.midnight
    if (hour >= 5 && hour < 7) return TIME_THEMES.dawn
    if (hour >= 7 && hour < 12) return TIME_THEMES.morning
    if (hour >= 12 && hour < 17) return TIME_THEMES.afternoon
    if (hour >= 17 && hour < 20) return TIME_THEMES.evening
    return TIME_THEMES.night
  }

  const currentHour = currentTime.getHours()
  const currentTheme = getThemeForTime(currentHour)
  const timeOfDay = getTimeOfDayLabel(currentHour)

  function getTimeOfDayLabel(hour: number): string {
    if (hour >= 0 && hour < 5) return 'Late Night'
    if (hour >= 5 && hour < 7) return 'Dawn'
    if (hour >= 7 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 20) return 'Evening'
    return 'Night'
  }

  return (
    <DynamicThemeContext.Provider value={{ currentTheme, timeOfDay, getThemeForTime }}>
      {children}
    </DynamicThemeContext.Provider>
  )
}

export function useDynamicTheme() {
  const context = useContext(DynamicThemeContext)
  if (context === undefined) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider')
  }
  return context
}
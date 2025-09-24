"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSettings } from '@/context/SettingsContext'

export interface TimeBasedTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    gradient: string
  }
  atmosphere: string
}

type TimePeriod = 'midnight' | 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'

const TIME_THEMES: Record<string, Record<TimePeriod, TimeBasedTheme>> = {
  cyberpunk: {
    midnight: {
      name: 'Cyber Midnight',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-cyberpunk-accent/20 to-cyberpunk-secondary-accent/20',
        accent: '#00ffff',
        gradient: 'from-cyberpunk-accent/30 via-cyberpunk-secondary-accent/20 to-cyberpunk-primary/30'
      },
      atmosphere: 'Cool neon cyberpunk night'
    },
    dawn: {
      name: 'Cyber Dawn',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-orange-400/30 to-gold-400/30',
        accent: '#ff9500',
        gradient: 'from-orange-500/40 via-gold-500/30 to-cyberpunk-primary/20'
      },
      atmosphere: 'Warm cyberpunk dawn with gold accents'
    },
    morning: {
      name: 'Cyber Morning',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-orange-300/40 to-gold-300/40',
        accent: '#ff9500',
        gradient: 'from-orange-400/50 via-gold-400/40 to-cyberpunk-primary/30'
      },
      atmosphere: 'Bright cyberpunk morning glow'
    },
    afternoon: {
      name: 'Cyber Afternoon',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-gold-200/30 to-orange-200/30',
        accent: '#ffd700',
        gradient: 'from-gold-300/50 via-orange-300/40 to-cyberpunk-primary/30'
      },
      atmosphere: 'Vibrant cyberpunk afternoon'
    },
    evening: {
      name: 'Cyber Evening',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-cyberpunk-secondary-accent/20 to-orange-500/20',
        accent: '#8a2be2',
        gradient: 'from-cyberpunk-secondary-accent/40 via-orange-500/30 to-cyberpunk-primary/20'
      },
      atmosphere: 'Twilight cyberpunk with purple neons'
    },
    night: {
      name: 'Cyber Night',
      colors: {
        primary: 'from-cyberpunk-background to-cyberpunk-primary',
        secondary: 'from-cyberpunk-primary/30 to-cyberpunk-background/30',
        accent: '#00ffff',
        gradient: 'from-cyberpunk-accent/30 via-cyberpunk-secondary-accent/20 to-cyberpunk-background/30'
      },
      atmosphere: 'Deep cyberpunk night with cyan neons'
    }
  },
  'neon-blue': {
    midnight: {
      name: 'Neon Blue Midnight',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-neon-blue-accent/20 to-blue-500/20',
        accent: '#00ffff',
        gradient: 'from-neon-blue-accent/30 via-blue-500/20 to-neon-blue-primary/30'
      },
      atmosphere: 'Cool neon blue night'
    },
    dawn: {
      name: 'Neon Blue Dawn',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-orange-400/30 to-yellow-400/30',
        accent: '#ffd700',
        gradient: 'from-orange-500/40 via-yellow-500/30 to-neon-blue-primary/20'
      },
      atmosphere: 'Warm neon blue dawn'
    },
    morning: {
      name: 'Neon Blue Morning',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-blue-300/40 to-cyan-300/40',
        accent: '#00b0ff',
        gradient: 'from-blue-400/50 via-cyan-400/40 to-neon-blue-primary/30'
      },
      atmosphere: 'Bright neon blue morning'
    },
    afternoon: {
      name: 'Neon Blue Afternoon',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-yellow-200/30 to-blue-200/30',
        accent: '#00d4ff',
        gradient: 'from-yellow-300/50 via-blue-300/40 to-neon-blue-primary/30'
      },
      atmosphere: 'Vibrant neon blue afternoon'
    },
    evening: {
      name: 'Neon Blue Evening',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-blue-500/20 to-purple-500/20',
        accent: '#6366f1',
        gradient: 'from-blue-500/40 via-purple-500/30 to-neon-blue-primary/20'
      },
      atmosphere: 'Twilight neon blue with purple'
    },
    night: {
      name: 'Neon Blue Night',
      colors: {
        primary: 'from-neon-blue-background to-neon-blue-primary',
        secondary: 'from-neon-blue-primary/30 to-neon-blue-background/30',
        accent: '#00ffff',
        gradient: 'from-neon-blue-accent/30 via-blue-500/20 to-neon-blue-background/30'
      },
      atmosphere: 'Deep neon blue night'
    }
  },
  'purple-glow': {
    midnight: {
      name: 'Purple Glow Midnight',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-purple-glow-accent/20 to-purple-600/20',
        accent: '#a855f7',
        gradient: 'from-purple-glow-accent/30 via-purple-600/20 to-purple-glow-primary/30'
      },
      atmosphere: 'Cool purple glow night'
    },
    dawn: {
      name: 'Purple Glow Dawn',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-pink-400/30 to-purple-400/30',
        accent: '#ec4899',
        gradient: 'from-pink-500/40 via-purple-500/30 to-purple-glow-primary/20'
      },
      atmosphere: 'Warm purple glow dawn'
    },
    morning: {
      name: 'Purple Glow Morning',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-purple-300/40 to-pink-300/40',
        accent: '#c084fc',
        gradient: 'from-purple-400/50 via-pink-400/40 to-purple-glow-primary/30'
      },
      atmosphere: 'Bright purple glow morning'
    },
    afternoon: {
      name: 'Purple Glow Afternoon',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-pink-200/30 to-purple-200/30',
        accent: '#d946ef',
        gradient: 'from-pink-300/50 via-purple-300/40 to-purple-glow-primary/30'
      },
      atmosphere: 'Vibrant purple glow afternoon'
    },
    evening: {
      name: 'Purple Glow Evening',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-purple-glow-secondary-accent/20 to-pink-500/20',
        accent: '#8b5cf6',
        gradient: 'from-purple-glow-secondary-accent/40 via-pink-500/30 to-purple-glow-primary/20'
      },
      atmosphere: 'Twilight purple glow with pink'
    },
    night: {
      name: 'Purple Glow Night',
      colors: {
        primary: 'from-purple-glow-background to-purple-glow-primary',
        secondary: 'from-purple-glow-primary/30 to-purple-glow-background/30',
        accent: '#a855f7',
        gradient: 'from-purple-glow-accent/30 via-purple-600/20 to-purple-glow-background/30'
      },
      atmosphere: 'Deep purple glow night'
    }
  },
  light: {
    midnight: {
      name: 'Light Midnight',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-gray-800/20 to-gray-700/20',
        accent: '#3b82f6',
        gradient: 'from-gray-800/30 via-gray-700/20 to-light-primary/30'
      },
      atmosphere: 'Soft light night'
    },
    dawn: {
      name: 'Light Dawn',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-orange-400/30 to-yellow-400/30',
        accent: '#f59e0b',
        gradient: 'from-orange-500/40 via-yellow-500/30 to-light-primary/20'
      },
      atmosphere: 'Warm light dawn'
    },
    morning: {
      name: 'Light Morning',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-blue-300/40 to-cyan-300/40',
        accent: '#06b6d4',
        gradient: 'from-blue-400/50 via-cyan-400/40 to-light-primary/30'
      },
      atmosphere: 'Bright light morning'
    },
    afternoon: {
      name: 'Light Afternoon',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-yellow-200/30 to-orange-200/30',
        accent: '#f97316',
        gradient: 'from-yellow-300/50 via-orange-300/40 to-light-primary/30'
      },
      atmosphere: 'Vibrant light afternoon'
    },
    evening: {
      name: 'Light Evening',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-purple-500/20 to-pink-500/20',
        accent: '#8b5cf6',
        gradient: 'from-purple-500/40 via-pink-500/30 to-light-primary/20'
      },
      atmosphere: 'Twilight light with purple'
    },
    night: {
      name: 'Light Night',
      colors: {
        primary: 'from-light-background to-light-primary',
        secondary: 'from-gray-600/30 to-gray-700/30',
        accent: '#3b82f6',
        gradient: 'from-gray-600/30 via-gray-700/20 to-light-background/30'
      },
      atmosphere: 'Soft light night'
    }
  },
  dark: {
    midnight: {
      name: 'Dark Midnight',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-gray-800/20 to-gray-700/20',
        accent: '#60a5fa',
        gradient: 'from-gray-800/30 via-gray-700/20 to-dark-primary/30'
      },
      atmosphere: 'Deep dark night'
    },
    dawn: {
      name: 'Dark Dawn',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-orange-400/30 to-yellow-400/30',
        accent: '#fbbf24',
        gradient: 'from-orange-500/40 via-yellow-500/30 to-dark-primary/20'
      },
      atmosphere: 'Warm dark dawn'
    },
    morning: {
      name: 'Dark Morning',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-blue-300/40 to-cyan-300/40',
        accent: '#0ea5e9',
        gradient: 'from-blue-400/50 via-cyan-400/40 to-dark-primary/30'
      },
      atmosphere: 'Bright dark morning'
    },
    afternoon: {
      name: 'Dark Afternoon',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-yellow-200/30 to-orange-200/30',
        accent: '#f97316',
        gradient: 'from-yellow-300/50 via-orange-300/40 to-dark-primary/30'
      },
      atmosphere: 'Vibrant dark afternoon'
    },
    evening: {
      name: 'Dark Evening',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-purple-500/20 to-pink-500/20',
        accent: '#a78bfa',
        gradient: 'from-purple-500/40 via-pink-500/30 to-dark-primary/20'
      },
      atmosphere: 'Twilight dark with purple'
    },
    night: {
      name: 'Dark Night',
      colors: {
        primary: 'from-dark-background to-dark-primary',
        secondary: 'from-gray-600/30 to-gray-700/30',
        accent: '#60a5fa',
        gradient: 'from-gray-600/30 via-gray-700/20 to-dark-background/30'
      },
      atmosphere: 'Deep dark night'
    }
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
  const { settings } = useSettings()
  const [currentTime, setCurrentTime] = useState(new Date())
  const baseTheme = settings.app.theme

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getTimePeriod = (hour: number): TimePeriod => {
    if (hour >= 0 && hour < 5) return 'midnight'
    if (hour >= 5 && hour < 7) return 'dawn'
    if (hour >= 7 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'evening'
    return 'night'
  }

  const getThemeForTime = (hour: number): TimeBasedTheme => {
    const period = getTimePeriod(hour)
    const themeConfig = TIME_THEMES[baseTheme]
    if (!themeConfig) {
      // Fallback to default cyberpunk
      const fallbackConfig = TIME_THEMES['cyberpunk']
      return fallbackConfig[period] || fallbackConfig.midnight
    }
    return themeConfig[period] || themeConfig.midnight
  }

  const currentHour = currentTime.getHours()
  const currentTheme = getThemeForTime(currentHour)
  const timePeriod = getTimePeriod(currentHour)
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

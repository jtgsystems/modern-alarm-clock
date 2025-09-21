"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type AppTheme = 'midnight' | 'aurora' | 'sunset' | 'slate'

export interface SettingsSchema {
  app: {
    timeFormat: '12h' | '24h'
    showSeconds: boolean
    theme: AppTheme
  }
  weather: {
    provider: 'mock' | 'openweather'
    city: string
    units: 'metric' | 'imperial'
    showForecast: boolean
  }
  audio: {
    radioVolume: number // 0..1
    alarmRamp: { enabled: boolean; durationMs: number }
    sfxMix: { active: string[]; volumes: Record<string, number> }
  }
  clocks: Array<{ name: string; timeZone: string; countryCode: string }>
}

const DEFAULT_SETTINGS: SettingsSchema = {
  app: { timeFormat: '12h', showSeconds: false, theme: 'midnight' },
  weather: { provider: 'mock', city: 'New York', units: 'metric', showForecast: true },
  audio: { radioVolume: 0.5, alarmRamp: { enabled: true, durationMs: 8000 }, sfxMix: { active: [], volumes: {} } },
  clocks: [
    { name: 'Toronto', timeZone: 'America/Toronto', countryCode: 'CA' },
  ],
}

type SettingsContextType = {
  settings: SettingsSchema
  update: (patch: Partial<SettingsSchema>) => void
  setTheme: (t: AppTheme) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

const STORAGE_KEY = 'app-settings-v1'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsSchema>(DEFAULT_SETTINGS)

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
        if (parsed?.app?.theme) document.documentElement.setAttribute('data-theme', parsed.app.theme)
      } else {
        document.documentElement.setAttribute('data-theme', DEFAULT_SETTINGS.app.theme)
      }
    } catch {
      document.documentElement.setAttribute('data-theme', DEFAULT_SETTINGS.app.theme)
    }
  }, [])

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  const update = useCallback((patch: Partial<SettingsSchema>) => {
    setSettings(prev => ({ ...prev, ...patch, app: { ...prev.app, ...(patch as any).app }, weather: { ...prev.weather, ...(patch as any).weather }, audio: { ...prev.audio, ...(patch as any).audio }, clocks: (patch as any).clocks ?? prev.clocks }))
  }, [])

  const setTheme = useCallback((t: AppTheme) => {
    setSettings(prev => ({ ...prev, app: { ...prev.app, theme: t } }))
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const value = useMemo<SettingsContextType>(() => ({ settings, update, setTheme }), [settings, update, setTheme])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}


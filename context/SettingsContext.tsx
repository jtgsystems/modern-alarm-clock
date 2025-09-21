"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type AppTheme = 'midnight' | 'aurora' | 'sunset' | 'slate'
export type AppFont = 'inter' | 'roboto' | 'montserrat' | 'lora' | 'space-grotesk'

export interface SettingsSchema {
  app: {
    timeFormat: '12h' | '24h'
    showSeconds: boolean
    theme: AppTheme
    font: AppFont
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
  app: { timeFormat: '12h', showSeconds: false, theme: 'midnight', font: 'inter' },
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
  setFont: (font: AppFont) => void
  setWeatherUnits: (units: 'metric' | 'imperial') => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

const STORAGE_KEY = 'app-settings-v1'

const FONT_VARIABLES: Record<AppFont, string> = {
  inter: 'var(--font-inter)',
  roboto: 'var(--font-roboto)',
  montserrat: 'var(--font-montserrat)',
  lora: 'var(--font-lora)',
  'space-grotesk': 'var(--font-space-grotesk)',
}

const applyFont = (font: AppFont) => {
  const cssVar = FONT_VARIABLES[font] ?? FONT_VARIABLES.inter
  document.documentElement.style.setProperty('--app-font-family', cssVar)
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsSchema>(DEFAULT_SETTINGS)

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        const hydrated: SettingsSchema = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          app: { ...DEFAULT_SETTINGS.app, ...parsed.app },
          weather: { ...DEFAULT_SETTINGS.weather, ...parsed.weather },
          audio: { ...DEFAULT_SETTINGS.audio, ...parsed.audio },
          clocks: parsed.clocks ?? DEFAULT_SETTINGS.clocks,
        }
        setSettings(hydrated)
        document.documentElement.setAttribute('data-theme', hydrated.app.theme)
        applyFont(hydrated.app.font)
      } else {
        document.documentElement.setAttribute('data-theme', DEFAULT_SETTINGS.app.theme)
        applyFont(DEFAULT_SETTINGS.app.font)
      }
    } catch {
      document.documentElement.setAttribute('data-theme', DEFAULT_SETTINGS.app.theme)
      applyFont(DEFAULT_SETTINGS.app.font)
    }
  }, [])

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  const update = useCallback((patch: Partial<SettingsSchema>) => {
    setSettings(prev => {
      const next: SettingsSchema = {
        ...prev,
        ...patch,
        app: { ...prev.app, ...(patch as any).app },
        weather: { ...prev.weather, ...(patch as any).weather },
        audio: { ...prev.audio, ...(patch as any).audio },
        clocks: (patch as any).clocks ?? prev.clocks,
      }
      document.documentElement.setAttribute('data-theme', next.app.theme)
      applyFont(next.app.font)
      return next
    })
  }, [])

  const setTheme = useCallback((t: AppTheme) => {
    setSettings(prev => ({ ...prev, app: { ...prev.app, theme: t } }))
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const setFont = useCallback((font: AppFont) => {
    setSettings(prev => ({ ...prev, app: { ...prev.app, font } }))
    applyFont(font)
  }, [])

  const setWeatherUnits = useCallback((units: 'metric' | 'imperial') => {
    setSettings(prev => ({ ...prev, weather: { ...prev.weather, units } }))
  }, [])

  const value = useMemo<SettingsContextType>(
    () => ({ settings, update, setTheme, setFont, setWeatherUnits }),
    [settings, update, setTheme, setFont, setWeatherUnits]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

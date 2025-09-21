"use client"

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettings, type AppTheme } from '@/context/SettingsContext'

const THEMES = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'slate', label: 'Slate' },
]

export function ThemeSelect() {
  const { settings, setTheme } = useSettings()
  const [theme, setThemeState] = useState<string>(settings.app.theme)

  useEffect(() => { setThemeState(settings.app.theme) }, [settings.app.theme])

  const onChange = (value: string) => {
    setThemeState(value)
    setTheme(value as AppTheme)
  }

  return (
    <Select value={theme} onValueChange={onChange}>
      <SelectTrigger className="w-40 rounded-full neu-layer border-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="neu-layer border-0 backdrop-blur-xl">
        {THEMES.map((t) => (
          <SelectItem
            key={t.id}
            value={t.id}
            className="text-xs font-medium uppercase tracking-[0.14em] text-white/70 focus:text-white"
          >
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

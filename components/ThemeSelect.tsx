"use client"

import { useMemo, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettings, type AppTheme } from '@/context/SettingsContext'
import { cn } from '@/lib/utils'

type ThemeMeta = {
  id: AppTheme
  label: string
  theory: string
  description: string
  palette: string[]
}

const THEME_PRESETS: ThemeMeta[] = [
  {
    id: 'midnight',
    label: 'Midnight',
    theory: 'Analogous Indigo',
    description: 'Deep navy foundations with ultraviolet highlights for nocturnal focus.',
    palette: ['#050814', '#1E2A78', '#7C83FF', '#C7D2FF'],
  },
  {
    id: 'aurora',
    label: 'Aurora',
    theory: 'Analogous Teal',
    description: 'Glacial teal gradients balanced by sunlit copper for calm clarity.',
    palette: ['#061311', '#0F766E', '#42DDB8', '#BCEFE0'],
  },
  {
    id: 'sunset',
    label: 'Sunset',
    theory: 'Split Complementary',
    description: 'Citrus orange meets magenta dusk for energising evening rituals.',
    palette: ['#211016', '#FF7043', '#D9486D', '#FFB347'],
  },
  {
    id: 'slate',
    label: 'Slate',
    theory: 'Monochrome Neutrals',
    description: 'Layered graphite neutrals designed for timeless, distraction-free focus.',
    palette: ['#0F141A', '#3D4C63', '#6B7A93', '#D1D8E3'],
  },
  {
    id: 'light',
    label: 'Lumen',
    theory: 'Analogous Sky',
    description: 'Featherweight daylight surfaces with sky-blue accents and crisp typography.',
    palette: ['#F8FAFC', '#3B82F6', '#6366F1', '#1F2937'],
  },
  {
    id: 'dark',
    label: 'Obsidian',
    theory: 'Complementary Glow',
    description: 'Charcoal depths punctuated by electric blues for cinematic contrast.',
    palette: ['#0B1120', '#60A5FA', '#7C3AED', '#E2E8F0'],
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    theory: 'Neon Complementary',
    description: 'Vibrant magenta and cyan interplay evoking a neon-drenched cityscape.',
    palette: ['#050307', '#FF3AF2', '#00F5FF', '#E3E8FF'],
  },
  {
    id: 'neon-blue',
    label: 'Neon Blue',
    theory: 'Monochrome Glow',
    description: 'Midnight blue gradients with electric cyan flares for futuristic clarity.',
    palette: ['#020012', '#2563EB', '#0EA5E9', '#E7F2FF'],
  },
  {
    id: 'purple-glow',
    label: 'Purple Glow',
    theory: 'Analogous Violet',
    description: 'Luminous violets blended with fuchsia sparks for dreamy focus sessions.',
    palette: ['#12051C', '#A855F7', '#F472B6', '#F3E8FF'],
  },
]

const ThemeSwatches = ({ colors, size = 'md' }: { colors: string[]; size?: 'sm' | 'md' }) => {
  const dimension = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className={cn(dimension, 'rounded-full ring-1 ring-border/20')}
          style={{ background: color }}
        />
      ))}
    </div>
  )
}

const ThemePreview = ({ preset, condensed }: { preset: ThemeMeta; condensed?: boolean }) => (
  <div className="flex w-full items-center justify-between gap-4 overflow-hidden">
    <div className="flex min-w-0 flex-col gap-1 text-left">
      <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground/70">
        {preset.theory}
      </span>
      <span className="truncate text-sm font-semibold uppercase tracking-[0.22em] text-foreground">
        {preset.label}
      </span>
      {!condensed && (
        <p
          className="text-xs text-muted-foreground/75 overflow-hidden text-ellipsis"
          style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
        >
          {preset.description}
        </p>
      )}
    </div>
    <ThemeSwatches colors={preset.palette.slice(0, condensed ? 3 : 4)} size={condensed ? 'sm' : 'md'} />
  </div>
)

const ThemeTriggerPreview = ({ preset }: { preset: ThemeMeta }) => (
  <div className="flex w-full flex-col gap-2 overflow-hidden text-left">
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70 truncate">
        {preset.theory}
      </span>
      <ThemeSwatches colors={preset.palette.slice(0, 3)} size="sm" />
    </div>
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground truncate">
        {preset.label}
      </span>
    </div>
    <p className="text-xs text-muted-foreground/75 truncate">
      {preset.description}
    </p>
  </div>
)

interface ThemeSelectProps {
  className?: string
}

export function ThemeSelect({ className }: ThemeSelectProps = {}) {
  const { settings, setTheme } = useSettings()
  const [theme, setThemeState] = useState<string>(settings.app.theme)

  useEffect(() => {
    setThemeState(settings.app.theme)
  }, [settings.app.theme])

  const onChange = (value: string) => {
    setThemeState(value)
    setTheme(value as AppTheme)
  }

  const selectedPreset = useMemo(
    () => THEME_PRESETS.find((preset) => preset.id === (theme as AppTheme)) ?? THEME_PRESETS[0],
    [theme]
  )

  return (
    <div className={cn('relative w-full max-w-[20rem]', className)}>
      <Select value={theme} onValueChange={onChange}>
        <SelectTrigger
          className="group relative z-10 min-h-[96px] w-full flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-border/35 bg-background px-6 py-5 pr-16 text-left shadow-[0_20px_55px_rgba(10,14,25,0.45)] transition-all duration-200 hover:border-ring/40 hover:shadow-[0_24px_65px_rgba(10,14,25,0.55)] focus:ring-2 focus:ring-ring/40 focus:outline-none [&>svg]:hidden"
        >
          <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl border border-white/5/30 bg-gradient-to-br from-foreground/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <ThemeTriggerPreview preset={selectedPreset} />
          <span className="pointer-events-none absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-muted-foreground/80 shadow-sm transition-colors group-hover:border-ring/40 group-hover:text-foreground">
            <ChevronDown className="h-4 w-4" />
          </span>
          <SelectValue placeholder="Theme" className="sr-only" />
        </SelectTrigger>
        <SelectContent
          className="z-20 rounded-2xl border border-border/45 bg-background p-2 text-foreground/90 shadow-[0_30px_75px_rgba(10,14,25,0.55)] backdrop-blur-xl"
          style={{ width: 'min(20rem, calc(100vw - 2.5rem))' }}
        >
          {THEME_PRESETS.map((preset) => (
            <SelectItem
              key={preset.id}
              value={preset.id}
              className="group flex w-full cursor-pointer flex-col gap-3 rounded-xl px-4 py-4 text-left text-sm normal-case leading-tight text-foreground/80 transition-all duration-200 data-[state=checked]:bg-accent/12 data-[state=checked]:text-foreground data-[state=checked]:shadow-[0_12px_30px_rgba(79,70,229,0.25)] data-[highlighted]:bg-accent/10"
            >
              <ThemePreview preset={preset} condensed />
              <p
                className="text-[11px] text-muted-foreground/80 overflow-hidden text-ellipsis"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {preset.description}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

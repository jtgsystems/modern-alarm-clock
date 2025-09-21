"use client"

import { useSfx } from '@/hooks/use-sfx'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const SFX: { key: any; label: string; icon: string }[] = [
  { key: 'rain', label: 'Rain', icon: '🌧️' },
  { key: 'thunder', label: 'Thunder', icon: '⚡' },
  { key: 'wind', label: 'Wind', icon: '🌬️' },
  { key: 'waves', label: 'Waves', icon: '🌊' },
  { key: 'fireplace', label: 'Fireplace', icon: '🔥' },
  { key: 'forest', label: 'Forest', icon: '🌲' },
  { key: 'city', label: 'City', icon: '🏙️' },
]

export default function Soundscapes({ className }: { className?: string }) {
  const { active, toggle, setVolume, stopAll } = useSfx(3)

  return (
    <div className={cn('neu-layer p-5', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Soundscapes</h3>
        <button onClick={stopAll} className="text-xs text-white/60 hover:text-white">Stop all</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {SFX.map((s) => {
          const isActive = active.includes(s.key)
          return (
            <button
              key={s.key}
              aria-pressed={isActive}
              onClick={() => toggle(s.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs',
                'transition-colors',
                isActive ? 'border-white/25 bg-white/10 text-white' : 'border theme-border text-white/70 hover:text-white'
              )}
            >
              <span className="text-base leading-none">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          )
        })}
      </div>
      {active.length > 0 && (
        <div className="mt-4 space-y-3">
          {active.map((name) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-20 text-xs text-white/60 capitalize">{String(name)}</span>
              <Slider className="flex-1" defaultValue={[0.5]} max={1} step={0.01} onValueChange={(v) => setVolume(name, v[0])} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

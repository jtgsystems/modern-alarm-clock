"use client"

import { useCallback, useEffect, useRef, useState } from 'react'

export type SfxName = 'rain' | 'thunder' | 'wind' | 'waves' | 'fireplace' | 'forest' | 'city'

const SOURCES: Record<SfxName, string> = {
  rain: '/sfx/rain.mp3',
  thunder: '/sfx/thunder.mp3',
  wind: '/sfx/wind.mp3',
  waves: '/sfx/waves.mp3',
  fireplace: '/sfx/fireplace.mp3',
  forest: '/sfx/forest.mp3',
  city: '/sfx/city.mp3',
}

export function useSfx(maxConcurrent = 3) {
  const [active, setActive] = useState<SfxName[]>([])
  const volumes = useRef<Record<SfxName, number>>({} as any)
  const nodes = useRef<Record<SfxName, HTMLAudioElement>>({} as any)

  const fade = async (audio: HTMLAudioElement, target: number, ms = 300) => {
    const start = audio.volume
    const diff = target - start
    const startTs = performance.now()
    return new Promise<void>((resolve) => {
      const step = (ts: number) => {
        const t = Math.min(1, (ts - startTs) / ms)
        audio.volume = start + diff * t
        if (t < 1) requestAnimationFrame(step)
        else resolve()
      }
      requestAnimationFrame(step)
    })
  }

  const ensure = (name: SfxName) => {
    if (!nodes.current[name]) {
      const a = new Audio(SOURCES[name])
      a.loop = true
      a.preload = 'auto'
      a.volume = volumes.current[name] ?? 0.5
      nodes.current[name] = a
    }
    return nodes.current[name]
  }

  const toggle = useCallback(async (name: SfxName) => {
    const isActive = active.includes(name)
    if (isActive) {
      const a = ensure(name)
      await fade(a, 0)
      a.pause()
      setActive((arr) => arr.filter((n) => n !== name))
    } else {
      if (active.length >= maxConcurrent) return
      const a = ensure(name)
      a.currentTime = 0
      a.volume = volumes.current[name] ?? 0.5
      await a.play().catch(() => {})
      await fade(a, volumes.current[name] ?? 0.5)
      setActive((arr) => [...arr, name])
    }
  }, [active, maxConcurrent])

  const setVolume = useCallback((name: SfxName, v: number) => {
    volumes.current[name] = v
    const a = nodes.current[name]
    if (a) a.volume = v
  }, [])

  const stopAll = useCallback(async () => {
    await Promise.all(active.map(async (n) => { const a = ensure(n); await fade(a, 0); a.pause() }))
    setActive([])
  }, [active])

  useEffect(() => () => { Object.values(nodes.current).forEach(a => a.pause()) }, [])

  return { active, toggle, setVolume, stopAll }
}

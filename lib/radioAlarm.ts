let audioEl: HTMLAudioElement | null = null

export function playRadioStation(url: string, volume: number = 0.5) {
  try {
    if (!audioEl) audioEl = new Audio()
    audioEl.src = url
    audioEl.loop = true
    audioEl.volume = Math.max(0, Math.min(1, volume))
    return audioEl.play()
  } catch {
    // noop
  }
}

export function stopRadioStation() {
  if (audioEl) {
    try {
      audioEl.pause()
    } catch {}
  }
}


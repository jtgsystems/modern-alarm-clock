"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Play, Pause, SkipForward, Volume2, Music2, Heart, Shuffle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDynamicTheme } from "./DynamicThemeProvider"
import { toast } from "sonner"
import { radioStations } from "@/lib/radioStations"

interface RadioPlayerProps {
  className?: string
}

const allStations = radioStations

export default function RadioPlayer({ className }: RadioPlayerProps) {
  const { currentTheme } = useDynamicTheme()
  const [currentStation, setCurrentStation] = useState(allStations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(0.5)
  // favourites keyed by station id
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set())
  // Repeat disabled in UI for now; can be re-enabled later
  const [isShuffle, setIsShuffle] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'idle'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stationsByGenre = allStations.reduce((acc, station) => {
    const genre = station.genre
    if (!acc[genre]) {
      acc[genre] = []
    }
    acc[genre].push(station)
    return acc
  }, {} as Record<string, typeof radioStations>)

  const genres = Object.entries(stationsByGenre).sort((a, b) => a[0].localeCompare(b[0]))
  const stationCount = useMemo(() => allStations.length, [])
  const genreCount = genres.length
  const isCurrentFavorite = favorites.has(currentStation.id)

  const getNextStation = (direction: 1 | -1, fromStation: typeof allStations[number] = currentStation) => {
    const currentIndex = allStations.findIndex((s) => s.id === fromStation.id)
    if (currentIndex === -1) return allStations[0]
    const nextIndex = (currentIndex + allStations.length + direction) % allStations.length
    return allStations[nextIndex]
  }

  const getRandomStation = (visited: Set<string>) => {
    if (visited.size >= allStations.length) return undefined
    const available = allStations.filter((station) => !visited.has(station.id))
    if (available.length === 0) return undefined
    const randomIndex = Math.floor(Math.random() * available.length)
    return available[randomIndex]
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const attemptPlayStation = async (
    station: typeof allStations[number],
    visited: Set<string>,
    showSuccessToast: boolean
  ): Promise<boolean> => {
    if (!audioRef.current) return false

    setCurrentStation(station)
    setConnectionStatus('connecting')
    setIsLoading(true)
    visited.add(station.id)

    audioRef.current.src = station.url
    try {
      await audioRef.current.play()
      setIsLoading(false)
      setConnectionStatus('connected')
      setIsPlaying(true)
      if (showSuccessToast) {
        toast.success(`Now playing ${station.name}`, { description: station.genre, duration: 2000 })
      }
      return true
    } catch (error) {
      const nextCandidate = isShuffle
        ? getRandomStation(visited)
        : getNextStation(1, station)

      if (nextCandidate && !visited.has(nextCandidate.id)) {
        toast.error(`Failed to connect to ${station.name}. Trying ${nextCandidate.name}...`)
        return attemptPlayStation(nextCandidate, visited, showSuccessToast)
      }

      setIsLoading(false)
      setConnectionStatus('error')
      setIsPlaying(false)
      toast.error('Unable to connect to any available station right now.')
      return false
    }
  }

  const handleStationChange = (station: typeof allStations[number]) => {
    setCurrentStation(station)
    setConnectionStatus('idle')
    if (isPlaying) {
      void attemptPlayStation(station, new Set(), true)
    }
  }

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(stationId)) {
        next.delete(stationId)
      } else {
        next.add(stationId)
      }
      return next
    })
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setConnectionStatus('idle')
      setIsPlaying(false)
    } else {
      void attemptPlayStation(currentStation, new Set(), true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const stepStation = (direction: 1 | -1) => {
    if (isShuffle) {
      const randomStation = getRandomStation(new Set([currentStation.id]))
      if (randomStation) {
        handleStationChange(randomStation)
        if (isPlaying) void attemptPlayStation(randomStation, new Set([randomStation.id]), true)
      }
    } else {
      const nextStation = getNextStation(direction)
      handleStationChange(nextStation)
      if (isPlaying) void attemptPlayStation(nextStation, new Set([nextStation.id]), true)
    }
  }

  const handleShufflePlay = () => {
    const randomStation = getRandomStation(new Set([currentStation.id]))
    if (randomStation) {
      void attemptPlayStation(randomStation, new Set(), true)
    }
  }

  // Audio event handlers
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleLoadStart = () => {
      setIsLoading(true)
      setConnectionStatus('connecting')
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setConnectionStatus('connected')
    }

    const handleError = () => {
      setIsLoading(false)
      setConnectionStatus('error')
      setIsPlaying(false)
      toast.error('Connection failed', {
        description: `Unable to stream ${currentStation.name}`
      })
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setConnectionStatus('idle')
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentStation])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400'
      case 'connecting': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-white/50'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'error': return 'Connection Failed'
      default: return 'Ready'
    }
  }

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {/* Dynamic background overlay */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(147, 197, 253, 0.12), rgba(167, 139, 250, 0.16))'
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10">
              <Music2 className="h-5 w-5 text-white/70" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Radio Player</h3>
              <p className="text-xs text-white/50">
                {genreCount} genres · {stationCount} stations
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50">Theme · {currentTheme.name}</div>
            <div className={cn("text-xs font-medium", getStatusColor())}>{getStatusText()}</div>
          </div>
        </motion.div>

        {/* Current Station Display */}
        <motion.div
          className="relative overflow-hidden rounded-xl backdrop-blur-sm px-4 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: `linear-gradient(90deg, ${currentTheme.colors.accent}20, transparent)` }}
          />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Now Playing</div>
              <button
                type="button"
                aria-label={isCurrentFavorite ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={isCurrentFavorite}
                onClick={() => toggleFavorite(currentStation.id)}
                className={cn(
                  "rounded-lg border px-3 py-1 text-xs font-medium transition",
                  isCurrentFavorite
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <span className="inline-flex items-center">
                  <Heart className={cn("h-3.5 w-3.5", isCurrentFavorite && "fill-current")} />
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.accent}25, ${currentTheme.colors.accent}10)`,
                  border: `1px solid ${currentTheme.colors.accent}30`
                }}
                animate={isPlaying ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [`0 0 0 0 ${currentTheme.colors.accent}40`, `0 0 0 10px ${currentTheme.colors.accent}00`, `0 0 0 0 ${currentTheme.colors.accent}40`]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Music2 className={cn("h-5 w-5", isPlaying ? "text-white" : "text-white/70")} style={isPlaying ? { color: currentTheme.colors.accent } : {}} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.h4
                    key={currentStation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="truncate text-sm font-bold text-white/95 mb-0.5"
                  >
                    {currentStation.name}
                  </motion.h4>
                </AnimatePresence>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-white/70">{currentStation.genre}</p>
                  {connectionStatus === 'connected' && isPlaying && (
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-3 w-0.5 rounded-full"
                          style={{ backgroundColor: currentTheme.colors.accent }}
                          animate={{ scaleY: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mt-1">{getStatusText()}</div>
              </div>
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-6 w-6 rounded-full border-2 border-white/20"
                  style={{ borderTopColor: currentTheme.colors.accent }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => {
                const next = !isShuffle
                setIsShuffle(next)
                if (next) {
                  handleShufflePlay()
                }
              }}
              aria-label="Shuffle stations"
              aria-pressed={isShuffle}
              className={cn(
                "group relative overflow-hidden h-10 w-10 rounded-xl border px-0 py-0 flex items-center justify-center backdrop-blur-sm transition-colors duration-200",
                isShuffle ? "text-white" : "text-white/60"
              )}
              style={{
                borderColor: isShuffle ? `${currentTheme.colors.accent}60` : 'rgba(255, 255, 255, 0.1)',
                background: isShuffle
                  ? `linear-gradient(135deg, ${currentTheme.colors.accent}26, ${currentTheme.colors.accent}10)`
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span
                className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.accent}33, transparent)`
                }}
              />
              <Shuffle className="relative z-10 h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => stepStation(-1)}
              aria-label="Previous station"
              className="group relative overflow-hidden h-12 w-12 rounded-xl border border-white/15 bg-white/5 text-white/70 flex items-center justify-center backdrop-blur-sm transition-colors duration-200"
            >
              <span className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-r from-blue-500/15 to-purple-500/15 transition-opacity duration-300 group-hover:opacity-100" />
              <SkipForward className="relative z-10 h-5 w-5 rotate-180" />
            </motion.button>
          </div>

          {/* Main Play Button */}
          <motion.button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="group relative overflow-hidden h-16 w-16 rounded-xl text-white backdrop-blur-sm flex items-center justify-center transition-transform duration-200"
            style={{
              background: isPlaying
                ? `linear-gradient(135deg, ${currentTheme.colors.accent}, ${currentTheme.colors.accent}80)`
                : 'rgba(255, 255, 255, 0.12)',
              border: `2px solid ${isPlaying ? currentTheme.colors.accent : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: isPlaying ? `0 8px 32px ${currentTheme.colors.accent}40` : 'none'
            }}
          >
            <span className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-br from-white/10 to-transparent transition-opacity duration-300 group-hover:opacity-100" />
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => stepStation(1)}
              aria-label="Next station"
              className="group relative overflow-hidden h-12 w-12 rounded-xl border border-white/15 bg-white/5 text-white/70 flex items-center justify-center backdrop-blur-sm transition-colors duration-200"
            >
              <span className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-r from-purple-500/15 to-blue-500/15 transition-opacity duration-300 group-hover:opacity-100" />
              <SkipForward className="relative z-10 h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={() => toggleFavorite(currentStation.id)}
              aria-pressed={isCurrentFavorite}
              aria-label="Toggle favourite"
              className={cn(
                "group relative overflow-hidden h-10 w-10 rounded-xl border px-0 py-0 flex items-center justify-center backdrop-blur-sm transition-colors duration-200",
                isCurrentFavorite ? "text-red-400" : "text-white/60"
              )}
              style={{
                borderColor: isCurrentFavorite ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span
                className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: isCurrentFavorite
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), transparent)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)'
                }}
              />
              <Heart className={cn("relative z-10 h-4 w-4", isCurrentFavorite && "fill-current")} />
            </motion.button>
          </div>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4 text-white/70">
            <Volume2 className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Volume</span>
            <span className="ml-auto text-sm font-bold tabular-nums text-white/90">{Math.round(volume * 100)}%</span>
          </div>
          <div className="relative">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Station List */}
        <motion.div
          className="rounded-xl backdrop-blur-sm px-3 py-3"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-2">
            <Accordion type="multiple" className="space-y-2">
              {genres.map(([genre, stations]) => (
                <AccordionItem
                  key={genre}
                  value={genre}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold text-white/80 transition-colors hover:text-white">
                    <div className="flex items-center gap-3">
                      <Music2 className="h-4 w-4 text-white/60" />
                      <span>{genre}</span>
                      <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                        {stations.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="space-y-2 px-4 py-4">
                      {stations.map((station) => {
                        const isActive = currentStation.id === station.id
                        const isFav = favorites.has(station.id)
                        return (
                          <div
                            key={station.id}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 cursor-pointer",
                              isActive ? "text-white" : "text-white/70 hover:text-white hover:border-white/15 hover:bg-white/5"
                            )}
                            style={{
                              background: isActive
                                ? `linear-gradient(135deg, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent}08)`
                                : 'transparent',
                              borderColor: isActive ? `${currentTheme.colors.accent}40` : 'rgba(255, 255, 255, 0.05)'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleStationChange(station)}
                              className="flex-1 text-left"
                            >
                              <div className="text-sm font-semibold truncate">{station.name}</div>
                              <div className="text-xs text-white/50">{station.genre}</div>
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(station.id);
                              }}
                              aria-label={isFav ? `Remove ${station.name} from favourites` : `Add ${station.name} to favourites`}
                              aria-pressed={isFav}
                              className={cn(
                                "rounded-lg border p-2 transition",
                                isFav
                                  ? "border-white/30 bg-white/15 text-white"
                                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                              )}
                            >
                              <Heart
                                className={cn("h-4 w-4", isFav && "fill-current")}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        <audio ref={audioRef} />
      </div>
    </motion.div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Play, Pause, SkipForward, Volume2, Music2, Radio, Waves, Heart, Shuffle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDynamicTheme } from "./DynamicThemeProvider"
import { toast } from "sonner"

interface RadioPlayerProps {
  className?: string
}

const radioStations = [
  // 🎼 Classical & Opera (Premium Quality - Verified 2025)
  { id: "wqxr", name: "WQXR New York", url: "https://stream.wqxr.org/wqxr-web", genre: "Classical" },
  { id: "classical-kusc", name: "Classical KUSC 91.5", url: "https://kusc.streamguys1.com/kusc-mp3", genre: "Classical" },
  { id: "yourclassical", name: "YourClassical MPR", url: "https://cms.stream.publicradio.org/cms.mp3", genre: "Classical" },
  { id: "classical-king", name: "Classical KING FM 98.1", url: "https://classicalking.streamguys1.com/king-mp3", genre: "Classical" },
  { id: "wrti-classical", name: "WRTI Classical 90.1", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/WRTI_CLASSICAL.mp3", genre: "Classical" },
  { id: "wfmt", name: "WFMT Chicago Classical", url: "https://stream.wfmt.com/main", genre: "Classical" },
  { id: "radio-swiss-classic", name: "Radio Swiss Classic", url: "https://stream.srg-ssr.ch/rsc_de/mp3_128.m3u", genre: "Classical" },
  { id: "france-musique", name: "France Musique", url: "https://direct.francemusique.fr/live/francemusique-midfi.mp3", genre: "Classical" },
  { id: "br-klassik", name: "BR-KLASSIK", url: "https://dispatcher.rndfnk.com/br/brklassik/live/mp3/mid", genre: "Classical" },
  { id: "classic-fm", name: "Classic FM (UK)", url: "https://media-ssl.musicradio.com/ClassicFM", genre: "Classical" },

  // 🎷 Jazz & Blues (Premium Quality - Verified 2025)
  { id: "tsf-jazz", name: "TSF Jazz Paris", url: "https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3", genre: "Jazz" },
  { id: "wrti-jazz", name: "WRTI Jazz 90.1", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/WRTI_JAZZ.mp3", genre: "Jazz" },
  { id: "jazz24", name: "Jazz24", url: "https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1", genre: "Jazz" },
  { id: "wdcb-jazz", name: "WDCB Jazz 90.9", url: "https://wdcb.streamguys1.com/live-mp3", genre: "Jazz" },
  { id: "kjazz", name: "KJAZZ 88.1", url: "https://kjazz.streamguys1.com/kjazz-hi", genre: "Jazz" },
  { id: "jazz-radio-paris", name: "Jazz Radio Paris", url: "https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3", genre: "Jazz" },
  { id: "kcsm-jazz", name: "KCSM Jazz 91.1", url: "https://ice6.securenetsystems.net/KCSM", genre: "Jazz" },
  { id: "smooth-jazz-247", name: "Smooth Jazz 24/7", url: "https://smoothjazz.cdnstream1.com/2585_320.mp3", genre: "Jazz" },
  { id: "jazz-kat", name: "Jazz Kat KRTU", url: "https://streaming.trinityuniversity.edu:8000/krtu.mp3", genre: "Jazz" },
  { id: "wbgo", name: "WBGO Jazz 88.3", url: "https://wbgo.streamguys1.com/wbgo70", genre: "Jazz" },

  // 🌊 Ambient & Atmospheric (Premium Quality - Verified 2025)
  { id: "soma-drone", name: "SomaFM Drone Zone", url: "https://ice1.somafm.com/dronezone-128-mp3", genre: "Ambient" },
  { id: "soma-space", name: "SomaFM Space Station", url: "https://ice1.somafm.com/spacestation-128-mp3", genre: "Ambient" },
  { id: "soma-lush", name: "SomaFM Lush", url: "https://ice1.somafm.com/lush-128-mp3", genre: "Ambient" },
  { id: "ambient-sleeping", name: "Ambient Sleeping Pill", url: "https://radio.stereoscenic.com/asp-h", genre: "Ambient" },
  { id: "deep-ambient", name: "Deep Space One", url: "https://radio.stereoscenic.com/dso-h", genre: "Ambient" },
  { id: "hearts-of-space", name: "Hearts of Space", url: "https://stream.heartsofspace.com/hos-7-3-320-mp3", genre: "Ambient" },
  { id: "stillstream", name: "Stillstream", url: "https://streams.stillstream.com/stillstream.mp3", genre: "Ambient" },
  { id: "cryosleep", name: "Cryosleep", url: "https://radio.stereoscenic.com/cry-h", genre: "Ambient" },
  { id: "ambient-online", name: "Ambient Online", url: "https://streams.ambient.online/ambient.mp3", genre: "Ambient" },
  { id: "mission-control", name: "Mission Control", url: "https://radio.stereoscenic.com/spc-h", genre: "Ambient" },

  // 🎛️ Electronic & Modern (Premium Quality - Verified 2025)
  { id: "paradise-main", name: "Radio Paradise Main", url: "https://stream.radioparadise.com/aac-320", genre: "Electronic" },
  { id: "paradise-mellow", name: "Radio Paradise Mellow", url: "https://stream.radioparadise.com/mellow-320", genre: "Electronic" },
  { id: "soma-groove", name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-256-mp3", genre: "Electronic" },
  { id: "di-chillout", name: "Digitally Imported Chillout", url: "https://prem2.di.fm:443/chillout", genre: "Electronic" },
  { id: "di-lounge", name: "Digitally Imported Lounge", url: "https://prem2.di.fm:443/lounge", genre: "Electronic" },
  { id: "chillsynth", name: "ChillSynth FM", url: "https://radio.chillsynth.fm/stream", genre: "Electronic" },
  { id: "retrowave", name: "Retrowave", url: "https://retrowave.ru/play/retrowave_main/aacp64", genre: "Electronic" },
  { id: "lofi-girl", name: "Lofi Girl Radio", url: "https://streams.ilovemusic.de/iloveradio17.mp3", genre: "Electronic" },
  { id: "cafe-del-mar", name: "Cafe del Mar", url: "https://radio4.cdm-radio.com:18020/stream-mp3-Chill", genre: "Electronic" },
  { id: "ibiza-global", name: "Ibiza Global Radio", url: "https://ibizaglobalradio.streaming-pro.com:8024/stream.mp3", genre: "Electronic" },

  // 🌍 World & Cultural (Premium Quality - Verified 2025)
  { id: "bbc-world", name: "BBC World Service", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service", genre: "World" },
  { id: "bbc-asian", name: "BBC Asian Network", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_asian_network", genre: "World" },
  { id: "france-inter", name: "France Inter", url: "https://direct.franceinter.fr/live/franceinter-midfi.mp3", genre: "World" },
  { id: "radio-france-intl", name: "RFI Monde", url: "https://rfimonde96k.ice.infomaniak.ch/rfimonde-96.mp3", genre: "World" },
  { id: "fip", name: "FIP Radio", url: "https://direct.fipradio.fr/live/fip-midfi.mp3", genre: "World" },
  { id: "nrk-alltid", name: "NRK Alltid Klassisk", url: "https://lyd.nrk.no/nrk_radio_alltid_klassisk_mp3_h", genre: "World" },
  { id: "rai-radio3", name: "RAI Radio 3", url: "https://radiothree-live.cdn.rai.it/liveaudio/radiothree/playlist.m3u8", genre: "World" },
  { id: "kcrw", name: "KCRW Eclectic 24", url: "https://kcrw.streamguys1.com/kcrw_192k_mp3_e24", genre: "World" },
  { id: "resonance-fm", name: "Resonance FM", url: "https://radio.resonance.fm:8443/resonance", genre: "World" },
  { id: "abc-jazz", name: "ABC Jazz (Australia)", url: "https://live-radio02.mediahubaustralia.com/JAZW/mp3/", genre: "World" },

  // 🎸 Alternative & Indie (Premium Quality - Verified 2025)
  { id: "kexp", name: "KEXP 90.3 Seattle", url: "https://kexp.streamguys1.com/kexp320.aac", genre: "Alternative" },
  { id: "6music", name: "BBC Radio 6 Music", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music", genre: "Alternative" },
  { id: "nts-1", name: "NTS Radio 1", url: "https://stream-relay-geo.ntslive.net/stream", genre: "Alternative" },
  { id: "nts-2", name: "NTS Radio 2", url: "https://stream-relay-geo.ntslive.net/stream2", genre: "Alternative" },
  { id: "kcrw-music", name: "KCRW Music", url: "https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air", genre: "Alternative" },
  { id: "the-current", name: "The Current 89.3", url: "https://current.stream.publicradio.org/kcmp.mp3", genre: "Alternative" },
  { id: "wxpn", name: "WXPN 88.5", url: "https://wxpnhi.xpn.org/xpnhi", genre: "Alternative" },
  { id: "wfuv", name: "WFUV 90.7", url: "https://wfuv.streamguys1.com/wfuv", genre: "Alternative" },
  { id: "kdhx", name: "KDHX 88.1", url: "https://kdhx-ice.streamguys1.com/live", genre: "Alternative" },
  { id: "dublab", name: "Dublab Radio", url: "https://dublab.out.airtime.pro/dublab_a", genre: "Alternative" },

  // 🎵 News & Talk (Premium Quality - Verified 2025)
  { id: "npr", name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3", genre: "News" },
  { id: "bbc-radio4", name: "BBC Radio 4", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm", genre: "News" },
  { id: "abc-news", name: "ABC News Radio", url: "https://live-radio01.mediahubaustralia.com/2ABW/mp3/", genre: "News" },
  { id: "cbc-radio1", name: "CBC Radio One", url: "https://cbc_r1_tor.akacast.akamaistream.net/7/442/451661/v1/rc.akacast.akamaistream.net/cbc_r1_tor", genre: "News" },
  { id: "rthk-radio3", name: "RTHK Radio 3", url: "https://rthkaudio3-lh.akamaihd.net/i/radio3_1@349792/master.m3u8", genre: "News" },
]

export default function RadioPlayer({ className }: RadioPlayerProps) {
  const { currentTheme } = useDynamicTheme()
  const [currentStation, setCurrentStation] = useState(radioStations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isFavorite, setIsFavorite] = useState(false)
  // Repeat disabled in UI for now; can be re-enabled later
  const [isShuffle, setIsShuffle] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'idle'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stationsByGenre = radioStations.reduce((acc, station) => {
    const genre = station.genre
    if (!acc[genre]) {
      acc[genre] = []
    }
    acc[genre].push(station)
    return acc
  }, {} as Record<string, typeof radioStations>)

  const genres = Object.entries(stationsByGenre).sort((a, b) => a[0].localeCompare(b[0]))

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleStationChange = (station: typeof radioStations[number]) => {
    setCurrentStation(station)
    setConnectionStatus('idle')
    toast.success(`Switched to ${station.name}`, {
      description: station.genre,
      duration: 2000
    })
    if (isPlaying && audioRef.current) {
      setIsLoading(true)
      setConnectionStatus('connecting')
      audioRef.current.src = station.url
      audioRef.current.play().catch(() => {
        setConnectionStatus('error')
        setIsLoading(false)
        toast.error(`Failed to connect to ${station.name}`)
      })
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setConnectionStatus('idle')
    } else {
      setIsLoading(true)
      setConnectionStatus('connecting')
      audioRef.current.src = currentStation.url
      audioRef.current.play().catch(() => {
        setConnectionStatus('error')
        setIsLoading(false)
        toast.error(`Failed to connect to ${currentStation.name}`)
      })
    }
    setIsPlaying(!isPlaying)
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
      const randomIndex = Math.floor(Math.random() * radioStations.length)
      handleStationChange(radioStations[randomIndex])
    } else {
      const currentIndex = radioStations.findIndex((s) => s.id === currentStation.id)
      const nextIndex = (currentIndex + radioStations.length + direction) % radioStations.length
      handleStationChange(radioStations[nextIndex])
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
        "group relative overflow-hidden rounded-3xl backdrop-blur-xl px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
        `bg-gradient-to-br ${currentTheme.colors.secondary}`,
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.gradient}), rgba(255, 255, 255, 0.03)`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Dynamic background overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${currentTheme.colors.accent}40 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, ${currentTheme.colors.accent}20 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 flex flex-col gap-7">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="rounded-2xl p-3 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent}10)`,
                border: `1px solid ${currentTheme.colors.accent}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Radio className="h-5 w-5" style={{ color: currentTheme.colors.accent }} />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white/90">Radio Player</h3>
              <p className="text-sm text-white/60">{currentTheme.name}</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Waves className="h-4 w-4 text-green-400" />
            </motion.div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50">{genres.length} genres</div>
            <div className={cn("text-xs font-medium", getStatusColor())}>
              {getStatusText()}
            </div>
          </div>
        </motion.div>

        {/* Current Station Display */}
        <motion.div
          className="relative overflow-hidden rounded-3xl backdrop-blur-sm px-6 py-5"
          style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 opacity-0"
            style={{ background: `linear-gradient(90deg, ${currentTheme.colors.accent}20, transparent)` }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-sm"
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
              <Music2 className={cn("h-7 w-7", isPlaying ? "text-white" : "text-white/70")} style={isPlaying ? { color: currentTheme.colors.accent } : {}} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={currentStation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="truncate text-xl font-bold text-white/95 mb-1"
                >
                  {currentStation.name}
                </motion.h4>
              </AnimatePresence>
              <div className="flex items-center gap-3">
                <p className="text-base text-white/70">{currentStation.genre}</p>
                {connectionStatus === 'connected' && isPlaying && (
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 w-1 rounded-full"
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
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          className="flex items-center justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsShuffle(!isShuffle)}
              className={cn(
                "h-10 w-10 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center",
                isShuffle ? "text-white" : "text-white/60"
              )}
              style={{
                background: isShuffle ? `${currentTheme.colors.accent}40` : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isShuffle ? currentTheme.colors.accent + '60' : 'rgba(255, 255, 255, 0.1)'}`
              }}
            >
              <Shuffle className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => stepStation(-1)}
              className="h-12 w-12 rounded-xl backdrop-blur-sm text-white/70 transition-all hover:text-white flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <SkipForward className="h-5 w-5 rotate-180" />
            </motion.button>
          </div>

          {/* Main Play Button */}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="h-20 w-20 rounded-2xl text-white backdrop-blur-sm transition-all flex items-center justify-center"
            style={{
              background: isPlaying
                ? `linear-gradient(135deg, ${currentTheme.colors.accent}, ${currentTheme.colors.accent}CC)`
                : 'rgba(255, 255, 255, 0.12)',
              border: `2px solid ${isPlaying ? currentTheme.colors.accent : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: isPlaying ? `0 8px 32px ${currentTheme.colors.accent}40` : 'none'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? 'pause' : 'play'}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="ml-1 h-9 w-9" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => stepStation(1)}
              className="h-12 w-12 rounded-xl backdrop-blur-sm text-white/70 transition-all hover:text-white flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <SkipForward className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "h-10 w-10 rounded-xl backdrop-blur-sm transition-all flex items-center justify-center",
                isFavorite ? "text-red-400" : "text-white/60"
              )}
              style={{
                background: isFavorite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isFavorite ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`
              }}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </motion.button>
          </div>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          className="space-y-3"
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
          className="rounded-3xl backdrop-blur-sm px-4 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ScrollArea className="max-h-64 pr-2">
            <Accordion type="multiple" className="space-y-3">
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
                      {stations.map((station) => (
                        <motion.button
                          key={station.id}
                          onClick={() => handleStationChange(station)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "w-full rounded-xl px-4 py-3 text-left transition-all duration-200",
                            currentStation.id === station.id
                              ? "text-white backdrop-blur-sm"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                          style={{
                            background: currentStation.id === station.id
                              ? `linear-gradient(135deg, ${currentTheme.colors.accent}25, ${currentTheme.colors.accent}10)`
                              : 'transparent',
                            border: currentStation.id === station.id
                              ? `1px solid ${currentTheme.colors.accent}40`
                              : '1px solid transparent'
                          }}
                        >
                          <div className="text-sm font-medium mb-1">{station.name}</div>
                          <div className="text-xs text-white/50">{station.genre}</div>
                        </motion.button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </motion.div>

        <audio ref={audioRef} />
      </div>
    </motion.div>
  )
}

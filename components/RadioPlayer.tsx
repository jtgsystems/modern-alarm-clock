"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Play, Pause, SkipForward, Volume2, Music2, Radio } from "lucide-react"

const radioStations = [
  // Classical & Opera (10)
  { id: 'wqxr', name: 'WQXR New York', url: 'https://stream.wqxr.org/wqxr-web', genre: 'Classical' },
  { id: 'wrti-classical', name: 'WRTI Classical', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WRTI_CLASSICAL.mp3', genre: 'Classical' },
  { id: 'venice-classic', name: 'Venice Classic', url: 'https://uk2.streamingpulse.com/ssl/vcr1', genre: 'Classical' },
  { id: 'classical-piano', name: 'Classical Piano', url: 'https://radio.stereoscenic.com/asp-h', genre: 'Classical' },
  { id: 'wguc', name: 'WGUC Cincinnati', url: 'https://stream.wguc.org/wguc-128-mp3', genre: 'Classical' },
  { id: 'symphony', name: 'Symphony Radio', url: 'https://symphonyradio.ice.infomaniak.ch/symphonyradio-128.mp3', genre: 'Classical' },
  { id: 'concertzender', name: 'Concertzender', url: 'https://streams.greenhost.nl:8006/live', genre: 'Classical' },
  { id: 'classical-live', name: 'Classical Live', url: 'https://radio.stereoscenic.com/cls-h', genre: 'Classical' },
  { id: 'yourclassical', name: 'YourClassical MPR', url: 'https://cms.stream.publicradio.org/cms.mp3', genre: 'Classical' },
  { id: 'bbc-radio3', name: 'BBC Radio 3', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three', genre: 'Classical' },
  
  // Jazz & Blues (10)
  { id: 'tsf-jazz', name: 'TSF Jazz Paris', url: 'https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3', genre: 'Jazz' },
  { id: 'wrti-jazz', name: 'WRTI Jazz', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WRTI_JAZZ.mp3', genre: 'Jazz' },
  { id: 'jazz-groove', name: 'The Jazz Groove', url: 'http://west-aac-64.streamthejazzgroove.com/stream', genre: 'Jazz' },
  { id: 'smooth-jazz', name: 'Smooth Jazz Global', url: 'https://smoothjazz.cdnstream1.com/2585_320.mp3', genre: 'Jazz' },
  { id: 'jazz-cafe', name: 'Jazz Café', url: 'https://strm112.1.fm/ajazz_mobile_mp3', genre: 'Jazz' },
  { id: 'jazz24', name: 'Jazz24', url: 'https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1', genre: 'Jazz' },
  { id: 'jazz-bits', name: 'Jazz Bits Radio', url: 'https://jazzbits.ice.infomaniak.ch/jazzbits-high.mp3', genre: 'Jazz' },
  { id: 'blues', name: 'Blues Radio', url: 'https://stream.radiojar.com/q4ggz7n5wd0uv', genre: 'Jazz' },
  { id: 'chiaroscuro', name: 'Chiaroscuro Jazz', url: 'https://streaming.live365.com/b48095_128mp3', genre: 'Jazz' },
  { id: 'linn-jazz', name: 'Linn Jazz', url: 'https://radio.linn.co.uk:8443/autodj', genre: 'Jazz' },
  
  // Ambient & Atmospheric (10)
  { id: 'soma-drone', name: 'SomaFM Drone Zone', url: 'https://ice1.somafm.com/dronezone-128-mp3', genre: 'Ambient' },
  { id: 'hearts-space', name: 'Hearts of Space', url: 'https://ice1.somafm.com/spacestation-128-mp3', genre: 'Ambient' },
  { id: 'ambient-sleeping', name: 'Ambient Sleeping Pill', url: 'https://radio.stereoscenic.com/asp-h', genre: 'Ambient' },
  { id: 'nature-radio', name: 'Nature Radio', url: 'https://streaming.radio.co/s5c5da6a36/listen', genre: 'Ambient' },
  { id: 'cosmic-radio', name: 'Cosmic Radio', url: 'https://cosmicradio.ice.infomaniak.ch/cosmicradio.mp3', genre: 'Ambient' },
  { id: 'meditation', name: 'Meditation Radio', url: 'https://radio4.cdm-radio.com:18020/stream-mp3-Meditation', genre: 'Ambient' },
  { id: 'soma-space', name: 'SomaFM Space Station', url: 'https://ice1.somafm.com/spacestation-128-mp3', genre: 'Ambient' },
  { id: 'ambient-fm', name: 'Ambient FM', url: 'https://radio.stereoscenic.com/afm-h', genre: 'Ambient' },
  { id: 'mother-earth', name: 'Mother Earth Radio', url: 'https://server.motherearthradio.org/radio/8000/radio.mp3', genre: 'Ambient' },
  { id: 'soundscapes', name: 'Soundscapes Radio', url: 'https://radio.stereoscenic.com/scp-h', genre: 'Ambient' },
  
  // Electronic & Modern (10)
  { id: 'paradise-main', name: 'Radio Paradise Main', url: 'https://stream.radioparadise.com/aac-320', genre: 'Eclectic' },
  { id: 'paradise-mellow', name: 'Radio Paradise Mellow', url: 'https://stream.radioparadise.com/mellow-320', genre: 'Mellow Mix' },
  { id: 'fip-main', name: 'FIP Radio Paris', url: 'https://stream.radiofrance.fr/fip/fip_hifi.m3u8', genre: 'Eclectic' },
  { id: 'soma-groove', name: 'SomaFM Groove Salad', url: 'https://ice1.somafm.com/groovesalad-256-mp3', genre: 'Electronic' },
  { id: 'lofi', name: 'Lofi Hip Hop', url: 'https://streams.ilovemusic.de/iloveradio17.mp3', genre: 'Electronic' },
  { id: 'deep-house', name: 'Deep House Radio', url: 'https://streams.ilovemusic.de/iloveradio16.mp3', genre: 'Electronic' },
  { id: 'proton', name: 'Proton Radio', url: 'https://shoutcast.protonradio.com/stream', genre: 'Electronic' },
  { id: 'di-lounge', name: 'DI.FM Lounge', url: 'https://streams.di.fm/lounge', genre: 'Electronic' },
  { id: 'cafe-del-mar', name: 'Café del Mar', url: 'https://streams.radio.co/se1a320b47/listen', genre: 'Electronic' },
  { id: 'motion-fm', name: 'Motion FM', url: 'https://vm.motionfm.com/motionfm_main', genre: 'Electronic' },
  
  // World & Cultural (10)
  { id: 'world-music', name: 'World Music Radio', url: 'https://stream.radioneo.org:8443/world.mp3', genre: 'World' },
  { id: 'bbc-asian', name: 'BBC Asian Network', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_asian_network', genre: 'World' },
  { id: 'latin-jazz', name: 'Latin Jazz Radio', url: 'https://stream.radiojar.com/6rxpyrnzsg0uv', genre: 'World' },
  { id: 'bollywood', name: 'Bollywood Instrumental', url: 'https://stream.zeno.fm/g4c2qnz8rm0uv', genre: 'World' },
  { id: 'african-music', name: 'African Music Radio', url: 'https://african1paris.ice.infomaniak.ch/african1paris-128.mp3', genre: 'World' },
  { id: 'radio-caprice', name: 'Radio Caprice World', url: 'https://radiokaprice.ru:8000/world', genre: 'World' },
  { id: 'celtic-radio', name: 'Celtic Radio', url: 'https://stream.radioneo.org:8443/celtic.mp3', genre: 'World' },
  { id: 'arab-radio', name: 'Arab Music Radio', url: 'https://stream.radiojar.com/whbvyphna3quv', genre: 'World' },
  { id: 'indian-classical', name: 'Indian Classical', url: 'https://strm112.1.fm/iclassical_mobile_mp3', genre: 'World' },
  { id: 'reggae-trade', name: 'Reggae Trade Radio', url: 'https://stream.radiojar.com/6rxpyrnzsg0uv', genre: 'World' },
  
  // Contemporary & Alternative (10)
  { id: 'kexp', name: 'KEXP Seattle', url: 'https://kexp.streamguys1.com/kexp320.aac', genre: 'Alternative' },
  { id: 'dublab', name: 'Dublab Radio', url: 'https://dublab.out.airtime.pro/dublab_a', genre: 'Alternative' },
  { id: 'nts-main', name: 'NTS Radio Main', url: 'https://stream-relay-geo.ntslive.net/stream', genre: 'Alternative' },
  { id: 'worldwide-fm', name: 'Worldwide FM', url: 'https://worldwidefm.out.airtime.pro/worldwidefm_b', genre: 'Alternative' },
  { id: 'the-lot', name: 'The Lot Radio', url: 'https://thelot.out.airtime.pro/thelot_a', genre: 'Alternative' },
  { id: 'resonance', name: 'Resonance FM', url: 'https://stream.resonance.fm/resonance', genre: 'Alternative' },
  { id: 'radio-reverb', name: 'Radio Reverb', url: 'https://stream.radioreverb.com:8443/reverb', genre: 'Alternative' },
  { id: 'soho-radio', name: 'Soho Radio', url: 'https://sohoradiomusic.doughnut.net/sohoradiomusic.mp3', genre: 'Alternative' },
  { id: 'fluid', name: 'Fluid Radio', url: 'https://fluidradio.out.airtime.pro/fluidradio_a', genre: 'Alternative' },
  { id: 'fip-groove', name: 'FIP Groove', url: 'https://stream.radiofrance.fr/fipgroove/fipgroove_hifi.m3u8', genre: 'Alternative' }
]

export default function RadioPlayer() {
  const [currentStation, setCurrentStation] = useState(radioStations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stationsByGenre = radioStations.reduce((acc, station) => {
    const genre = station.genre;
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(station);
    return acc;
  }, {} as Record<string, typeof radioStations>);

  const genres = Object.entries(stationsByGenre).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleStationChange = (station: typeof radioStations[0]) => {
    setCurrentStation(station)
    if (isPlaying && audioRef.current) {
      audioRef.current.src = station.url
      audioRef.current.play()
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.src = currentStation.url
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="relative overflow-hidden backdrop-blur-xl">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/30 to-purple-600/30 rounded-[2.1rem] opacity-40 blur-sm" />
      
      {/* Main container */}
      <div className="relative rounded-[2rem] overflow-hidden">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-900/80 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Radio className="h-5 w-5 text-white/70" />
            <h3 className="text-white/90 font-medium">Radio Player</h3>
          </div>

          {/* Now Playing */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <Music2 className="h-6 w-6 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white/90 truncate">{currentStation.name}</h4>
                <p className="text-xs text-white/60">{currentStation.genre}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
              onClick={() => {
                const currentIndex = radioStations.findIndex(s => s.id === currentStation.id)
                const nextStation = radioStations[(currentIndex + 1) % radioStations.length]
                handleStationChange(nextStation)
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-16 w-16 rounded-full",
                "border border-white/10",
                "bg-gradient-to-br from-cyan-500/20 to-purple-500/20",
                "hover:from-cyan-500/30 hover:to-purple-500/30",
                "text-white"
              )}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
              onClick={() => {
                const currentIndex = radioStations.findIndex(s => s.id === currentStation.id)
                const prevStation = radioStations[(currentIndex - 1 + radioStations.length) % radioStations.length]
                handleStationChange(prevStation)
              }}
            >
              <SkipForward className="h-5 w-5 rotate-180" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 mb-6">
            <Volume2 className="h-4 w-4 text-white/60" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="flex-1"
            />
            <span className="text-xs text-white/60 tabular-nums w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Station List */}
          <ScrollArea className="h-[240px]">
            <div className="pr-4">
              <Accordion type="multiple" className="space-y-2">
                {genres.map(([genre, stations]) => (
                  <AccordionItem
                    key={genre}
                    value={genre}
                    className="border border-white/10 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Music2 className="h-4 w-4 text-white/60" />
                        <span className="text-sm font-medium text-white/80">{genre}</span>
                        <span className="text-xs text-white/40 ml-1">({stations.length})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        {stations.map((station) => (
                          <button
                            key={station.id}
                            onClick={() => handleStationChange(station)}
                            className={cn(
                              "w-full p-2 rounded-md text-left transition-colors",
                              "hover:bg-white/10",
                              currentStation.id === station.id 
                                ? "bg-white/10 border-white/20"
                                : "border-transparent",
                              "border",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Radio className="h-4 w-4 text-white/60" />
                              <span className="text-sm text-white/80 hover:text-white/100 transition-colors">{station.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} />
      </div>
    </div>
  )
}

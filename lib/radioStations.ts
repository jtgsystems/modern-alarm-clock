export interface RadioStation {
  id: string
  name: string
  url: string
  genre: string
}

export const radioStations: RadioStation[] = [
  // CLASSICAL (4 stations)
  { id: "wqxr", name: "WQXR New York Classical", url: "https://stream.wqxr.org/wqxr-web", genre: "Classical" },
  { id: "yourclassical", name: "YourClassical MPR Minnesota", url: "https://cms.stream.publicradio.org/cms.mp3", genre: "Classical" },
  { id: "classic-fm-london", name: "Classic FM London", url: "https://stream.rcs.revma.com/ypqt40u0x1zuv", genre: "Classical" },
  { id: "npo-radio4", name: "NPO Radio 4 Netherlands", url: "https://icecast.omroep.nl/radio4-bb-mp3", genre: "Classical" },

  // JAZZ (4 stations)
  { id: "smoothjazz-global", name: "Smooth Jazz Global", url: "https://smoothjazz.cdnstream1.com/2585_320.mp3", genre: "Jazz" },
  { id: "jazzradio-fr", name: "Jazz Radio France", url: "https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3", genre: "Jazz" },
  { id: "legacy-jazz", name: "Jazz Legacy Radio", url: "https://ais-sa2.cdnstream1.com/1988_128.mp3", genre: "Jazz" },
  { id: "somafm-lounge", name: "SomaFM Illinois Street Lounge", url: "https://ice1.somafm.com/illstreet-128-mp3", genre: "Jazz" },

  // AMBIENT (10 stations)
  { id: "soma-drone", name: "SomaFM Drone Zone", url: "https://ice1.somafm.com/dronezone-128-mp3", genre: "Ambient" },
  { id: "soma-space", name: "SomaFM Space Station", url: "https://ice1.somafm.com/spacestation-128-mp3", genre: "Ambient" },
  { id: "soma-lush", name: "SomaFM Lush", url: "https://ice1.somafm.com/lush-128-mp3", genre: "Ambient" },
  { id: "soma-groove", name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-256-mp3", genre: "Ambient" },
  { id: "ambient-sleeping", name: "Ambient Sleeping Pill", url: "https://radio.stereoscenic.com/asp-h", genre: "Ambient" },
  { id: "deep-space", name: "Deep Space One", url: "https://radio.stereoscenic.com/dso-h", genre: "Ambient" },
  { id: "soma-deepspaceone", name: "SomaFM Deep Space One", url: "http://ice1.somafm.com/deepspaceone-128-mp3", genre: "Ambient" },
  { id: "soma-digitalis", name: "SomaFM Digitalis", url: "http://ice1.somafm.com/digitalis-128-mp3", genre: "Ambient" },
  { id: "soma-thetrip", name: "SomaFM The Trip", url: "http://ice1.somafm.com/thetrip-128-mp3", genre: "Ambient" },
  { id: "soma-secretagent", name: "SomaFM Secret Agent", url: "http://ice1.somafm.com/secretagent-128-mp3", genre: "Ambient" },

  // ELECTRONIC (10 stations)
  { id: "paradise-main", name: "Radio Paradise Main Mix", url: "https://stream.radioparadise.com/aac-320", genre: "Electronic" },
  { id: "paradise-mellow", name: "Radio Paradise Mellow Mix", url: "https://stream.radioparadise.com/mellow-320", genre: "Electronic" },
  { id: "paradise-eclectic", name: "Radio Paradise Eclectic Mix", url: "https://stream.radioparadise.com/eclectic-320", genre: "Electronic" },
  { id: "paradise-rock", name: "Radio Paradise Rock Mix", url: "https://stream.radioparadise.com/rock-320", genre: "Electronic" },
  { id: "paradise-uk", name: "Radio Paradise UK Mirror", url: "https://stream-uk1.radioparadise.com/aac-320", genre: "Electronic" },
  { id: "nightride", name: "NightRide FM", url: "https://stream.nightride.fm/nightride.mp3", genre: "Electronic" },
  { id: "soma-defcon", name: "SomaFM DEF CON Radio", url: "https://ice1.somafm.com/defcon-128-mp3", genre: "Electronic" },
  { id: "paradise-world", name: "Radio Paradise World Mix", url: "https://stream.radioparadise.com/world-320", genre: "Electronic" },
  { id: "soma-dubstep", name: "SomaFM Dub Step Beyond", url: "http://ice1.somafm.com/dubstep-128-mp3", genre: "Electronic" },
  { id: "soma-poptron", name: "SomaFM PopTron", url: "http://ice1.somafm.com/poptron-128-mp3", genre: "Electronic" },

  // INDIE & ROCK (10 stations)
  { id: "kexp-mp3", name: "KEXP 90.3 Seattle", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", genre: "Indie & Rock" },
  { id: "the-current", name: "The Current 89.3 Minneapolis", url: "https://current.stream.publicradio.org/kcmp.mp3", genre: "Indie & Rock" },
  { id: "somafm-indiepop", name: "SomaFM Indie Pop Rocks", url: "https://ice1.somafm.com/indiepop-128-mp3", genre: "Indie & Rock" },
  { id: "somafm-u80s", name: "SomaFM Underground 80s", url: "https://ice1.somafm.com/u80s-128-mp3", genre: "Indie & Rock" },
  { id: "somafm-seventies", name: "SomaFM Left Coast 70s", url: "https://ice1.somafm.com/seventies-128-mp3", genre: "Indie & Rock" },
  { id: "somafm-bagel", name: "SomaFM Bagel Radio", url: "https://ice1.somafm.com/bagel-128-mp3", genre: "Indie & Rock" },
  { id: "soma-metal", name: "SomaFM Metal Detector", url: "http://ice1.somafm.com/metal-128-mp3", genre: "Indie & Rock" },
  { id: "soma-folkfwd", name: "SomaFM Folk Forward", url: "http://ice1.somafm.com/folkfwd-128-mp3", genre: "Indie & Rock" },
  { id: "soma-beatblender", name: "SomaFM Beat Blender", url: "http://ice1.somafm.com/beatblender-128-mp3", genre: "Indie & Rock" },
  { id: "somafm-altrock", name: "SomaFM Boot Liquor", url: "http://ice1.somafm.com/bootliquor-128-mp3", genre: "Indie & Rock" },
]

export const radioStationMap: Record<string, RadioStation> = Object.fromEntries(
  radioStations.map((station) => [station.id, station])
)

export function getRadioStationById(id: string) {
  return radioStationMap[id]
}

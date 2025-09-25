"use client"

import type React from "react"
import { Search, MapPin } from "lucide-react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getCountryFlag } from "./CountryFlags"
import { toast } from "sonner"

interface AddTimeZoneProps {
  onAdd: (name: string, timeZone: string, countryCode: string) => void
  onClose: () => void
}

const timeZones = [
  // North America
  { name: "New York", zone: "America/New_York", countryCode: "US" },
  { name: "Los Angeles", zone: "America/Los_Angeles", countryCode: "US" },
  { name: "Chicago", zone: "America/Chicago", countryCode: "US" },
  { name: "Phoenix", zone: "America/Phoenix", countryCode: "US" },
  { name: "Denver", zone: "America/Denver", countryCode: "US" },
  { name: "Anchorage", zone: "America/Anchorage", countryCode: "US" },
  { name: "Honolulu", zone: "Pacific/Honolulu", countryCode: "US" },
  { name: "Toronto", zone: "America/Toronto", countryCode: "CA" },
  { name: "Vancouver", zone: "America/Vancouver", countryCode: "CA" },
  { name: "Montreal", zone: "America/Montreal", countryCode: "CA" },
  { name: "Mexico City", zone: "America/Mexico_City", countryCode: "MX" },

  // South America
  { name: "São Paulo", zone: "America/Sao_Paulo", countryCode: "BR" },
  { name: "Rio de Janeiro", zone: "America/Rio_de_Janeiro", countryCode: "BR" },
  { name: "Buenos Aires", zone: "America/Argentina/Buenos_Aires", countryCode: "AR" },
  { name: "Santiago", zone: "America/Santiago", countryCode: "CL" },
  { name: "Lima", zone: "America/Lima", countryCode: "PE" },
  { name: "Bogota", zone: "America/Bogota", countryCode: "CO" },
  { name: "Caracas", zone: "America/Caracas", countryCode: "VE" },

  // Europe
  { name: "London", zone: "Europe/London", countryCode: "GB" },
  { name: "Paris", zone: "Europe/Paris", countryCode: "FR" },
  { name: "Berlin", zone: "Europe/Berlin", countryCode: "DE" },
  { name: "Rome", zone: "Europe/Rome", countryCode: "IT" },
  { name: "Madrid", zone: "Europe/Madrid", countryCode: "ES" },
  { name: "Amsterdam", zone: "Europe/Amsterdam", countryCode: "NL" },
  { name: "Brussels", zone: "Europe/Brussels", countryCode: "BE" },
  { name: "Vienna", zone: "Europe/Vienna", countryCode: "AT" },
  { name: "Copenhagen", zone: "Europe/Copenhagen", countryCode: "DK" },
  { name: "Stockholm", zone: "Europe/Stockholm", countryCode: "SE" },
  { name: "Oslo", zone: "Europe/Oslo", countryCode: "NO" },
  { name: "Helsinki", zone: "Europe/Helsinki", countryCode: "FI" },
  { name: "Moscow", zone: "Europe/Moscow", countryCode: "RU" },
  { name: "Athens", zone: "Europe/Athens", countryCode: "GR" },
  { name: "Istanbul", zone: "Europe/Istanbul", countryCode: "TR" },
  { name: "Dublin", zone: "Europe/Dublin", countryCode: "IE" },
  { name: "Warsaw", zone: "Europe/Warsaw", countryCode: "PL" },
  { name: "Zurich", zone: "Europe/Zurich", countryCode: "CH" },

  // Additional European Cities
  { name: "Prague", zone: "Europe/Prague", countryCode: "CZ" },
  { name: "Budapest", zone: "Europe/Budapest", countryCode: "HU" },
  { name: "Bucharest", zone: "Europe/Bucharest", countryCode: "RO" },
  { name: "Sofia", zone: "Europe/Sofia", countryCode: "BG" },
  { name: "Belgrade", zone: "Europe/Belgrade", countryCode: "RS" },
  { name: "Kiev", zone: "Europe/Kiev", countryCode: "UA" },
  { name: "Minsk", zone: "Europe/Minsk", countryCode: "BY" },
  { name: "Riga", zone: "Europe/Riga", countryCode: "LV" },
  { name: "Tallinn", zone: "Europe/Tallinn", countryCode: "EE" },
  { name: "Vilnius", zone: "Europe/Vilnius", countryCode: "LT" },
  { name: "Reykjavik", zone: "Atlantic/Reykjavik", countryCode: "IS" },

  // Asia
  { name: "Tokyo", zone: "Asia/Tokyo", countryCode: "JP" },
  { name: "Beijing", zone: "Asia/Shanghai", countryCode: "CN" },
  { name: "Shanghai", zone: "Asia/Shanghai", countryCode: "CN" },
  { name: "Hong Kong", zone: "Asia/Hong_Kong", countryCode: "HK" },
  { name: "Seoul", zone: "Asia/Seoul", countryCode: "KR" },
  { name: "Singapore", zone: "Asia/Singapore", countryCode: "SG" },
  { name: "Bangkok", zone: "Asia/Bangkok", countryCode: "TH" },
  { name: "Jakarta", zone: "Asia/Jakarta", countryCode: "ID" },
  { name: "Manila", zone: "Asia/Manila", countryCode: "PH" },
  { name: "Kuala Lumpur", zone: "Asia/Kuala_Lumpur", countryCode: "MY" },
  { name: "New Delhi", zone: "Asia/Kolkata", countryCode: "IN" },
  { name: "Mumbai", zone: "Asia/Kolkata", countryCode: "IN" },
  { name: "Dubai", zone: "Asia/Dubai", countryCode: "AE" },
  { name: "Abu Dhabi", zone: "Asia/Dubai", countryCode: "AE" },
  { name: "Riyadh", zone: "Asia/Riyadh", countryCode: "SA" },
  { name: "Tel Aviv", zone: "Asia/Tel_Aviv", countryCode: "IL" },
  { name: "Taipei", zone: "Asia/Taipei", countryCode: "TW" },
  { name: "Ho Chi Minh City", zone: "Asia/Ho_Chi_Minh", countryCode: "VN" },
  { name: "Karachi", zone: "Asia/Karachi", countryCode: "PK" },
  { name: "Dhaka", zone: "Asia/Dhaka", countryCode: "BD" },

  // Additional Asian Cities
  { name: "Almaty", zone: "Asia/Almaty", countryCode: "KZ" },
  { name: "Tashkent", zone: "Asia/Tashkent", countryCode: "UZ" },
  { name: "Ashgabat", zone: "Asia/Ashgabat", countryCode: "TM" },
  { name: "Bishkek", zone: "Asia/Bishkek", countryCode: "KG" },
  { name: "Dushanbe", zone: "Asia/Dushanbe", countryCode: "TJ" },
  { name: "Thimphu", zone: "Asia/Thimphu", countryCode: "BT" },
  { name: "Kathmandu", zone: "Asia/Kathmandu", countryCode: "NP" },
  { name: "Colombo", zone: "Asia/Colombo", countryCode: "LK" },
  { name: "Yangon", zone: "Asia/Yangon", countryCode: "MM" },
  { name: "Vientiane", zone: "Asia/Vientiane", countryCode: "LA" },
  { name: "Phnom Penh", zone: "Asia/Phnom_Penh", countryCode: "KH" },
  { name: "Ulaanbaatar", zone: "Asia/Ulaanbaatar", countryCode: "MN" },
  { name: "Pyongyang", zone: "Asia/Pyongyang", countryCode: "KP" },

  // Oceania
  { name: "Sydney", zone: "Australia/Sydney", countryCode: "AU" },
  { name: "Melbourne", zone: "Australia/Melbourne", countryCode: "AU" },
  { name: "Brisbane", zone: "Australia/Brisbane", countryCode: "AU" },
  { name: "Perth", zone: "Australia/Perth", countryCode: "AU" },
  { name: "Adelaide", zone: "Australia/Adelaide", countryCode: "AU" },
  { name: "Auckland", zone: "Pacific/Auckland", countryCode: "NZ" },
  { name: "Wellington", zone: "Pacific/Auckland", countryCode: "NZ" },
  { name: "Fiji", zone: "Pacific/Fiji", countryCode: "FJ" },

  // Additional Pacific/Oceania
  { name: "Port Moresby", zone: "Pacific/Port_Moresby", countryCode: "PG" },
  { name: "Noumea", zone: "Pacific/Noumea", countryCode: "NC" },
  { name: "Pago Pago", zone: "Pacific/Pago_Pago", countryCode: "AS" },
  { name: "Apia", zone: "Pacific/Apia", countryCode: "WS" },
  { name: "Nuku'alofa", zone: "Pacific/Tongatapu", countryCode: "TO" },

  // Africa
  { name: "Cairo", zone: "Africa/Cairo", countryCode: "EG" },
  { name: "Johannesburg", zone: "Africa/Johannesburg", countryCode: "ZA" },
  { name: "Lagos", zone: "Africa/Lagos", countryCode: "NG" },
  { name: "Nairobi", zone: "Africa/Nairobi", countryCode: "KE" },
  { name: "Casablanca", zone: "Africa/Casablanca", countryCode: "MA" },
  { name: "Addis Ababa", zone: "Africa/Addis_Ababa", countryCode: "ET" },
  { name: "Algiers", zone: "Africa/Algiers", countryCode: "DZ" },
  { name: "Tunis", zone: "Africa/Tunis", countryCode: "TN" },

  // Additional African Cities
  { name: "Khartoum", zone: "Africa/Khartoum", countryCode: "SD" },
  { name: "Kampala", zone: "Africa/Kampala", countryCode: "UG" },
  { name: "Dar es Salaam", zone: "Africa/Dar_es_Salaam", countryCode: "TZ" },
  { name: "Lusaka", zone: "Africa/Lusaka", countryCode: "ZM" },
  { name: "Harare", zone: "Africa/Harare", countryCode: "ZW" },
  { name: "Maputo", zone: "Africa/Maputo", countryCode: "MZ" },
  { name: "Luanda", zone: "Africa/Luanda", countryCode: "AO" },
  { name: "Kinshasa", zone: "Africa/Kinshasa", countryCode: "CD" },
  { name: "Brazzaville", zone: "Africa/Brazzaville", countryCode: "CG" },
  { name: "Libreville", zone: "Africa/Libreville", countryCode: "GA" },
  { name: "Yaounde", zone: "Africa/Douala", countryCode: "CM" },
  { name: "Dakar", zone: "Africa/Dakar", countryCode: "SN" },
  { name: "Abidjan", zone: "Africa/Abidjan", countryCode: "CI" },
  { name: "Accra", zone: "Africa/Accra", countryCode: "GH" },

  // Additional Middle Eastern Cities
  { name: "Baghdad", zone: "Asia/Baghdad", countryCode: "IQ" },
  { name: "Tehran", zone: "Asia/Tehran", countryCode: "IR" },
  { name: "Kuwait City", zone: "Asia/Kuwait", countryCode: "KW" },
  { name: "Manama", zone: "Asia/Bahrain", countryCode: "BH" },
  { name: "Doha", zone: "Asia/Qatar", countryCode: "QA" },
  { name: "Muscat", zone: "Asia/Muscat", countryCode: "OM" },
  { name: "Sanaa", zone: "Asia/Aden", countryCode: "YE" },
  { name: "Amman", zone: "Asia/Amman", countryCode: "JO" },
  { name: "Damascus", zone: "Asia/Damascus", countryCode: "SY" },
  { name: "Beirut", zone: "Asia/Beirut", countryCode: "LB" },

  // Additional American Cities
  { name: "San Juan", zone: "America/Puerto_Rico", countryCode: "PR" },
  { name: "Panama City", zone: "America/Panama", countryCode: "PA" },
  { name: "San Jose", zone: "America/Costa_Rica", countryCode: "CR" },
  { name: "Managua", zone: "America/Managua", countryCode: "NI" },
  { name: "San Salvador", zone: "America/El_Salvador", countryCode: "SV" },
  { name: "Guatemala City", zone: "America/Guatemala", countryCode: "GT" },
  { name: "Quito", zone: "America/Guayaquil", countryCode: "EC" },
  { name: "La Paz", zone: "America/La_Paz", countryCode: "BO" },
  { name: "Asuncion", zone: "America/Asuncion", countryCode: "PY" },
  { name: "Montevideo", zone: "America/Montevideo", countryCode: "UY" }
].sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by city name

export default function AddTimeZone({ onAdd, onClose }: AddTimeZoneProps) {
  const [selectedTimeZone, setSelectedTimeZone] = useState("")
  const [search, setSearch] = useState("")

  const filteredTimeZones = useMemo(() => timeZones.filter(tz => 
    tz.name.toLowerCase().includes(search.toLowerCase()) ||
    tz.zone.toLowerCase().includes(search.toLowerCase())
  ), [search])

  const detectLocalTimeZone = () => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!zone) {
      toast.error("Unable to detect your time zone.")
      return
    }

    const existing = timeZones.find((tz) => tz.zone === zone)
    if (existing) {
      onAdd(existing.name, existing.zone, existing.countryCode)
      toast.success(`Added ${existing.name}`)
      onClose()
      return
    }

    const cityName = zone.split('/').pop()?.replace(/_/g, ' ') ?? 'Local Time'
    const regionCode = zone.split('/')[0]?.slice(0, 2).toUpperCase() ?? '??'
    onAdd(cityName, zone, regionCode)
    toast.success(`Added ${cityName}`)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTimeZone) {
      const [name, zone, countryCode] = selectedTimeZone.split("|")
      onAdd(name, zone, countryCode)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search time zones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "pl-9",
              "bg-foreground/5 border-border/10",
              "text-foreground placeholder:text-foreground/50",
              "focus:border-border/20 focus:ring-0",
              "h-10 rounded-lg"
            )}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={detectLocalTimeZone}
          className="w-full border-border/20 bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground"
        >
          <MapPin className="h-4 w-4 mr-2" /> Detect My City
        </Button>

        <Select onValueChange={setSelectedTimeZone} required>
          <SelectTrigger
            className={cn(
              "bg-foreground/5 border-border/10",
              "text-foreground placeholder:text-foreground/50",
              "focus:border-border/20 focus:ring-0",
              "h-12 px-4 rounded-lg",
            )}
          >
            <SelectValue placeholder="Choose a time zone" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-foreground border-border/10">
            <ScrollArea className="h-[300px]">
              <SelectGroup>
                {filteredTimeZones.map((tz) => {
                  const Flag = getCountryFlag(tz.countryCode)
                  return (
                    <SelectItem key={tz.zone} value={`${tz.name}|${tz.zone}|${tz.countryCode}`}>
                      <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        <span>{tz.name}</span>
                        <span className="text-foreground/40 text-xs">({tz.zone})</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className={cn(
            "border-border/40 text-foreground font-medium",
            "bg-gray-800/50",
            "hover:bg-gray-700/70 hover:text-foreground hover:border-border/60",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-gray-900",
          )}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={cn(
            "bg-gradient-to-r from-cyan-500 to-purple-500",
            "text-foreground font-medium",
            "border-0",
            "hover:from-cyan-600 hover:to-purple-600",
            "focus:ring-0",
          )}
        >
          Add Time Zone
        </Button>
      </div>
    </form>
  )
}

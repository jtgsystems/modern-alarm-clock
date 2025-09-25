"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDynamicTheme } from "./DynamicThemeProvider"

interface TimeZone {
  name: string
  timeZone: string
  countryCode: string
}

interface WorldClocksProps {
  onAddTimeZone?: () => void
  className?: string
}

const defaultTimeZones: TimeZone[] = [
  { name: "Toronto", timeZone: "America/Toronto", countryCode: "CA" },
  { name: "New York", timeZone: "America/New_York", countryCode: "US" },
  { name: "Los Angeles", timeZone: "America/Los_Angeles", countryCode: "US" },
  { name: "London", timeZone: "Europe/London", countryCode: "GB" },
  { name: "Paris", timeZone: "Europe/Paris", countryCode: "FR" },
  { name: "Berlin", timeZone: "Europe/Berlin", countryCode: "DE" },
  { name: "Moscow", timeZone: "Europe/Moscow", countryCode: "RU" },
  { name: "Dubai", timeZone: "Asia/Dubai", countryCode: "AE" },
  { name: "Mumbai", timeZone: "Asia/Kolkata", countryCode: "IN" },
  { name: "Singapore", timeZone: "Asia/Singapore", countryCode: "SG" },
  { name: "Tokyo", timeZone: "Asia/Tokyo", countryCode: "JP" },
  { name: "Sydney", timeZone: "Australia/Sydney", countryCode: "AU" },
  { name: "Auckland", timeZone: "Pacific/Auckland", countryCode: "NZ" },
]

function getCountryFlag(countryCode: string) {
  const flagMap: Record<string, string> = {
    CA: "🇨🇦", US: "🇺🇸", GB: "🇬🇧", FR: "🇫🇷", DE: "🇩🇪",
    RU: "🇷🇺", AE: "🇦🇪", IN: "🇮🇳", SG: "🇸🇬", JP: "🇯🇵",
    AU: "🇦🇺", NZ: "🇳🇿"
  }
  return flagMap[countryCode] || "🌍"
}

export default function WorldClocks({ onAddTimeZone, className = '' }: WorldClocksProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeZones] = useState<TimeZone[]>(defaultTimeZones)
  const { currentTheme } = useDynamicTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimeForZone = (timezone: string) => {
    return currentTime.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          World Clocks
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTimeZone}
          className="text-xs h-6 px-2"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
        {timeZones.slice(0, 12).map((tz, index) => (
          <motion.div
            key={tz.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-foreground/5 backdrop-blur-sm border border-border/10 hover:bg-foreground/10 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{getCountryFlag(tz.countryCode)}</span>
              <span className="text-xs font-medium">{tz.name}</span>
            </div>
            <div
              className="text-xs font-mono tabular-nums"
              style={{ color: currentTheme.colors.accent }}
            >
              {formatTimeForZone(tz.timeZone)}
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
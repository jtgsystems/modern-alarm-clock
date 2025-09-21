"use client"

import { useState, useEffect } from "react"
import { getMockWeather } from "@/lib/mockWeather"
import { type WeatherData } from "@/lib/weather"
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from "lucide-react"
import { useDynamicTheme } from "./DynamicThemeProvider"
import { motion } from "framer-motion"

interface WeatherDisplayProps {
  city?: string
}

export default function WeatherDisplay({ city = "New York" }: WeatherDisplayProps) {
  const { currentTheme } = useDynamicTheme()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  useEffect(() => {
    const data = getMockWeather()
    setWeatherData(data)
  }, [])

  if (!weatherData) return null

  const getDayName = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" })
  }

  const getIconColor = (condition: string) => {
    if (!condition) return 'text-gray-400'
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'text-yellow-400'
      case 'cloudy':
        return 'text-gray-400'
      case 'rain':
        return 'text-blue-400'
      case 'snow':
        return 'text-blue-200'
      default:
        return 'text-gray-400'
    }
  }

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Cloud className="w-10 h-10 text-gray-400" />
    const colorClass = getIconColor(condition)
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className={`w-10 h-10 ${colorClass}`} />
      case 'cloudy':
        return <Cloud className={`w-10 h-10 ${colorClass}`} />
      case 'rain':
        return <CloudRain className={`w-10 h-10 ${colorClass}`} />
      case 'snow':
        return <CloudSnow className={`w-10 h-10 ${colorClass}`} />
      default:
        return <Cloud className={`w-10 h-10 ${colorClass}`} />
    }
  }

  // simple clothing advice based on temp and condition
  const temp = weatherData.current.temperature
  const cond = (weatherData.current.description || '').toLowerCase()
  const suggestions: { icon: string; label: string }[] = []
  if (temp <= 5) {
    suggestions.push({ icon: '🧥', label: 'Coat' }, { icon: '🧣', label: 'Scarf' }, { icon: '🧤', label: 'Gloves' })
  } else if (temp <= 15) {
    suggestions.push({ icon: '🧥', label: 'Light Jacket' }, { icon: '👖', label: 'Pants' })
  } else if (temp >= 26) {
    suggestions.push({ icon: '👕', label: 'T-Shirt' }, { icon: '🧢', label: 'Cap' })
  } else {
    suggestions.push({ icon: '👕', label: 'Layers' })
  }
  if (cond.includes('rain')) suggestions.push({ icon: '☔', label: 'Umbrella' })
  if (cond.includes('snow')) suggestions.push({ icon: '🥾', label: 'Boots' })

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl backdrop-blur-xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.gradient}), rgba(255, 255, 255, 0.03)`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dynamic background overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${currentTheme.colors.accent}40 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, ${currentTheme.colors.accent}20 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-white/60 font-semibold">{city}</p>
            <p className="text-base text-white/70 mt-1">{weatherData.current.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-6xl font-bold leading-none text-white mb-2" style={{ color: currentTheme.colors.accent }}>
                {weatherData.current.temperature}°C
              </div>
              <div className="flex items-center justify-end gap-4 text-sm text-white/70">
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl backdrop-blur-sm"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Droplets className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                  {weatherData.current.humidity}%
                </motion.span>
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl backdrop-blur-sm"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Wind className="h-4 w-4" style={{ color: currentTheme.colors.accent }} />
                  {weatherData.current.windSpeed} km/h
                </motion.span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {getWeatherIcon(weatherData.current.description)}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span
            className="px-4 py-2 rounded-2xl text-sm font-medium capitalize text-white backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.accent}30, ${currentTheme.colors.accent}15)`,
              border: `1px solid ${currentTheme.colors.accent}40`
            }}
          >
            {weatherData.current.description}
          </span>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm text-white/70 mb-4 tracking-wide font-semibold">Suggested Clothing</h3>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={`${s.label}-${i}`}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
                whileHover={{
                  scale: 1.05,
                  background: `${currentTheme.colors.accent}20`
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl leading-none">{s.icon}</span>
                <span className="text-sm text-white/80 font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm text-white/70 mb-4 tracking-wide font-semibold">5-Day Forecast</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {weatherData.forecast.map((day, i) => (
              <motion.div
                key={i}
                className="rounded-2xl backdrop-blur-sm p-4 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
                whileHover={{
                  scale: 1.05,
                  background: `${currentTheme.colors.accent}15`
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-xs text-white/60 font-medium uppercase tracking-wide">{getDayName(day.date)}</div>
                <div className="flex items-center justify-center h-12 mt-2">
                  {getWeatherIcon(day.description || '')}
                </div>
                <div className="text-lg font-bold text-white mt-2">{day.temperature}°C</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

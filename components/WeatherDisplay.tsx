"use client"

import { useState, useEffect } from "react"
import { getMockWeather } from "@/lib/mockWeather"
import { type WeatherData } from "@/lib/weather"
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from "lucide-react"
import { useDynamicTheme } from "./DynamicThemeProvider"
import { useSettings } from "@/context/SettingsContext"

interface WeatherDisplayProps {
  city?: string
}

export default function WeatherDisplay({ city = "New York" }: WeatherDisplayProps) {
  const { currentTheme } = useDynamicTheme()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const { settings } = useSettings()
  // Use direct hex colors with alpha transparency

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
    if (!condition) return <Cloud className="w-8 h-8 text-gray-400" />
    const colorClass = getIconColor(condition)
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className={`w-8 h-8 ${colorClass}`} />
      case 'cloudy':
        return <Cloud className={`w-8 h-8 ${colorClass}`} />
      case 'rain':
        return <CloudRain className={`w-8 h-8 ${colorClass}`} />
      case 'snow':
        return <CloudSnow className={`w-8 h-8 ${colorClass}`} />
      default:
        return <Cloud className={`w-8 h-8 ${colorClass}`} />
    }
  }

  const units = settings.weather.units

  const formatTemperature = (value: number) => {
    if (units === 'imperial') {
      return Math.round((value * 9) / 5 + 32)
    }
    return Math.round(value)
  }

  const temperatureSymbol = units === 'imperial' ? '°F' : '°C'

  const formatWindSpeed = (value: number) => {
    if (units === 'imperial') {
      return Math.round(value * 0.621371)
    }
    return Math.round(value)
  }

  const windSpeedUnit = units === 'imperial' ? 'mph' : 'km/h'

  // simple clothing advice based on temp and condition (always using Celsius for logic)
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
    <div className="relative overflow-hidden rounded-2xl border border-border/10 bg-foreground/5 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      {/* Dynamic background overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${currentTheme.colors.accent}4D 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">{city}</p>
            <p className="text-xs text-foreground/70 mt-0.5">{weatherData.current.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold leading-none text-foreground" style={{ color: currentTheme.colors.accent }}>
                {formatTemperature(weatherData.current.temperature)}{temperatureSymbol}
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-foreground/70 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {weatherData.current.humidity}%
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {formatWindSpeed(weatherData.current.windSpeed)} {windSpeedUnit}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 w-8 h-8">
              {getWeatherIcon(weatherData.current.description)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center">
          <span
            className="px-3 py-1 rounded-lg text-xs font-medium capitalize text-foreground/90 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.accent}33, ${currentTheme.colors.accent}1A)`,
              border: `1px solid ${currentTheme.colors.accent}4D`
            }}
          >
            {weatherData.current.description}
          </span>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-foreground/70 mb-4 tracking-wide font-semibold">Suggested Clothing</h3>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((s, i) => (
              <div
                key={`${s.label}-${i}`}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <span className="text-xl leading-none">{s.icon}</span>
                <span className="text-sm text-foreground/80 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-foreground/70 mb-3 tracking-wide">7-Day Forecast</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weatherData.forecast.slice(0,7).map((day, i) => (
              <div
                key={i}
                className="rounded-2xl backdrop-blur-sm p-4 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div className="text-xs text-foreground/60 font-medium uppercase tracking-wide">{getDayName(day.date)}</div>
                <div className="flex items-center justify-center h-12 mt-2">
                  {getWeatherIcon(day.description || '')}
                </div>
                <div className="text-lg font-bold text-foreground mt-2 flex justify-center">
                  {formatTemperature(day.temperature)}{temperatureSymbol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

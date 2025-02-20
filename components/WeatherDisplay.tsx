"use client"

import { useState, useEffect } from "react"
import { getMockWeather, type WeatherData } from "@/lib/mockWeather"
import { Cloud, CloudRain, CloudSnow, Sun } from "lucide-react"

interface WeatherDisplayProps {
  city?: string
}

export default function WeatherDisplay({ city = "New York" }: WeatherDisplayProps) {
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

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-white/10">
      <div className="grid grid-cols-1 gap-6">
        {/* Current Weather */}
        <div className="grid grid-cols-2 items-center justify-items-center">
          <div className="flex flex-col items-center gap-2">
            {getWeatherIcon(weatherData.current.description)}
            <p className="text-gray-400 capitalize">
              {weatherData.current.description}
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold">{weatherData.current.temperature}°C</span>
          </div>
        </div>

        {/* Clothing Suggestions */}
        <div className="space-y-4">
          <h3 className="text-sm text-gray-400 text-center">Suggested Clothing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50">
              <div className="text-gray-300 text-2xl">🧥</div>
              <span className="text-xs text-gray-400">Coat</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50">
              <div className="text-gray-300 text-2xl">🧣</div>
              <span className="text-xs text-gray-400">Scarf</span>
            </div>
          </div>
          <p className="text-center text-gray-400">
            It's cold. Wear a warm coat and consider a scarf.
          </p>
        </div>

        {/* 5-Day Forecast */}
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-5 gap-4">
            {weatherData.forecast.map((day: { date: string; description: string; temperature: number }, i: number) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-400">{getDayName(day.date)}</span>
                {getWeatherIcon(day.description)}
                <span className="text-sm font-medium">{day.temperature}°C</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
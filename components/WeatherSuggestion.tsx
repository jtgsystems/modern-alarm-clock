"use client"

import { 
  Coffee, 
  Droplet, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Wind,
  Leaf,
  Umbrella,
  Waves,
  ThermometerSun,
  ThermometerSnowflake,
  Footprints,
  Car,
  Heart,
  AlertTriangle,
  Eye,
  Moon,
  Sunrise
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherSuggestionProps {
  temperature: number // in Celsius
  condition: string
  humidity: number
  windSpeed: number
}

interface Suggestion {
  text: string
  icon: React.ReactNode
  priority: number
}

function getWeatherSuggestions(temp: number, condition: string | undefined | null, humidity: number, windSpeed: number): Suggestion[] {
  const suggestions: Suggestion[] = []
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 12
  const isAfternoon = hour >= 12 && hour < 17
  const isEvening = hour >= 17 && hour < 22
  const isNight = hour >= 22 || hour < 5
  const weatherCondition = condition?.toLowerCase() || 'clear'

  // Temperature based drink and food suggestions
  if (temp <= 0) {
    suggestions.push({
      text: isEvening 
        ? "Perfect time for hot soup or warm tea before bed"
        : "Start your day with hot oatmeal and coffee",
      icon: <ThermometerSnowflake className="h-4 w-4" />,
      priority: 1
    })
  } else if (temp <= 10) {
    suggestions.push({
      text: isEvening
        ? "Enjoy a warming cup of herbal tea or hot chocolate"
        : "A hot breakfast and coffee will help warm you up",
      icon: <Coffee className="h-4 w-4" />,
      priority: 1
    })
  } else if (temp >= 30) {
    suggestions.push({
      text: isEvening
        ? "Stay hydrated with cool drinks, avoid caffeine before bed"
        : "Start your day with a refreshing smoothie or iced drink",
      icon: <Waves className="h-4 w-4" />,
      priority: 1
    })
  } else if (temp >= 25) {
    suggestions.push({
      text: isEvening
        ? "Consider light, cooling drinks like herbal iced tea"
        : "Stay refreshed with cold water or iced coffee",
      icon: <Droplet className="h-4 w-4" />,
      priority: 1
    })
  }

  // Activity suggestions based on temperature
  if (temp >= 15 && temp <= 25 && weatherCondition !== "rain") {
    suggestions.push({
      text: isEvening
        ? "Perfect temperature for an evening walk"
        : "Great weather for morning exercise outdoors",
      icon: <Footprints className="h-4 w-4" />,
      priority: 2
    })
  }

  // Seasonal comfort suggestions
  if (temp <= 5) {
    suggestions.push({
      text: "Keep warm with thermal layers and heat-retaining fabrics",
      icon: <ThermometerSnowflake className="h-4 w-4" />,
      priority: 2
    })
  } else if (temp >= 28) {
    suggestions.push({
      text: "Stay cool with breathable cotton and loose-fitting clothes",
      icon: <ThermometerSun className="h-4 w-4" />,
      priority: 2
    })
  }

  // Combined weather condition suggestions
  if (temp > 20 && humidity > 70) {
    suggestions.push({
      text: "High humidity - light, moisture-wicking clothes recommended",
      icon: <Droplet className="h-4 w-4" />,
      priority: 2
    })
  }

  if (windSpeed > 15 && temp < 15) {
    suggestions.push({
      text: "Wind chill alert - wear windproof layers",
      icon: <Wind className="h-4 w-4" />,
      priority: 1
    })
  }

  // Time-specific advice
  if (isMorning) {
    if (temp < 5) {
      suggestions.push({
        text: "Allow extra time for morning commute. Car may need warming up",
        icon: <Sunrise className="h-4 w-4" />,
        priority: 1
      })
    }
    if (weatherCondition === "clear") {
      suggestions.push({
        text: "Morning sun may cause glare - have sunglasses ready for commute",
        icon: <Eye className="h-4 w-4" />,
        priority: 2
      })
    }
  } else if (isAfternoon) {
    if (temp > 25) {
      suggestions.push({
        text: "Peak heat hours - schedule outdoor activities for early morning or evening",
        icon: <Sun className="h-4 w-4" />,
        priority: 1
      })
    }
  } else if (isEvening) {
    if (temp > 20) {
      suggestions.push({
        text: "Pleasant evening temperature - good time for outdoor activities",
        icon: <Moon className="h-4 w-4" />,
        priority: 2
      })
    }
    suggestions.push({
      text: "Temperature will drop overnight - have extra layer ready",
      icon: <ThermometerSnowflake className="h-4 w-4" />,
      priority: 2
    })
  } else if (isNight) {
    suggestions.push({
      text: "Late night/early morning - reduced visibility, drive with extra caution",
      icon: <Moon className="h-4 w-4" />,
      priority: 1
    })
  }

  // Road and visibility conditions
  if (weatherCondition === "rain" || weatherCondition === "snow") {
    suggestions.push({
      text: "Reduced visibility on roads - drive with caution, increase following distance",
      icon: <Eye className="h-4 w-4" />,
      priority: 1
    })
  }

  if (temp <= 2) {
    suggestions.push({
      text: "Risk of black ice on roads - extreme caution while driving",
      icon: <Car className="h-4 w-4" />,
      priority: 1
    })
  }

  // Health precautions
  if (temp >= 30) {
    suggestions.push({
      text: "High heat - risk of heat exhaustion. Stay in shade, limit outdoor activity",
      icon: <Heart className="h-4 w-4" />,
      priority: 1
    })
  } else if (temp <= -5) {
    suggestions.push({
      text: "Extreme cold - risk of frostbite. Limit time outdoors",
      icon: <Heart className="h-4 w-4" />,
      priority: 1
    })
  }

  // Air quality warning during certain conditions
  if (humidity > 80 && temp > 25) {
    suggestions.push({
      text: "High humidity may affect air quality - consider indoor activities",
      icon: <AlertTriangle className="h-4 w-4" />,
      priority: 2
    })
  }

  // Weather-specific suggestions
  switch (weatherCondition) {
    case "rain":
      if (temp < 15) {
        suggestions.push({
          text: isNight ? "Cold rain at night - visibility severely reduced" : "Cold rain - bring a warm, waterproof jacket. Roads may be slippery",
          icon: <Umbrella className="h-4 w-4" />,
          priority: 1
        })
      } else {
        suggestions.push({
          text: "Warm rain - light raincoat should suffice. Watch for puddles",
          icon: <CloudRain className="h-4 w-4" />,
          priority: 1
        })
      }
      if (windSpeed > 10) {
        suggestions.push({
          text: "Rain with wind - umbrellas may be ineffective, opt for raincoat",
          icon: <Wind className="h-4 w-4" />,
          priority: 2
        })
      }
      break
    case "snow":
      suggestions.push({
        text: temp < -5 
          ? isNight ? "Extreme cold and snow at night - avoid travel if possible" : "Heavy winter gear and insulated boots required. Roads hazardous"
          : "Winter coat and waterproof boots recommended. Roads may be slippery",
        icon: <CloudSnow className="h-4 w-4" />,
        priority: 1
      })
      if (windSpeed > 10) {
        suggestions.push({
          text: "Blowing snow may reduce visibility - avoid travel if possible",
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 1
        })
      }
      break
    case "clear":
      if (temp > 20) {
        suggestions.push({
          text: isEvening
            ? "Pleasant evening - light layers sufficient"
            : "Sunny day - don't forget sunscreen, hat, and sunglasses. UV index may be high",
          icon: <Sun className="h-4 w-4" />,
          priority: 2
        })
      }
      if (temp < 0 && windSpeed > 5) {
        suggestions.push({
          text: "Clear and cold - severe wind chill possible",
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 1
        })
      }
      break
    case "cloudy":
      if (temp > 20) {
        suggestions.push({
          text: "Overcast but warm - dress in light layers. UV still present",
          icon: <Cloud className="h-4 w-4" />,
          priority: 2
        })
      }
      if (humidity > 75) {
        suggestions.push({
          text: "High humidity with cloud cover - chance of precipitation",
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 2
        })
      }
      break
  }

  // Seasonal allergies warning
  if (temp >= 15 && temp <= 25 && humidity > 60 && (weatherCondition === "clear" || weatherCondition === "cloudy")) {
    suggestions.push({
      text: "Moderate pollen levels likely - consider allergy precautions",
      icon: <Leaf className="h-4 w-4" />,
      priority: 3
    })
  }

  return suggestions.sort((a, b) => a.priority - b.priority)
}

export default function WeatherSuggestion({ temperature, condition, humidity, windSpeed }: WeatherSuggestionProps) {
  const suggestions = getWeatherSuggestions(temperature, condition, humidity, windSpeed)

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg",
            "bg-gradient-to-r",
            temperature <= 10 
              ? "from-blue-900/20 to-indigo-900/20 hover:from-blue-900/30 hover:to-indigo-900/30"
              : temperature >= 25
              ? "from-orange-900/20 to-red-900/20 hover:from-orange-900/30 hover:to-red-900/30"
              : "from-gray-900/20 to-gray-800/20 hover:from-gray-900/30 hover:to-gray-800/30",
            "backdrop-blur-sm",
            "text-sm",
            temperature <= 10 
              ? "text-blue-100/90"
              : temperature >= 25
              ? "text-orange-100/90"
              : "text-white/80",
            "border",
            temperature <= 10 
              ? "border-blue-500/10 hover:border-blue-500/20"
              : temperature >= 25
              ? "border-orange-500/10 hover:border-orange-500/20"
              : "border-white/10 hover:border-white/20",
            "transition-all duration-300",
            "animate-in fade-in-50 slide-in-from-bottom-2",
            "group",
            "relative overflow-hidden",
            "motion-safe:hover:scale-[1.02]",
            "motion-safe:active:scale-[0.98]"
          )}
          style={{
            animationDelay: `${index * 150}ms`
          }}
        >
          <div className={cn(
            "flex items-center justify-center",
            "w-8 h-8 rounded-full",
            temperature <= 10 
              ? "bg-blue-500/10 text-blue-400"
              : temperature >= 25
              ? "bg-orange-500/10 text-orange-400"
              : "bg-white/10 text-white/70",
            "transition-transform duration-300",
            "group-hover:scale-110"
          )}>
            {suggestion.icon}
          </div>

          <span className="flex-1">{suggestion.text}</span>
          
          {/* Hover effect gradient */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300",
            "pointer-events-none",
            temperature <= 10
              ? "bg-gradient-to-r from-blue-500/5 to-transparent"
              : temperature >= 25
              ? "bg-gradient-to-r from-orange-500/5 to-transparent"
              : "bg-gradient-to-r from-white/5 to-transparent"
          )} />
        </div>
      ))}
    </div>
  )
}

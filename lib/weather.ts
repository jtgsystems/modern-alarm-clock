const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export interface WeatherData {
  current: {
    temperature: number
    description: string
    icon: string
    humidity: number
    windSpeed: number
    date: string
  }
  forecast: Array<{
    date: string
    dayName: string
    temperature: number
    description: string
    icon: string
  }>
  alerts: Array<{
    event: string
    description: string
    start: number
    end: number
  }>
}

interface CurrentWeatherResponse {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  dt: number
  alerts?: Array<{
    event: string
    description: string
    start: number
    end: number
  }>
}

interface ForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      description: string
      icon: string
    }>
  }>
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const currentWeatherResponse = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`,
    {
      next: {
        revalidate: 300 // Revalidate every 5 minutes
      }
    }
  )
  const forecastResponse = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    {
      next: {
        revalidate: 300 // Revalidate every 5 minutes
      }
    }
  )

  if (!currentWeatherResponse.ok || !forecastResponse.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const currentWeatherData: CurrentWeatherResponse = await currentWeatherResponse.json()
  const forecastData: ForecastResponse = await forecastResponse.json()

  const forecast = forecastData.list
    .filter((_, index) => index % 8 === 0)
    .slice(0, 5)
    .map((day) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      dayName: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
      temperature: Math.round(day.main.temp),
      description: day.weather[0].description || 'clear',
      icon: day.weather[0].icon,
    }))

  return {
    current: {
      temperature: Math.round(currentWeatherData.main.temp),
      description: currentWeatherData.weather[0].description,
      humidity: currentWeatherData.main.humidity,
      // OpenWeather metric wind speed is m/s; convert to km/h
      windSpeed: Math.round(currentWeatherData.wind.speed * 3.6),
      icon: currentWeatherData.weather[0].icon,
      date: new Date(currentWeatherData.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    forecast: forecast,
    alerts: currentWeatherData.alerts || [],
  }
}

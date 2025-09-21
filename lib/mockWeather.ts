import { WeatherData } from './weather';

export function getMockWeather(): WeatherData {
  const conditions = [
    'clear',
    'cloudy',
    'rain',
    'snow'
  ];

  const now = new Date();
  const hour = now.getHours();

  // Temperature varies by time of day
  let baseTemp;
  const season = Math.floor((now.getMonth() + 1) / 3); // 0: Winter, 1: Spring, 2: Summer, 3: Fall

  switch(season) {
    case 0: // Winter
      baseTemp = 2; // Cold temperatures to trigger winter suggestions
      break;
    case 1: // Spring
      baseTemp = 15; // Mild temperatures
      break;
    case 2: // Summer
      baseTemp = 28; // Hot temperatures to trigger summer suggestions
      break;
    default: // Fall
      baseTemp = 18; // Mild temperat ures
      break;
  }

  // Add time of day and random variations
  baseTemp += hour >= 12 && hour <= 18 ? 5 : hour >= 19 || hour <= 5 ? -3 : 0;
  const temp = baseTemp + Math.floor(Math.random() * 5) - 2;
  const humidity = 60 + Math.floor(Math.random() * 20);
  const windSpeed = 5 + Math.floor(Math.random() * 10);
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    current: {
      temperature: temp,
      description: condition,
      humidity: humidity,
      windSpeed: windSpeed,
      icon: '01d',
      date: now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const forecastCondition = conditions[Math.floor(Math.random() * conditions.length)]
      return {
        date: date.toLocaleDateString(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        temperature: Math.round(baseTemp + Math.floor(Math.random() * 5) - 2),
        description: forecastCondition,
        icon: '01d'
      }
    }),
    alerts: []
  };
}

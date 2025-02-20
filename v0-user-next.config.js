/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["openweathermap.org"],
  },
  env: {
    OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
  },
}

module.exports = nextConfig


let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 2025 Update: Move turbo config to turbopack, remove experimental wrapper
  turbopack: {
    rules: {},
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
  },
  experimental: {
    webpackBuildWorker: true,
    serverActions: {
      bodySizeLimit: '2mb'
    },
    reactCompiler: true,
    // 2025 Stable: Modern optimizations
    optimizePackageImports: ['framer-motion', 'lucide-react']
  },
  // 2025 New: Output file tracing optimization
  outputFileTracingRoot: process.cwd(),
  // 2025 New: Modern bundling optimizations (swcMinify is now default)
  compiler: {
    // 2025: React Compiler configuration
    reactRemoveProperties: true,
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig

import "./globals.css"
import { Inter, Roboto, Montserrat, Lora, Space_Grotesk } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/SettingsContext"
import { Toaster } from "sonner"

// 2025 Modern Font Loading with display: swap for performance
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
  variable: '--font-roboto'
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: 'swap',
  variable: '--font-montserrat'
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: 'swap',
  variable: '--font-lora'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
  variable: '--font-space-grotesk'
})

// 2025 Enhanced Metadata with OpenGraph and SEO
export const metadata = {
  title: "Modern Alarm Clock",
  description: "A modern, accessible alarm clock built with Next.js and React",
  generator: 'v0.dev',
  keywords: 'alarm clock, modern, accessible, Next.js, React, time zones, weather',
  authors: [{ name: 'Modern Alarm Clock Team' }],
  openGraph: {
    title: 'Modern Alarm Clock',
    description: 'A modern, accessible alarm clock with multiple time zones and weather',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  // 2025 Modern Web App Manifest
  manifest: '/manifest.json',
}

// 2025 Modern Viewport Configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="midnight"
      className={`${inter.variable} ${roboto.variable} ${montserrat.variable} ${lora.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SettingsProvider>
            {children}

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
              toastOptions={{
                duration: 4000,
                className: 'backdrop-blur-md bg-surface/95 dark:bg-gray-900/90 border border-border/20 dark:border-gray-700/20 shadow-glass'
              }}
            />
          </SettingsProvider>
        </ThemeProvider>

        {/* 2025 Modern Performance and Analytics Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Web Vitals Monitoring */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // 2025 Core Web Vitals Monitoring
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                      getCLS(console.log);
                      getFID(console.log);
                      getFCP(console.log);
                      getLCP(console.log);
                      getTTFB(console.log);
                    });
                  }
                `
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}

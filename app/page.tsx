"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ClientMotionWrapper } from "../components/ClientMotionWrapper"
import { DynamicThemeProvider } from "../components/DynamicThemeProvider"
import { SettingsProvider } from "../context/SettingsContext"

const DynamicDigitalClock = dynamic(() => import('../components/DigitalClock'), { ssr: false })

// 2025 Modern Home Page with Full Alarm Clock
export default function Home() {
  return (
    <DynamicThemeProvider>
      <ClientMotionWrapper className="relative min-h-screen overflow-hidden bg-[#060b16] text-white">
 
        {/* Main Digital Clock Application with streamlined styling */}
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-white">Loading clock...</div>}>
          <DynamicDigitalClock />
        </Suspense>
 
      </ClientMotionWrapper>
    </DynamicThemeProvider>
  )
}

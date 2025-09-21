"use client"

import DigitalClock from "../components/DigitalClock"
import { DynamicThemeProvider } from "../components/DynamicThemeProvider"
import { ClientMotionWrapper } from "../components/ClientMotionWrapper"
import { SettingsProvider } from "../context/SettingsContext"

// 2025 Modern Home Page with Full Alarm Clock
export default function Home() {
  return (
    <SettingsProvider>
      <DynamicThemeProvider>
        <ClientMotionWrapper className="relative min-h-screen overflow-hidden bg-[#060b16] text-white">

          {/* Main Digital Clock Application with streamlined styling */}
          <DigitalClock />

        </ClientMotionWrapper>
      </DynamicThemeProvider>
    </SettingsProvider>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ClockDisplay from "./ClockDisplay"
import ControlPanel from "./ControlPanel"
import Sidebar from "./Sidebar"
import SettingsPanel from "./SettingsPanel"
import WeatherDisplay from "./WeatherDisplay"

interface MainClockProps {
  className?: string
}

export default function MainClock({ className = '' }: MainClockProps) {
  const [is24HourFormat, setIs24HourFormat] = useState(false)
  const [showSeconds, setShowSeconds] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleAlarmClick = () => {
    console.log('Alarm clicked')
    // TODO: Open alarm modal
  }

  const handleCalendarClick = () => {
    console.log('Calendar clicked')
    // TODO: Open calendar modal
  }

  const handleAddTimeZone = () => {
    console.log('Add timezone clicked')
    // TODO: Open add timezone modal
  }

  return (
    <div className={`min-h-screen flex flex-col xl:flex-row gap-6 p-4 xl:p-6 ${className}`}>
      {/* Main Clock Section */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto xl:mx-0">
        {/* Clock Display - Better positioning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 xl:mb-8"
        >
          <ClockDisplay
            is24HourFormat={is24HourFormat}
            showSeconds={showSeconds}
            size="large"
          />
        </motion.div>

        {/* Control Panel - Better spacing */}
        <ControlPanel
          onAlarmClick={handleAlarmClick}
          onCalendarClick={handleCalendarClick}
          onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)}
          isSettingsOpen={isSettingsOpen}
          className="mb-6 xl:mb-8"
        />

        {/* Weather Display - Reduced size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md"
        >
          <WeatherDisplay />
        </motion.div>
      </div>

      {/* Sidebar - Better responsive sizing */}
      <div className="w-full xl:w-80 xl:min-w-80">
        <Sidebar onAddTimeZone={handleAddTimeZone} />
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        is24HourFormat={is24HourFormat}
        showSeconds={showSeconds}
        onToggle24Hour={() => setIs24HourFormat(!is24HourFormat)}
        onToggleSeconds={() => setShowSeconds(!showSeconds)}
      />
    </div>
  )
}
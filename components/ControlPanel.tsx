"use client"

import { motion } from "framer-motion"
import AlarmButton from "./AlarmButton"
import CalendarButton from "./CalendarButton"
import SettingsButton from "./SettingsButton"
import ThemeToggle from "./ThemeToggle"

interface ControlPanelProps {
  onAlarmClick?: () => void
  onCalendarClick?: () => void
  onSettingsClick?: () => void
  isSettingsOpen?: boolean
  className?: string
}

export default function ControlPanel({
  onAlarmClick,
  onCalendarClick,
  onSettingsClick,
  isSettingsOpen = false,
  className = ''
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`flex gap-4 ${className}`}
    >
      <AlarmButton onClick={onAlarmClick} />
      <CalendarButton onClick={onCalendarClick} />
      <SettingsButton
        onClick={onSettingsClick}
        isActive={isSettingsOpen}
      />
      <ThemeToggle />
    </motion.div>
  )
}
"use client"

import { motion } from "framer-motion"
import WorldClocks from "./WorldClocks"
import RadioPlayer from "./RadioPlayer"
import Soundscapes from "./Soundscapes"

interface SidebarProps {
  onAddTimeZone?: () => void
  className?: string
}

export default function Sidebar({ onAddTimeZone, className = '' }: SidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className={`space-y-4 ${className}`}
    >
      {/* World Clocks Section */}
      <SidebarPanel className="max-h-96">
        <WorldClocks onAddTimeZone={onAddTimeZone} />
      </SidebarPanel>

      {/* Radio Player Section */}
      <SidebarPanel>
        <RadioPlayer />
      </SidebarPanel>

      {/* Soundscapes Section */}
      <SidebarPanel>
        <Soundscapes />
      </SidebarPanel>
    </motion.div>
  )
}

// Reusable Panel Component
interface SidebarPanelProps {
  children: React.ReactNode
  className?: string
}

function SidebarPanel({ children, className = '' }: SidebarPanelProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/8 hover:border-white/15 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}
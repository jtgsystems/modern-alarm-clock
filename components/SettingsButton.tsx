"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

interface SettingsButtonProps {
  onClick?: () => void
  isActive?: boolean
  className?: string
}

export default function SettingsButton({ onClick, isActive = false, className = '' }: SettingsButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`h-12 w-12 rounded-full backdrop-blur-sm border border-border/20 transition-colors duration-150 ${
          isActive ? 'bg-foreground/25 border-border/40' : 'bg-foreground/10'
        } ${isPressed ? 'bg-foreground/30' : ''}`}
      >
        <motion.div
          animate={{
            rotate: isActive ? 90 : 0,
            scale: isPressed ? 0.9 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Settings size={20} />
        </motion.div>
      </Button>
    </motion.div>
  )
}
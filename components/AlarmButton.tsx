"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface AlarmButtonProps {
  onClick?: () => void
  className?: string
}

export default function AlarmButton({ onClick, className = '' }: AlarmButtonProps) {
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
        className={`h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-colors duration-150 ${
          isPressed ? 'bg-white/30' : ''
        }`}
      >
        <motion.div
          animate={{ rotate: isPressed ? 10 : 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Fixed: Changed from Alarm to Clock icon */}
          <Clock size={20} />
        </motion.div>
      </Button>
    </motion.div>
  )
}
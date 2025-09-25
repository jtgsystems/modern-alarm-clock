"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface CalendarButtonProps {
  onClick?: () => void
  className?: string
}

export default function CalendarButton({ onClick, className = '' }: CalendarButtonProps) {
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
        className={`h-12 w-12 rounded-full bg-foreground/10 backdrop-blur-sm border border-border/20 transition-colors duration-150 ${
          isPressed ? 'bg-foreground/30' : ''
        }`}
      >
        <motion.div
          animate={{ rotateY: isPressed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Calendar size={20} />
        </motion.div>
      </Button>
    </motion.div>
  )
}
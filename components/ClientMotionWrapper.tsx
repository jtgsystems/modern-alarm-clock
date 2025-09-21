"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ClientMotionWrapperProps {
  children: React.ReactNode
  className?: string
}

export function ClientMotionWrapper({ children, className }: ClientMotionWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className={className}>
        {children}
      </main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.main>
  )
}
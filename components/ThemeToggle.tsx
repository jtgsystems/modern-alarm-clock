"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings, type AppTheme } from "@/context/SettingsContext"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()
  const { settings, setTheme: setAppTheme } = useSettings()
  const lastDarkThemeRef = useRef<AppTheme>('midnight')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (settings.app.theme === 'light') {
      setTheme('light')
    } else {
      lastDarkThemeRef.current = settings.app.theme
      setTheme('dark')
    }
  }, [mounted, settings.app.theme, setTheme])

  const handleToggle = () => {
    if (settings.app.theme === 'light') {
      const nextTheme = lastDarkThemeRef.current === 'light' ? 'midnight' : lastDarkThemeRef.current
      setAppTheme(nextTheme)
      setTheme('dark')
    } else {
      lastDarkThemeRef.current = settings.app.theme
      setAppTheme('light')
      setTheme('light')
    }
  }

  const isLightMode = settings.app.theme === 'light'

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "group relative overflow-hidden rounded-full border backdrop-blur-sm transition-colors duration-150",
          isLightMode
            ? "border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm"
            : "border-border/10 bg-foreground/5 text-foreground/70 hover:text-foreground hover:bg-foreground/10",
          className
        )}
      >
        <motion.div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-150",
            isLightMode
              ? "bg-gradient-to-r from-blue-200/40 via-emerald-200/30 to-indigo-200/40"
              : "bg-gradient-to-r from-amber-400/20 to-orange-500/20"
          )}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          layoutId="theme-button-bg"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={isLightMode ? 'light' : 'dark'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10"
          >
            {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </motion.div>
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  )
}

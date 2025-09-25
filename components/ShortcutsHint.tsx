"use client"

import { Command } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ShortcutsHintProps {
  className?: string
}

export default function ShortcutsHint({ className }: ShortcutsHintProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        setIsVisible(true)
      }
      if (e.key === 'Escape') {
        setIsVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm"
      )}
      onClick={() => setIsVisible(false)}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-4",
          "bg-gray-900/95 backdrop-blur-xl",
          "border border-border/10 rounded-xl",
          "p-6 shadow-2xl",
          "animate-in fade-in-0 zoom-in-95",
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Command className="h-5 w-5 text-foreground/70" />
          <h2 className="text-lg font-medium text-foreground/90">Keyboard Shortcuts</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground/80 mb-2">General</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Show/Hide Shortcuts</span>
                <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Shift + ?</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">New Alarm</span>
                <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + N</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Toggle Calendar</span>
                <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + C</kbd>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground/80 mb-2">Upcoming Alarms Widget</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Show/Hide Widget</span>
                <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + A</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Minimize/Maximize</span>
                <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + M</kbd>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground/80 mb-2">Calendar Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Previous/Next Week</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + ←→</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/60">Previous/Next Month</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-foreground/10 rounded text-foreground/80">Alt + ↑↓</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 text-xs text-foreground/40 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded text-foreground/60">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  )
}
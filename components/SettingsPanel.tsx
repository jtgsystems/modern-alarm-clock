"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  is24HourFormat: boolean
  showSeconds: boolean
  onToggle24Hour: () => void
  onToggleSeconds: () => void
  className?: string
}

export default function SettingsPanel({
  isOpen,
  onClose,
  is24HourFormat,
  showSeconds,
  onToggle24Hour,
  onToggleSeconds,
  className = ''
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Clock Settings</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-white/20"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <SettingRow
                label="24-Hour Format"
                value={is24HourFormat}
                onToggle={onToggle24Hour}
              />

              <SettingRow
                label="Show Seconds"
                value={showSeconds}
                onToggle={onToggleSeconds}
              />
            </div>

            {/* Footer */}
            <Button
              className="w-full mt-6"
              onClick={onClose}
            >
              Done
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual Setting Row Component
interface SettingRowProps {
  label: string
  value: boolean
  onToggle: () => void
}

function SettingRow({ label, value, onToggle }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      <motion.button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full border transition-all duration-200 ${
          value
            ? 'bg-blue-500 border-blue-400'
            : 'bg-white/10 border-white/20'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
            value ? 'translate-x-6' : 'translate-x-0.5'
          }`}
          layout
        />
      </motion.button>
    </div>
  )
}
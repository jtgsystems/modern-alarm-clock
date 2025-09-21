"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Calendar, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AlarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSetAlarm: (settings: AlarmSettings) => void
  selectedDate?: Date
}

interface AlarmSettings {
  time: string
  label: string
  isRecurring: boolean
  showNotification: boolean
  reminderDate?: Date
}

export default function AlarmDialog({ open, onOpenChange, onSetAlarm, selectedDate }: AlarmDialogProps) {
  const [alarmTime, setAlarmTime] = useState("")
  const [alarmLabel, setAlarmLabel] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [reminderDate, setReminderDate] = useState<Date | undefined>(selectedDate)

  useEffect(() => {
    setReminderDate(selectedDate)
  }, [selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSetAlarm({
      time: alarmTime,
      label: alarmLabel,
      isRecurring,
      showNotification,
      reminderDate,
    })
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setAlarmTime("")
    setAlarmLabel("")
    setIsRecurring(false)
    setShowNotification(true)
    setReminderDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-white/20 bg-white/5 p-0 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {/* Glassmorphic background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />

          {/* Floating background elements */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/30"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i * 8)}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-6">
            <DialogHeader className="mb-6">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock className="h-5 w-5 text-cyan-400" />
                </motion.div>
                <DialogTitle className="text-xl font-semibold text-white">
                  Set New Alarm
                </DialogTitle>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </motion.div>
              </motion.div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="alarm-time" className="text-white/80 font-medium">
                    Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="alarm-time"
                      type="time"
                      required
                      value={alarmTime}
                      onChange={(e) => setAlarmTime(e.target.value)}
                      className={cn(
                        "border border-white/20 bg-white/10 backdrop-blur-sm",
                        "text-white text-lg font-mono",
                        "focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:ring-offset-0",
                        "transition-all duration-300"
                      )}
                    />
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="alarm-label" className="text-white/80 font-medium">
                    Label
                  </Label>
                  <div className="relative">
                    <Input
                      id="alarm-label"
                      type="text"
                      value={alarmLabel}
                      onChange={(e) => setAlarmLabel(e.target.value)}
                      placeholder="Add a label (optional)"
                      className={cn(
                        "border border-white/20 bg-white/10 backdrop-blur-sm",
                        "text-white placeholder:text-white/50",
                        "focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:ring-offset-0",
                        "transition-all duration-300"
                      )}
                    />
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {reminderDate ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative overflow-hidden rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20" />
                      <div className="relative flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white/90">
                          {reminderDate.toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
                    >
                      <Label htmlFor="recurring" className="text-white/80 font-medium">
                        Recurring
                      </Label>
                      <Switch
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="notifications" className="text-white/80 font-medium">
                    Show Notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={showNotification}
                    onCheckedChange={setShowNotification}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="relative overflow-hidden border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="relative z-10">Cancel</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className={cn(
                      "relative overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20",
                      "hover:from-cyan-600 hover:to-purple-600 hover:shadow-cyan-500/30",
                      "transition-all duration-300"
                    )}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Set Alarm
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
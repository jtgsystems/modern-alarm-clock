"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alarm-time" className="text-white/80">Time</Label>
              <Input
                id="alarm-time"
                type="time"
                required
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className={cn(
                  "bg-white/5 border-white/10",
                  "text-white",
                  "focus:border-white/20 focus:ring-0"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alarm-label" className="text-white/80">Label</Label>
              <Input
                id="alarm-label"
                type="text"
                value={alarmLabel}
                onChange={(e) => setAlarmLabel(e.target.value)}
                placeholder="Add a label (optional)"
                className={cn(
                  "bg-white/5 border-white/10",
                  "text-white placeholder:text-white/40",
                  "focus:border-white/20 focus:ring-0"
                )}
              />
            </div>

            {reminderDate ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                <Calendar className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">
                  {reminderDate.toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring" className="text-white/80">Recurring</Label>
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-white/80">
                Show Notifications
              </Label>
              <Switch
                id="notifications"
                checked={showNotification}
                onCheckedChange={setShowNotification}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "bg-gradient-to-r from-cyan-500 to-purple-500",
                "text-white",
                "hover:from-cyan-600 hover:to-purple-600"
              )}
            >
              Set Alarm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
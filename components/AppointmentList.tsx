"use client"

import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  time: string
  label: string
  date?: Date
  isRecurring?: boolean
}

interface AppointmentListProps {
  appointments: Appointment[]
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  const now = new Date()
  
  const getNextOccurrence = (appointment: Appointment) => {
    const [hours, minutes] = appointment.time.split(':').map(Number)
    let nextDate = new Date()
    nextDate.setHours(hours, minutes, 0, 0)
    
    if (appointment.date) {
      nextDate = new Date(appointment.date)
      nextDate.setHours(hours, minutes, 0, 0)
      if (nextDate < now) return null // Past one-time appointments are not shown
    } else if (nextDate < now && appointment.isRecurring) {
      nextDate.setDate(nextDate.getDate() + 1) // Move to next day for recurring alarms
    }
    
    return nextDate
  }

  const sortedAppointments = appointments
    .map(appointment => ({
      ...appointment,
      nextOccurrence: getNextOccurrence(appointment)
    }))
    .filter(a => a.nextOccurrence) // Remove past appointments
    .sort((a, b) => a.nextOccurrence!.getTime() - b.nextOccurrence!.getTime())

  if (sortedAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-white/90">Upcoming</h2>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-cyan-500/20 to-purple-500/20" />
        <div className="space-y-3">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="relative pl-11"
            >
              <div className="absolute left-4 top-3 h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
              <div className={cn(
                "group relative",
                "bg-white/5 hover:bg-white/10",
                "backdrop-blur-sm",
                "rounded-lg p-3",
                "border border-white/10",
                "transition-all duration-200"
              )}>
                <div className="flex items-center gap-3">
                  {appointment.date ? (
                    <Calendar className="h-4 w-4 text-white/60" />
                  ) : (
                    <Clock className="h-4 w-4 text-white/60" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      {appointment.label || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-white/60">{appointment.time}</p>
                      {appointment.date && (
                        <>
                          <span className="text-white/30">•</span>
                          <p className="text-xs text-white/60">
                            {appointment.date.toLocaleDateString()}
                          </p>
                        </>
                      )}
                      {appointment.isRecurring && (
                        <>
                          <span className="text-white/30">•</span>
                          <p className="text-xs text-white/60">Recurring</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
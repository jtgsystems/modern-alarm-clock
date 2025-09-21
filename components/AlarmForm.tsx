"use client"

import { useState, FormEvent } from "react"
import { v4 as uuidv4 } from "uuid"

type AlarmSound = "classic" | "digital" | "gentle" | "nature"

interface AlarmData {
  id: string
  time: string
  label: string
  repeatDays: string[]
  sound: AlarmSound
  volume: number
}

interface AlarmFormProps {
  addAlarm: (alarm: AlarmData) => void
}

export default function AlarmForm({ addAlarm }: AlarmFormProps) {
  const [time, setTime] = useState<string>("")
  const [label, setLabel] = useState<string>("")
  const [repeatDays, setRepeatDays] = useState<string[]>([])
  const [sound, setSound] = useState<AlarmSound>("classic")
  const [volume, setVolume] = useState<number>(50)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newAlarm: AlarmData = {
      id: uuidv4(),
      time,
      label,
      repeatDays,
      sound,
      volume,
    }
    addAlarm(newAlarm)
    setTime("")
    setLabel("")
    setRepeatDays([])
    setSound("classic")
    setVolume(50)
  }

  const toggleRepeatDay = (day: string) => {
    setRepeatDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6" aria-label="Set alarm">
      <div className="mb-4">
        <label htmlFor="alarm-time" className="block text-lg dark:text-white">
          Set Alarm Time
        </label>
        <input
          type="time"
          id="alarm-time"
          value={time}
          onChange={(e) => setTime((e.target as HTMLInputElement).value)}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="alarm-label" className="block text-lg dark:text-white">
          Alarm Label (Optional)
        </label>
        <input
          type="text"
          id="alarm-label"
          value={label}
          onChange={(e) => setLabel((e.target as HTMLInputElement).value)}
          placeholder="e.g., Morning Meeting"
          maxLength={30}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg dark:text-white">Repeat</label>
        <div className="repeat-options flex gap-2" role="group" aria-label="Repeat alarm on">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleRepeatDay(day)}
              className={`p-2 rounded-full ${
                repeatDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {day[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="alarm-sound" className="block text-lg dark:text-white">
          Alarm Sound
        </label>
        <select
          id="alarm-sound"
          value={sound}
          onChange={(e) => setSound((e.target as HTMLSelectElement).value as AlarmSound)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="classic">Classic Bell</option>
          <option value="digital">Digital Beep</option>
          <option value="gentle">Gentle Chime</option>
          <option value="nature">Nature Sounds</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="alarm-volume" className="block text-lg dark:text-white">
          Alarm Volume
        </label>
        <input
          type="range"
          id="alarm-volume"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number((e.target as HTMLInputElement).value))}
          className="w-full"
        />
      </div>

      <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Set Alarm
      </button>
    </form>
  )
}

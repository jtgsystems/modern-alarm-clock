export type AlarmSound = 'classic' | 'digital' | 'nature' | 'gentle' | 'rooster'

export const alarmSounds = {
  classic: {
    name: 'Classic Bell',
    url: '/sounds/classic-alarm.mp3'
  },
  digital: {
    name: 'Digital Beep',
    url: '/sounds/digital-beep.mp3'
  },
  nature: {
    name: 'Nature Sounds',
    url: '/sounds/nature-wake.mp3'
  },
  gentle: {
    name: 'Gentle Chime',
    url: '/sounds/gentle-chime.mp3'
  },
  rooster: {
    name: 'Rooster Crow',
    url: '/sounds/rooster.mp3'
  }
}

export const notificationSounds = {
  reminder: '/sounds/reminder-pop.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3'
}

export function playNotificationSound(type: keyof typeof notificationSounds) {
  const audio = new Audio(notificationSounds[type])
  audio.volume = 0.5
  return audio.play()
}

export function playAlarmSound(sound: AlarmSound, volume: number = 0.5) {
  const audio = new Audio(alarmSounds[sound].url)
  audio.volume = volume
  return audio.play()
}
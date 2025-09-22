"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { playNotificationSound } from '@/lib/sounds'

interface UseNotificationConfig {
  title?: string
  sound?: boolean
  icon?: string
}

export function useNotification(config: UseNotificationConfig = {}) {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      return perm === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [])

  const sendNotification = useCallback(async (message: string, options: NotificationOptions = {}) => {
    if (!('Notification' in window)) {
      return false
    }

    if (permission !== 'granted') {
      const granted = await requestPermission()
      if (!granted) return false
    }

    try {
      const notification = new Notification(config.title || 'Alarm Clock', {
        body: message,
        icon: config.icon || '/alarm-icon.png',
        ...options
      })

      if (config.sound !== false) {
        playNotificationSound('reminder')
      }

      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    }
  }, [permission, config.title, config.icon, config.sound, requestPermission])

  return useMemo(() => ({
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window
  }), [permission, requestPermission, sendNotification])
}

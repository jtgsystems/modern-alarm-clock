"use client"

import { useState, useEffect } from 'react'
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

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const sendNotification = async (message: string, options: NotificationOptions = {}) => {
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
  }

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window
  }
}
"use client"

// 2025 Modern Suspense Patterns with Loading States
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Clock } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-8 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-blue-500"
      >
        <Loader2 className={sizeClasses[size]} />
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

// 2025 Skeleton Loading Component
function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-pulse space-y-4 p-6"
    >
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </motion.div>
  )
}

// 2025 Clock-specific Loading Component
function ClockLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-6"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="text-blue-500"
      >
        <Clock size={64} />
      </motion.div>

      <div className="text-center space-y-2">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-gray-900 dark:text-gray-100"
        >
          Initializing Clock
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Setting up your personalized experience...
        </motion.p>
      </div>

      {/* Loading bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="h-1 bg-blue-500 rounded-full max-w-xs"
      />
    </motion.div>
  )
}

// 2025 Modern Suspense Wrapper with different loading states
interface SuspenseWrapperProps {
  children: React.ReactNode
  fallback?: 'spinner' | 'skeleton' | 'clock' | React.ReactNode
  message?: string
}

export function SuspenseWrapper({
  children,
  fallback = 'spinner',
  message
}: SuspenseWrapperProps) {
  let fallbackComponent: React.ReactNode

  if (typeof fallback === 'string') {
    switch (fallback) {
      case 'spinner':
        fallbackComponent = <LoadingSpinner message={message} />
        break
      case 'skeleton':
        fallbackComponent = <SkeletonLoader />
        break
      case 'clock':
        fallbackComponent = <ClockLoading />
        break
      default:
        fallbackComponent = <LoadingSpinner message={message} />
    }
  } else {
    fallbackComponent = fallback
  }

  return (
    <Suspense fallback={fallbackComponent}>
      {children}
    </Suspense>
  )
}

// 2025 Lazy Loading Wrapper for Code Splitting
interface LazyWrapperProps {
  children: React.ReactNode
  loading?: boolean
}

export function LazyWrapper({ children, loading = false }: LazyWrapperProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <SuspenseWrapper fallback="spinner">
      {children}
    </SuspenseWrapper>
  )
}

export default SuspenseWrapper
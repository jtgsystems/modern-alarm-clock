"use client"

// 2025 Modern Error Boundary with React Error Boundary Library
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
    >
      <div className="max-w-md w-full mx-4 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-red-500 flex justify-center mb-4"
        >
          <AlertTriangle size={48} />
        </motion.div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
          We encountered an unexpected error. Don't worry, this has been logged for investigation.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-2">
          <Button
            onClick={resetErrorBoundary}
            className="flex-1 flex items-center justify-center gap-2"
            variant="default"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Home
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// 2025 Modern Error Boundary with automatic recovery
interface ModernErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function ModernErrorBoundary({
  children,
  fallback: Fallback = ErrorFallback,
  onError
}: ModernErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // 2025: Modern error logging - could integrate with services like Sentry
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    onError?.(error, errorInfo)

    // 2025: Could send to error tracking service
    // Example: errorTrackingService.captureException(error, { extra: errorInfo })
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={handleError}
      onReset={() => {
        // 2025: Clear any error state, reload data, etc.
        window.location.reload()
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// 2025 Async Error Boundary for handling async errors in components
export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ModernErrorBoundary
      onError={(error, errorInfo) => {
        // 2025: Handle async errors specifically
        if (error.name === 'ChunkLoadError') {
          // Handle code-splitting errors
          window.location.reload()
        }
      }}
    >
      {children}
    </ModernErrorBoundary>
  )
}

export default ModernErrorBoundary

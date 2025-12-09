'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SelfClearingEmailInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  inputClassName?: string
  errorClassName?: string
}

const CLEAR_MESSAGES = [
  { message: "Oops, butterfingers!", clear: 'all' },
  { message: "Almost... try again", clear: 'half' },
  { message: "Fine, I'll let you keep it", clear: 'none' },
]

export function SelfClearingEmailInput({
  value,
  onChange,
  error,
  disabled = false,
  inputClassName = '',
  errorClassName = 'text-red-600',
}: SelfClearingEmailInputProps) {
  const [blurCount, setBlurCount] = useState(0)
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)
  const [isSurrendered, setIsSurrendered] = useState(false)

  const handleBlur = useCallback(() => {
    if (disabled || isSurrendered || !value) return

    const action = CLEAR_MESSAGES[blurCount]

    if (!action || blurCount >= CLEAR_MESSAGES.length - 1) {
      // Surrendered - keep the value
      setIsSurrendered(true)
      setCurrentMessage(CLEAR_MESSAGES[2].message)
      setTimeout(() => setCurrentMessage(null), 2000)
      return
    }

    setCurrentMessage(action.message)

    if (action.clear === 'all') {
      onChange('')
    } else if (action.clear === 'half') {
      onChange(value.slice(0, Math.ceil(value.length / 2)))
    }

    setBlurCount(prev => prev + 1)

    // Clear message after delay
    setTimeout(() => setCurrentMessage(null), 2000)
  }, [disabled, isSurrendered, value, blurCount, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="your@email.com"
        className={`
          w-full px-4 py-2 border
          focus:outline-none focus:ring-2
          transition-colors
          ${inputClassName}
          ${error ? 'border-red-400 focus:ring-red-200' : ''}
          ${disabled ? 'bg-zinc-100 cursor-not-allowed' : ''}
        `}
      />

      {/* Attempt counter */}
      {!isSurrendered && blurCount > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-xs text-zinc-400">
            {blurCount}/3
          </span>
        </div>
      )}

      {/* Surrendered indicator */}
      {isSurrendered && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-xs text-green-600">✓</span>
        </div>
      )}

      {/* Message popup */}
      <AnimatePresence>
        {currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={`
              absolute left-0 -bottom-8 z-10
              px-3 py-1 rounded-md shadow-md
              text-xs font-medium
              ${isSurrendered
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
              }
            `}
          >
            {currentMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && !currentMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-1 text-xs ${errorClassName}`}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SelfClearingEmailInput

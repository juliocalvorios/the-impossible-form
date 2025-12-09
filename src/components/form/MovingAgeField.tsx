'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MovingAgeFieldProps {
  value: number | null
  onChange: (value: number | null) => void
  error?: string
  disabled?: boolean
  position: number // 0-3 representing different positions
  onPositionChange: () => void
  inputClassName?: string
  labelClassName?: string
  errorClassName?: string
}

const POSITIONS = [
  { order: 0, label: "Age" },
  { order: 1, label: "Age (I moved)" },
  { order: 2, label: "Age (stop chasing me)" },
  { order: 3, label: "Age (fine, I'll stay)" },
]

export function MovingAgeField({
  value,
  onChange,
  error,
  disabled = false,
  position,
  onPositionChange,
  inputClassName = '',
  labelClassName = '',
  errorClassName = 'text-red-600',
}: MovingAgeFieldProps) {
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false)
  const [localValue, setLocalValue] = useState<string>(value?.toString() || '')

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value?.toString() || '')
  }, [value])

  const handleBlur = useCallback(() => {
    const numValue = localValue ? parseInt(localValue, 10) : null

    // If valid age entered and not at final position, MOVE!
    if (numValue && numValue >= 18 && numValue <= 99 && position < 3) {
      setHasCompletedOnce(true)
      onChange(null) // Clear the value
      setLocalValue('')
      onPositionChange()
    } else {
      onChange(numValue)
    }
  }, [localValue, position, onChange, onPositionChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    setLocalValue(e.target.value)
  }

  const currentPosition = POSITIONS[position]
  const isFinal = position >= 3

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ order: currentPosition.order }}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor="age"
          className={`block text-sm font-medium ${labelClassName || 'text-zinc-700'}`}
        >
          {currentPosition.label}
          {isFinal && <span className="ml-1 text-green-600">✓</span>}
        </label>

        {hasCompletedOnce && !isFinal && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-amber-600"
          >
            {position}/3 moves
          </motion.span>
        )}
      </div>

      <input
        id="age"
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Your age"
        min={0}
        max={150}
        className={`
          mt-1 w-full px-4 py-2 border
          focus:outline-none focus:ring-2
          transition-colors
          ${inputClassName}
          ${error
            ? 'border-red-400 focus:ring-red-200'
            : isFinal
              ? 'border-green-400 focus:ring-green-200'
              : ''
          }
          ${disabled ? 'bg-zinc-100 cursor-not-allowed' : ''}
        `}
      />

      <AnimatePresence>
        {error && (
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

      {hasCompletedOnce && !isFinal && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-xs text-amber-600"
        >
          Where did I go? Look around...
        </motion.p>
      )}
    </motion.div>
  )
}

export default MovingAgeField

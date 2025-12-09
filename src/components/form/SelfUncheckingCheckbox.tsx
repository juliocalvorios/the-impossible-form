'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

interface SelfUncheckingCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  timeLimit: number // seconds before unchecking
  onTimeExpired: () => void
  disabled?: boolean
  label: string
  labelClassName?: string
}

export function SelfUncheckingCheckbox({
  checked,
  onChange,
  timeLimit,
  onTimeExpired,
  disabled = false,
  label,
  labelClassName = '',
}: SelfUncheckingCheckboxProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [hasExpiredOnce, setHasExpiredOnce] = useState(false)

  // Start timer when checked
  useEffect(() => {
    if (!checked) {
      setTimeRemaining(null)
      return
    }

    setTimeRemaining(timeLimit)

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [checked, timeLimit])

  // Uncheck when time expires
  useEffect(() => {
    if (timeRemaining === 0 && checked) {
      onChange(false)
      onTimeExpired()
      setHasExpiredOnce(true)
    }
  }, [timeRemaining, checked, onChange, onTimeExpired])

  const handleChange = useCallback(() => {
    if (disabled) return
    onChange(!checked)
  }, [disabled, checked, onChange])

  const progressPercentage = timeRemaining !== null
    ? (timeRemaining / timeLimit) * 100
    : 100

  return (
    <div className="relative" style={{ fontFamily: WIN95_FONT }}>
      <label
        className={`
          flex items-center gap-2 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Windows 95 style checkbox */}
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only peer"
          />
          <motion.div
            animate={{
              scale: checked ? [1, 1.1, 1] : 1,
            }}
            className="w-[13px] h-[13px] bg-white flex items-center justify-center"
            style={{
              boxShadow: 'inset -1px -1px 0 #fff, inset 1px 1px 0 #808080, inset -2px -2px 0 #c0c0c0, inset 2px 2px 0 #0a0a0a',
            }}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-[9px] h-[9px]"
                viewBox="0 0 9 9"
                fill="none"
              >
                <path
                  d="M1 4L3.5 7L8 1"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </motion.svg>
            )}
          </motion.div>

          {/* Windows 95 style timer bar instead of ring */}
          {checked && timeRemaining !== null && (
            <div
              className="absolute -bottom-2 left-0 w-[13px] h-[3px]"
              style={{
                boxShadow: 'inset -1px -1px 0 #fff, inset 1px 1px 0 #808080',
                backgroundColor: '#c0c0c0',
              }}
            >
              <motion.div
                className="h-full"
                style={{
                  backgroundColor: timeRemaining <= 3 ? '#FF0000' : '#000080',
                  width: `${progressPercentage}%`,
                }}
                animate={{
                  width: `${progressPercentage}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        <span className={`text-[11px] ${labelClassName || 'text-black'}`}>{label}</span>

        {/* Windows 95 style time indicator */}
        {checked && timeRemaining !== null && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] ml-1 px-1"
            style={{
              fontFamily: 'monospace',
              backgroundColor: timeRemaining <= 3 ? '#FF0000' : '#c0c0c0',
              color: timeRemaining <= 3 ? '#fff' : '#000',
              boxShadow: timeRemaining <= 3
                ? 'none'
                : 'inset -1px -1px 0 #fff, inset 1px 1px 0 #808080',
            }}
          >
            {timeRemaining}s
          </motion.span>
        )}
      </label>

      {/* Windows 95 style warning messages */}
      {checked && timeRemaining !== null && timeRemaining <= 5 && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] mt-1"
          style={{ color: '#FF0000' }}
        >
          {timeRemaining <= 2 ? "Quick! Submit now!" : "Hurry, it's about to uncheck!"}
        </motion.p>
      )}

      {hasExpiredOnce && !checked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] mt-1"
          style={{ color: '#808000' }}
        >
          Oops, it unchecked itself. Try again, but faster this time.
        </motion.p>
      )}
    </div>
  )
}

export default SelfUncheckingCheckbox

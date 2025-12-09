'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { allPasswordRequirements } from '@/lib/formSchema'

interface GaslightingPasswordInputProps {
  value: string
  onChange: (value: string) => void
  currentRequirements: string[]
  onRequirementsChange: (newReqs: string[]) => void
  error?: string
  disabled?: boolean
  inputClassName?: string
  labelClassName?: string
}

export function GaslightingPasswordInput({
  value,
  onChange,
  currentRequirements,
  onRequirementsChange,
  error,
  disabled = false,
  inputClassName = '',
  labelClassName = '',
}: GaslightingPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [recentlyChanged, setRecentlyChanged] = useState<string | null>(null)
  const [changeCount, setChangeCount] = useState(0)

  // Get requirement objects for current IDs
  const requirements = currentRequirements.map(id =>
    allPasswordRequirements.find(r => r.id === id)
  ).filter(Boolean) as typeof allPasswordRequirements

  // Check which requirements are met
  const getRequirementStatus = useCallback((req: typeof allPasswordRequirements[0]) => {
    return req.check(value)
  }, [value])

  // Swap a requirement when one is completed (evil!)
  useEffect(() => {
    if (!value || changeCount >= 3) return // Max 3 changes per session

    const metRequirements = requirements.filter(r => getRequirementStatus(r))

    // If user has met 3+ requirements, swap one for a harder one
    if (metRequirements.length >= 3 && Math.random() > 0.5) {
      const available = allPasswordRequirements
        .filter(r => !currentRequirements.includes(r.id))

      if (available.length > 0) {
        // Swap a met requirement for a new one
        const toRemove = metRequirements[Math.floor(Math.random() * metRequirements.length)]
        const toAdd = available[Math.floor(Math.random() * available.length)]

        const newReqs = currentRequirements.map(id =>
          id === toRemove.id ? toAdd.id : id
        )

        // Delay the swap for dramatic effect
        setTimeout(() => {
          onRequirementsChange(newReqs)
          setRecentlyChanged(toAdd.id)
          setChangeCount(prev => prev + 1)

          // Clear the "recently changed" highlight
          setTimeout(() => setRecentlyChanged(null), 2000)
        }, 500)
      }
    }
  }, [value, requirements, currentRequirements, onRequirementsChange, getRequirementStatus, changeCount])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      {/* Password input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Enter your password"
          className={`
            w-full px-4 py-2 pr-12 border
            focus:outline-none focus:ring-2
            transition-colors
            ${inputClassName}
            ${error ? 'border-red-400 focus:ring-red-200' : ''}
            ${disabled ? 'bg-zinc-100 cursor-not-allowed' : ''}
          `}
        />

        {/* Show/hide toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Requirements list */}
      <div className="space-y-1">
        <p className={`text-xs mb-2 ${labelClassName || 'text-zinc-500'}`}>
          Password requirements:
          {changeCount > 0 && (
            <span className="text-amber-600 ml-1">
              (changed {changeCount} time{changeCount > 1 ? 's' : ''})
            </span>
          )}
        </p>

        <AnimatePresence mode="popLayout">
          {requirements.map((req) => {
            const isMet = getRequirementStatus(req)
            const isNew = recentlyChanged === req.id

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: isNew ? '#fef3c7' : 'transparent',
                }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center gap-2 text-xs py-1 px-2 rounded
                  ${isNew ? 'bg-amber-100' : ''}
                `}
              >
                <motion.span
                  animate={{
                    scale: isMet ? [1, 1.3, 1] : 1,
                    color: isMet ? '#22c55e' : '#9ca3af',
                  }}
                >
                  {isMet ? '✓' : '○'}
                </motion.span>
                <span className={isMet ? 'text-green-600 line-through' : 'text-zinc-600'}>
                  {req.label}
                </span>
                {isNew && (
                  <span className="text-amber-600 font-medium ml-auto">NEW!</span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Change warning */}
      {changeCount > 0 && changeCount < 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-amber-600 italic"
        >
          The requirements might change again...
        </motion.p>
      )}

      {changeCount >= 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-green-600"
        >
          Requirements are now stable. You wore me down.
        </motion.p>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default GaslightingPasswordInput

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LyingLabelProps {
  displayText: string
  actualHint: string
  showHint: boolean
  htmlFor?: string
  className?: string
}

export function LyingLabel({
  displayText,
  actualHint,
  showHint,
  htmlFor,
  className = '',
}: LyingLabelProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative inline-block">
      <label
        htmlFor={htmlFor}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          block text-sm font-medium
          cursor-help
          ${className || 'text-zinc-700'}
        `}
      >
        {displayText}
        {showHint && (
          <span className="ml-1 text-xs text-amber-600">(?)</span>
        )}
      </label>

      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="
              absolute left-0 -bottom-8 z-10
              px-2 py-1 rounded
              bg-amber-100 border border-amber-300
              text-xs text-amber-800
              whitespace-nowrap
              shadow-sm
            "
          >
            Hint: {actualHint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Predefined lying labels for each field
export const lyingLabels = {
  name: {
    display: 'Full Name',
    hints: [
      'Write it backwards: LastName FirstName',
      'Last name goes first here',
      'Reverse the order',
    ],
  },
  email: {
    display: 'Email',
    hints: [
      'No Gmail or Outlook allowed',
      'Use an obscure provider',
      'Mainstream emails are rejected',
    ],
  },
  password: {
    display: 'Password',
    hints: [
      'Requirements will change',
      'Good luck with this one',
      'Prepare for frustration',
    ],
  },
  age: {
    display: 'Age',
    hints: [
      "Don't pick 21",
      'Some ages are rejected',
      'Choose wisely',
    ],
  },
  terms: {
    display: 'I agree to the terms',
    hints: [
      'It will uncheck itself',
      'Submit fast!',
      'Time is ticking',
    ],
  },
}

export function getRandomHint(field: keyof typeof lyingLabels): string {
  const hints = lyingLabels[field].hints
  return hints[Math.floor(Math.random() * hints.length)]
}

export default LyingLabel

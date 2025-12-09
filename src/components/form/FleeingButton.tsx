'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface FleeingButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  fleeCount: number
  onFlee: () => void
  surrendered?: boolean
  className?: string
  buttonClassName?: string
}

const MAX_FLEE_COUNT = 5 // After this many attempts, button surrenders

export function FleeingButton({
  children,
  onClick,
  disabled = false,
  fleeCount,
  onFlee,
  surrendered = false,
  className = '',
  buttonClassName = '',
}: FleeingButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isShaking, setIsShaking] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const shouldFlee = !surrendered && fleeCount < MAX_FLEE_COUNT && !disabled

  const handleMouseEnter = useCallback(() => {
    if (!shouldFlee || !buttonRef.current || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const button = buttonRef.current.getBoundingClientRect()

    // Calculate random direction to flee
    const maxX = container.width - button.width - 20
    const maxY = 100 // Limit vertical movement

    // Flee in opposite direction from current position
    const newX = position.x > 0
      ? -Math.random() * maxX * 0.5
      : Math.random() * maxX * 0.5
    const newY = position.y > 0
      ? -Math.random() * maxY
      : Math.random() * maxY

    setPosition({ x: newX, y: newY })
    onFlee()

    // Shake effect when about to surrender
    if (fleeCount >= MAX_FLEE_COUNT - 2) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [shouldFlee, position, fleeCount, onFlee])

  const handleClick = useCallback(() => {
    if (disabled) return
    onClick()
  }, [disabled, onClick])

  // After surrendering, show a different state
  const isSurrendered = surrendered || fleeCount >= MAX_FLEE_COUNT

  return (
    <div
      ref={containerRef}
      className="relative w-full h-24 flex items-center justify-center"
    >
      <motion.button
        ref={buttonRef}
        type={isSurrendered ? 'submit' : 'button'}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={disabled}
        animate={{
          x: shouldFlee ? position.x : 0,
          y: shouldFlee ? position.y : 0,
          scale: isShaking ? 1.05 : 1,
        }}
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 20 },
          y: { type: 'spring', stiffness: 300, damping: 20 },
          scale: { type: 'spring', stiffness: 400, damping: 10 },
        }}
        className={`
          px-8 py-3 font-semibold
          transition-colors duration-200
          ${buttonClassName || (disabled
            ? 'bg-zinc-400 cursor-not-allowed text-white rounded-lg'
            : isSurrendered
              ? 'bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg'
              : 'bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg'
          )}
          ${className}
        `}
      >
        {isSurrendered ? (
          <span className="flex items-center gap-2">
            <span>Fine, submit</span>
            <span className="text-xs opacity-75">(I give up)</span>
          </span>
        ) : (
          children
        )}
      </motion.button>

      {/* Taunt message */}
      {shouldFlee && fleeCount > 0 && fleeCount < MAX_FLEE_COUNT && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 text-xs text-zinc-500 text-center"
        >
          {fleeCount === 1 && "Too slow!"}
          {fleeCount === 2 && "Can't catch me!"}
          {fleeCount === 3 && "Getting tired yet?"}
          {fleeCount === 4 && "Okay, okay... one more try"}
        </motion.p>
      )}
    </div>
  )
}

export default FleeingButton

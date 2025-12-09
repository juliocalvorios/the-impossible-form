'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { FormStats, DefenseLevel } from '@/types'

interface FrustrationMeterProps {
  stats: FormStats
  defenseLevel: DefenseLevel
}

export function FrustrationMeter({ stats, defenseLevel }: FrustrationMeterProps) {
  // Calculate frustration score (0-100)
  const frustrationScore = useMemo(() => {
    const errorWeight = stats.validationErrors * 5
    const chaseWeight = stats.buttonChases * 8
    const timeWeight = Math.min(stats.timeSpent / 10, 20)
    const shuffleWeight = stats.fieldsShuffled * 10
    const checkboxWeight = stats.checkboxResets * 15

    return Math.min(100, errorWeight + chaseWeight + timeWeight + shuffleWeight + checkboxWeight)
  }, [stats])

  // Get frustration level message
  const frustrationMessage = useMemo(() => {
    if (frustrationScore < 20) return { text: 'Calm', emoji: '😌', color: 'text-green-600' }
    if (frustrationScore < 40) return { text: 'Annoyed', emoji: '😐', color: 'text-yellow-600' }
    if (frustrationScore < 60) return { text: 'Frustrated', emoji: '😤', color: 'text-orange-600' }
    if (frustrationScore < 80) return { text: 'Angry', emoji: '😠', color: 'text-red-500' }
    return { text: 'Rage Mode', emoji: '🤬', color: 'text-red-700' }
  }, [frustrationScore])

  // Get progress bar color
  const barColor = useMemo(() => {
    if (frustrationScore < 20) return 'bg-green-500'
    if (frustrationScore < 40) return 'bg-yellow-500'
    if (frustrationScore < 60) return 'bg-orange-500'
    if (frustrationScore < 80) return 'bg-red-500'
    return 'bg-red-700'
  }, [frustrationScore])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-700">Frustration Meter</h3>
        <span className="text-2xl">{frustrationMessage.emoji}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-zinc-200 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`absolute inset-y-0 left-0 ${barColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${frustrationScore}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Score and level */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${frustrationMessage.color}`}>
          {frustrationMessage.text}
        </span>
        <span className="text-xs text-zinc-500">
          {Math.round(frustrationScore)}%
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Time spent:</span>
          <span className="font-mono text-zinc-700">{formatTime(stats.timeSpent)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Errors:</span>
          <span className="font-mono text-zinc-700">{stats.validationErrors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Button chases:</span>
          <span className="font-mono text-zinc-700">{stats.buttonChases}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Checkbox resets:</span>
          <span className="font-mono text-zinc-700">{stats.checkboxResets}</span>
        </div>
      </div>

      {/* Defense level indicator */}
      <div className="mt-4 pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Defense Level:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <motion.div
                key={level}
                animate={{
                  scale: defenseLevel >= level ? 1 : 0.8,
                  opacity: defenseLevel >= level ? 1 : 0.3,
                }}
                className={`
                  w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                  ${defenseLevel >= level
                    ? level === 3 ? 'bg-red-500 text-white'
                      : level === 2 ? 'bg-orange-500 text-white'
                      : 'bg-yellow-500 text-white'
                    : 'bg-zinc-200 text-zinc-400'
                  }
                `}
              >
                {level}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Snarky comment based on stats */}
      {frustrationScore > 50 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-zinc-500 italic text-center"
        >
          {frustrationScore > 80
            ? "Most users have ragequit by now. You're persistent."
            : frustrationScore > 60
              ? "Your frustration feeds the form's power."
              : "Keep going. The form is winning... for now."
          }
        </motion.p>
      )}
    </div>
  )
}

export default FrustrationMeter

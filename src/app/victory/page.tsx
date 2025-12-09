'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo, Suspense } from 'react'
import type { FormStats } from '@/types'

const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

function VictoryContent() {
  const searchParams = useSearchParams()

  const stats: FormStats = useMemo(() => {
    try {
      const statsParam = searchParams.get('stats')
      if (statsParam) {
        return JSON.parse(decodeURIComponent(statsParam))
      }
    } catch {
      // Default stats if parsing fails
    }
    return {
      totalAttempts: 0,
      validationErrors: 0,
      buttonChases: 0,
      timeSpent: 0,
      fieldsShuffled: 0,
      checkboxResets: 0,
      passwordRequirementChanges: 0,
    }
  }, [searchParams])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Generate a performance rating
  const getRating = () => {
    const totalFrustration =
      stats.validationErrors * 2 +
      stats.buttonChases * 3 +
      stats.checkboxResets * 5 +
      Math.floor(stats.timeSpent / 30)

    if (totalFrustration < 10) return { grade: 'S', label: 'Speedrunner', color: '#800080' }
    if (totalFrustration < 20) return { grade: 'A', label: 'Persistent', color: '#008000' }
    if (totalFrustration < 35) return { grade: 'B', label: 'Determined', color: '#000080' }
    if (totalFrustration < 50) return { grade: 'C', label: 'Stubborn', color: '#808000' }
    return { grade: 'D', label: 'Masochist', color: '#800000' }
  }

  const rating = getRating()

  // Snarky comments based on stats
  const getComment = () => {
    if (stats.buttonChases > 5) {
      return "You really chased that button, didn't you?"
    }
    if (stats.checkboxResets > 3) {
      return "The checkbox beat you multiple times. Respect for not giving up."
    }
    if (stats.validationErrors > 15) {
      return "That's... a lot of validation errors. Were you even trying the right things?"
    }
    if (stats.timeSpent > 180) {
      return "Three minutes? The form really put up a fight."
    }
    if (stats.timeSpent < 30 && stats.validationErrors < 5) {
      return "Suspiciously fast. Did you read the hints beforehand?"
    }
    return "You conquered the unconquerable. The form bows to your persistence."
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#008080', fontFamily: WIN95_FONT }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Windows 95 Window */}
        <div className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]">
          {/* Title Bar */}
          <div className="h-[18px] bg-gradient-to-r from-[#000080] to-[#1084d0] px-[2px] py-[2px] flex items-center justify-between select-none">
            <div className="flex items-center gap-[3px]">
              <div className="w-[16px] h-[14px] flex items-center justify-center">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <rect x="0" y="0" width="14" height="12" fill="#c0c0c0"/>
                  <text x="7" y="9" fontSize="10" textAnchor="middle" fill="#008000">✓</text>
                </svg>
              </div>
              <span className="text-white text-[11px] font-bold">
                Victory!
              </span>
            </div>
            <div className="flex gap-[2px]">
              <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
                <div className="w-[6px] h-[2px] bg-black mt-[4px]" />
              </button>
              <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
                <div className="w-[8px] h-[7px] border border-black border-t-2" />
              </button>
              <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
                <span className="text-black text-[11px] font-bold leading-none mt-[-1px]">×</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Victory Header */}
            <div className="text-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl mb-2"
              >
                🎉
              </motion.div>
              <h1 className="text-[14px] font-bold text-black mb-1">
                You Did It!
              </h1>
              <p className="text-[11px] text-[#808080]">
                Against all odds, you completed The Impossible Form.
              </p>
            </div>

            {/* Rating Group Box */}
            <fieldset className="border-t border-l border-[#808080] shadow-[1px_1px_0_0_#ffffff] p-3 pt-1 mb-3">
              <legend className="px-1 text-[11px] text-black">Your Performance</legend>

              <div className="text-center mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                  className="text-[48px] font-bold leading-none"
                  style={{ color: rating.color }}
                >
                  {rating.grade}
                </motion.div>
                <p
                  className="text-[12px] font-bold"
                  style={{ color: rating.color }}
                >
                  {rating.label}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Time */}
                <div className="bg-white shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080] p-2 text-center">
                  <div
                    className="font-mono text-[14px] font-bold"
                    style={{ color: '#00FF00', textShadow: '0 0 2px #00FF00', backgroundColor: '#000', padding: '2px 4px' }}
                  >
                    {formatTime(stats.timeSpent)}
                  </div>
                  <p className="text-[10px] text-black mt-1">Time Spent</p>
                </div>

                {/* Errors */}
                <div className="bg-white shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080] p-2 text-center">
                  <div className="text-[14px] font-bold text-black">{stats.validationErrors}</div>
                  <p className="text-[10px] text-black">Validation Errors</p>
                </div>

                {/* Chases */}
                <div className="bg-white shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080] p-2 text-center">
                  <div className="text-[14px] font-bold text-black">{stats.buttonChases}</div>
                  <p className="text-[10px] text-black">Button Chases</p>
                </div>

                {/* Resets */}
                <div className="bg-white shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080] p-2 text-center">
                  <div className="text-[14px] font-bold text-black">{stats.checkboxResets}</div>
                  <p className="text-[10px] text-black">Checkbox Resets</p>
                </div>
              </div>

              {/* Comment */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-[10px] text-[#808080] italic"
              >
                &ldquo;{getComment()}&rdquo;
              </motion.p>
            </fieldset>

            {/* Dark Patterns Info - Yellow Note Style */}
            <div className="bg-[#ffffcc] border border-[#808080] shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] p-3 mb-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-[14px]">💡</span>
                <span className="text-[11px] font-bold text-black">The Point of This Exercise</span>
              </div>
              <p className="text-[10px] text-black mb-2">
                Every frustrating feature in this form has a real-world counterpart in dark UX patterns:
              </p>
              <ul className="text-[10px] text-black space-y-1 ml-4">
                <li>• <strong>Fleeing buttons</strong> → Subscription cancel buttons that move</li>
                <li>• <strong>Self-unchecking checkboxes</strong> → Pre-checked newsletter opt-ins</li>
                <li>• <strong>Changing requirements</strong> → Forms that reset or add fields</li>
                <li>• <strong>Misleading labels</strong> → Confusing language to trick users</li>
              </ul>
              <p className="text-[10px] text-black mt-2">
                Good UX should help users, not fight them. This form is satire.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-2">
              <Link
                href="/"
                className="px-4 py-1 min-w-[100px] bg-[#c0c0c0] text-[11px] text-black text-center shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] hover:bg-[#d4d4d4]"
                style={{ fontFamily: WIN95_FONT }}
              >
                Try Again
              </Link>
              <a
                href="https://twitter.com/intent/tweet?text=I%20just%20conquered%20The%20Impossible%20Form!%20A%20satirical%20take%20on%20dark%20UX%20patterns.%20Can%20you%20beat%20my%20score%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1 min-w-[100px] bg-[#c0c0c0] text-[11px] text-black text-center shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] hover:bg-[#d4d4d4]"
                style={{ fontFamily: WIN95_FONT }}
              >
                Share Victory
              </a>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-[#c0c0c0] px-[2px] py-[2px] flex border-t border-[#ffffff]">
            <div className="flex-1 shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px]">
              <span className="text-[11px] text-black">
                Form completed successfully!
              </span>
            </div>
            <div className="w-[80px] shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] text-center">
              <span className="text-[11px] text-black">Grade: {rating.grade}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-white" style={{ textShadow: '1px 1px 0 #000' }}>
            Built by{' '}
            <a
              href="https://github.com/juliocalvorios"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Julio Calvo
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function VictoryPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#008080', fontFamily: WIN95_FONT }}
      >
        <div className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-[11px] text-black">Loading your victory...</p>
        </div>
      </div>
    }>
      <VictoryContent />
    </Suspense>
  )
}

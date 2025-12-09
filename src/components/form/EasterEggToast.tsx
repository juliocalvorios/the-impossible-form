'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { EasterEggEvent } from '@/hooks/useEasterEggs'

const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

interface EasterEggToastProps {
  egg: EasterEggEvent | null
}

export function EasterEggToast({ egg }: EasterEggToastProps) {
  // Windows 95 dialog icon based on type
  const getIcon = () => {
    switch (egg?.type) {
      case 'caught':
        // Error/stop icon (red circle with X)
        return (
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="#800000" strokeWidth="2"/>
            <path d="M10,10 L22,22 M22,10 L10,22" stroke="#FFF" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        )
      case 'warning':
        // Warning icon (yellow triangle with !)
        return (
          <svg width="32" height="32" viewBox="0 0 32 32">
            <polygon points="16,2 30,28 2,28" fill="#FFFF00" stroke="#000" strokeWidth="2"/>
            <text x="16" y="24" fontSize="18" textAnchor="middle" fill="#000" fontWeight="bold">!</text>
          </svg>
        )
      case 'taunt':
        // Info icon (blue circle with i)
        return (
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#000080" stroke="#000" strokeWidth="2"/>
            <text x="16" y="22" fontSize="20" textAnchor="middle" fill="#FFF" fontWeight="bold">i</text>
          </svg>
        )
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#000080" stroke="#000" strokeWidth="2"/>
            <text x="16" y="22" fontSize="20" textAnchor="middle" fill="#FFF" fontWeight="bold">?</text>
          </svg>
        )
    }
  }

  // Title based on type
  const getTitle = () => {
    switch (egg?.type) {
      case 'caught':
        return 'Form Defense System'
      case 'warning':
        return 'Warning'
      case 'taunt':
        return 'System Message'
      default:
        return 'Notice'
    }
  }

  return (
    <AnimatePresence>
      {egg && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          style={{ fontFamily: WIN95_FONT }}
        >
          {/* Windows 95 Dialog Box */}
          <div
            className="min-w-[300px]"
            style={{
              backgroundColor: '#c0c0c0',
              boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
            }}
          >
            {/* Title Bar */}
            <div
              className="h-[18px] px-[2px] py-[2px] flex items-center justify-between"
              style={{
                background: 'linear-gradient(90deg, #000080, #1084d0)',
              }}
            >
              <span className="text-white text-[11px] font-bold px-1">{getTitle()}</span>
              <button
                className="w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold"
                style={{
                  backgroundColor: '#c0c0c0',
                  boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                {getIcon()}
              </div>

              {/* Message */}
              <div className="flex-1 pt-1">
                <p className="text-[11px] text-black leading-relaxed">
                  {egg.message}
                </p>
              </div>
            </div>

            {/* Button Row */}
            <div className="px-4 pb-3 flex justify-center">
              <button
                className="px-6 py-1 text-[11px] text-black min-w-[75px]"
                style={{
                  backgroundColor: '#c0c0c0',
                  boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
                }}
              >
                OK
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EasterEggToast

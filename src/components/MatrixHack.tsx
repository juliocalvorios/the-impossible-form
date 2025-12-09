'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

interface MatrixHackProps {
  onHackComplete: (values: {
    name: string
    email: string
    password: string
    age: number
  }) => void
  onHackStart: () => void
  isHacking: boolean
}

// The "hacked" values that will be filled
const HACKED_VALUES = {
  name: 'John Hacker',
  email: 'bypass@system.net',
  password: 'Hack3d!2024',
  age: 27,
}

// Matrix characters
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Typing effect for input fields
function TypedText({ text, onComplete, speed = 50 }: { text: string; onComplete?: () => void; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setShowCursor(false)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className="text-[#00FF00]">
      {displayed}
      {showCursor && <span className="animate-pulse">_</span>}
    </span>
  )
}

// Matrix rain character
function MatrixChar({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.3] }}
      transition={{ duration: 0.5, delay, repeat: Infinity, repeatDelay: Math.random() * 2 }}
      className="text-[#00FF00] text-[10px]"
      style={{ textShadow: '0 0 5px #00FF00' }}
    >
      {char}
    </motion.span>
  )
}

// Hack button (Windows 95 style, with attention-grabbing animation)
export function HackButton({ onClick }: { onClick: () => void }) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState('C:\\>_')

  // Periodic attention-grabbing effect
  useEffect(() => {
    const glitchChars = '!@#$%^&*<>?/\\|'

    const doGlitch = () => {
      setIsGlitching(true)

      // Rapid text changes
      let count = 0
      const glitchInterval = setInterval(() => {
        const randomText = Array.from({ length: 5 }, () =>
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('')
        setGlitchText(randomText)
        count++

        if (count > 8) {
          clearInterval(glitchInterval)
          setGlitchText('C:\\>_')
          setIsGlitching(false)
        }
      }, 80)
    }

    // Start glitching every 8-15 seconds randomly
    const scheduleNextGlitch = () => {
      const delay = 8000 + Math.random() * 7000
      return setTimeout(() => {
        doGlitch()
        scheduleNextGlitch()
      }, delay)
    }

    // Initial delay before first glitch (5 seconds after appearing)
    const initialTimeout = setTimeout(() => {
      doGlitch()
      scheduleNextGlitch()
    }, 5000)

    return () => clearTimeout(initialTimeout)
  }, [])

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isGlitching ? [1, 1.1, 0.95, 1.05, 1] : 1,
        x: isGlitching ? [0, -2, 3, -1, 0] : 0,
      }}
      transition={{
        opacity: { delay: 3, duration: 0.5 },
        scale: { duration: 0.4 },
        x: { duration: 0.4 },
      }}
      className="fixed bottom-4 right-4 z-40"
      style={{ fontFamily: WIN95_FONT }}
      title="???"
    >
      <motion.div
        className="shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] px-2 py-1 active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff]"
        animate={{
          backgroundColor: isGlitching ? ['#c0c0c0', '#00FF00', '#c0c0c0', '#00FF00', '#c0c0c0'] : '#c0c0c0',
        }}
        transition={{ duration: 0.4 }}
        whileHover={{ backgroundColor: '#d4d4d4' }}
      >
        <span
          className="text-[10px] font-mono"
          style={{
            color: isGlitching ? '#00FF00' : '#000000',
            textShadow: isGlitching ? '0 0 5px #00FF00' : 'none',
          }}
        >
          {glitchText}
        </span>
      </motion.div>
    </motion.button>
  )
}

// Matrix overlay that goes INSIDE the Windows form
export function MatrixHackOverlay({
  isHacking,
  onComplete,
}: {
  isHacking: boolean
  onComplete: (values: typeof HACKED_VALUES) => void
}) {
  const [hackPhase, setHackPhase] = useState<'matrix' | 'typing' | 'complete'>('matrix')
  const [typingField, setTypingField] = useState<'name' | 'email' | 'password' | 'age' | 'done'>('name')
  const [matrixChars, setMatrixChars] = useState<string[][]>([])

  // Generate matrix characters on start
  useEffect(() => {
    if (isHacking) {
      setHackPhase('matrix')
      setTypingField('name')

      // Generate random matrix chars for background
      const rows = 15
      const cols = 40
      const chars = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        )
      )
      setMatrixChars(chars)

      // Start typing phase after matrix effect
      const timer = setTimeout(() => {
        setHackPhase('typing')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isHacking])

  const handleFieldComplete = useCallback((field: 'name' | 'email' | 'password' | 'age') => {
    const nextField: Record<string, 'email' | 'password' | 'age' | 'done'> = {
      name: 'email',
      email: 'password',
      password: 'age',
      age: 'done',
    }

    setTimeout(() => {
      const next = nextField[field]
      setTypingField(next)

      if (next === 'done') {
        setHackPhase('complete')
        setTimeout(() => {
          onComplete(HACKED_VALUES)
        }, 1500)
      }
    }, 200)
  }, [onComplete])

  if (!isHacking) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 overflow-hidden"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
        }}
      />

      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {matrixChars.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((char, colIndex) => (
              <MatrixChar
                key={`${rowIndex}-${colIndex}`}
                char={char}
                delay={(rowIndex * 0.05) + (colIndex * 0.02)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* DOS-style window */}
          <div className="bg-[#000080] border-2 border-[#aaaaaa]">
            {/* Title bar */}
            <div className="bg-[#aaaaaa] px-2 py-[2px] flex justify-between items-center">
              <span className="text-[11px] text-black font-bold">C:\WINDOWS\system32\cmd.exe</span>
              <div className="flex gap-[2px]">
                <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff] text-[10px] font-bold">_</button>
                <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff] text-[10px] font-bold">×</button>
              </div>
            </div>

            {/* Terminal content */}
            <div className="bg-black p-3 text-[11px] text-[#c0c0c0] min-h-[200px]" style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>
              <div className="mb-2">Microsoft Windows [Version 4.10.1998]</div>
              <div className="mb-2">(C) Copyright Microsoft Corp 1981-1998.</div>
              <div className="mb-4">C:\WINDOWS\system32&gt; <span className="text-[#00FF00]">hack.exe --bypass-form</span></div>

              {hackPhase === 'matrix' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-[#FFFF00]">[*] Initializing bypass protocol...</div>
                  <div className="text-[#00FF00]">[*] Scanning form defenses...</div>
                  <motion.div
                    animate={{ opacity: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-[#00FF00]"
                  >
                    [*] Injecting payload..._
                  </motion.div>
                </motion.div>
              )}

              {(hackPhase === 'typing' || hackPhase === 'complete') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-[#00FF00] mb-2">[+] BYPASS SUCCESSFUL!</div>
                  <div className="text-[#FFFF00] mb-3">[*] Injecting form data...</div>

                  <div className="space-y-1 ml-2">
                    <div className="flex">
                      <span className="text-[#808080] w-20">name:</span>
                      {typingField === 'name' ? (
                        <TypedText text={HACKED_VALUES.name} onComplete={() => handleFieldComplete('name')} />
                      ) : ['email', 'password', 'age', 'done'].includes(typingField) ? (
                        <span className="text-[#00FF00]">{HACKED_VALUES.name}</span>
                      ) : (
                        <span className="text-[#808080]">...</span>
                      )}
                    </div>

                    <div className="flex">
                      <span className="text-[#808080] w-20">email:</span>
                      {typingField === 'email' ? (
                        <TypedText text={HACKED_VALUES.email} onComplete={() => handleFieldComplete('email')} />
                      ) : ['password', 'age', 'done'].includes(typingField) ? (
                        <span className="text-[#00FF00]">{HACKED_VALUES.email}</span>
                      ) : (
                        <span className="text-[#808080]">...</span>
                      )}
                    </div>

                    <div className="flex">
                      <span className="text-[#808080] w-20">password:</span>
                      {typingField === 'password' ? (
                        <TypedText text={HACKED_VALUES.password} onComplete={() => handleFieldComplete('password')} />
                      ) : ['age', 'done'].includes(typingField) ? (
                        <span className="text-[#00FF00]">{HACKED_VALUES.password}</span>
                      ) : (
                        <span className="text-[#808080]">...</span>
                      )}
                    </div>

                    <div className="flex">
                      <span className="text-[#808080] w-20">age:</span>
                      {typingField === 'age' ? (
                        <TypedText text={String(HACKED_VALUES.age)} onComplete={() => handleFieldComplete('age')} />
                      ) : typingField === 'done' ? (
                        <span className="text-[#00FF00]">{HACKED_VALUES.age}</span>
                      ) : (
                        <span className="text-[#808080]">...</span>
                      )}
                    </div>
                  </div>

                  {hackPhase === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4"
                    >
                      <div className="text-[#00FF00]">[+] All fields injected!</div>
                      <div className="text-[#FFFF00]">[*] Disabling form defenses...</div>
                      <motion.div
                        animate={{ opacity: [0, 1] }}
                        transition={{ repeat: 3, duration: 0.3 }}
                        className="text-[#FF0000] font-bold mt-2"
                      >
                        ACCESS GRANTED
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Legacy export for compatibility
export function MatrixHack({ onHackComplete, onHackStart }: MatrixHackProps) {
  return null // Now handled by HackButton and MatrixHackOverlay separately
}

export default MatrixHack

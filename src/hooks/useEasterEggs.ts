'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface EasterEggEvent {
  id: string
  message: string
  type: 'warning' | 'caught' | 'taunt'
}

const INACTIVITY_TIMEOUT = 30000 // 30 seconds

export function useEasterEggs() {
  const [activeEgg, setActiveEgg] = useState<EasterEggEvent | null>(null)
  const [triggeredEggs, setTriggeredEggs] = useState<Set<string>>(new Set())
  const lastActivityRef = useRef<number>(Date.now())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Show an easter egg message
  const triggerEgg = useCallback((egg: EasterEggEvent) => {
    // Don't show the same egg twice (except inactivity)
    if (triggeredEggs.has(egg.id) && egg.id !== 'inactivity') return

    setActiveEgg(egg)
    setTriggeredEggs(prev => new Set([...prev, egg.id]))

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setActiveEgg(null)
    }, 3000)
  }, [triggeredEggs])

  // Reset activity timer
  const resetActivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now()

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      triggerEgg({
        id: 'inactivity',
        message: "Still there? I thought you gave up...",
        type: 'taunt'
      })
    }, INACTIVITY_TIMEOUT)
  }, [triggerEgg])

  // Detect paste
  const handlePaste = useCallback(() => {
    triggerEgg({
      id: 'paste',
      message: "Ctrl+V detected. That's cheating.",
      type: 'caught'
    })
  }, [triggerEgg])

  // Detect autofill (check if multiple fields filled rapidly)
  const handleAutofill = useCallback(() => {
    triggerEgg({
      id: 'autofill',
      message: "Auto-fill? How impersonal.",
      type: 'caught'
    })
  }, [triggerEgg])

  // Detect devtools (simplified - checks for window resize patterns)
  const handleDevToolsOpen = useCallback(() => {
    triggerEgg({
      id: 'devtools',
      message: "I saw that. Nice try, inspector.",
      type: 'caught'
    })
  }, [triggerEgg])

  // Setup event listeners
  useEffect(() => {
    // Activity tracking
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach(event => {
      window.addEventListener(event, resetActivityTimer)
    })

    // Start initial timer
    resetActivityTimer()

    // Paste detection
    const handlePasteEvent = (e: ClipboardEvent) => {
      // Only trigger if pasting into an input
      if (e.target instanceof HTMLInputElement) {
        handlePaste()
      }
    }
    document.addEventListener('paste', handlePasteEvent)

    // Devtools detection (simplified approach)
    let devtoolsOpen = false
    const checkDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
        devtoolsOpen = true
        handleDevToolsOpen()
      } else if (!widthThreshold && !heightThreshold) {
        devtoolsOpen = false
      }
    }
    window.addEventListener('resize', checkDevTools)
    // Check on load too
    setTimeout(checkDevTools, 1000)

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetActivityTimer)
      })
      document.removeEventListener('paste', handlePasteEvent)
      window.removeEventListener('resize', checkDevTools)
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [resetActivityTimer, handlePaste, handleDevToolsOpen])

  // Autofill detection - call this when form values change rapidly
  const checkForAutofill = useCallback((fieldsFilledCount: number) => {
    // If 3+ fields filled in quick succession, probably autofill
    if (fieldsFilledCount >= 3 && !triggeredEggs.has('autofill')) {
      handleAutofill()
    }
  }, [handleAutofill, triggeredEggs])

  return {
    activeEgg,
    checkForAutofill,
    triggeredEggsCount: triggeredEggs.size,
  }
}

export default useEasterEggs

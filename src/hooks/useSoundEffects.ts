'use client'

import { useCallback, useRef, useEffect } from 'react'

// Web Audio API based sound effects - no external files needed
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Play a beep/tone
  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) => {
    const ctx = initAudio()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [initAudio])

  // Button flee - quick "woosh" sound
  const playButtonFlee = useCallback(() => {
    const ctx = initAudio()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    // Sweep from high to low frequency
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }, [initAudio])

  // Checkbox uncheck - sad "boop" sound
  const playCheckboxReset = useCallback(() => {
    playTone(400, 0.1, 'sine', 0.3)
    setTimeout(() => playTone(300, 0.15, 'sine', 0.25), 100)
  }, [playTone])

  // Error sound - short buzz
  const playError = useCallback(() => {
    playTone(150, 0.1, 'square', 0.15)
  }, [playTone])

  // Success/victory fanfare
  const playVictory = useCallback(() => {
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.25), i * 150)
    })
  }, [playTone])

  // Easter egg detected - playful sound
  const playEasterEgg = useCallback(() => {
    playTone(600, 0.08, 'square', 0.2)
    setTimeout(() => playTone(800, 0.08, 'square', 0.2), 80)
  }, [playTone])

  // Email cleared - swoosh down
  const playEmailClear = useCallback(() => {
    const ctx = initAudio()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }, [initAudio])

  // Typing sound - subtle click
  const playKeypress = useCallback(() => {
    playTone(1200, 0.02, 'sine', 0.05)
  }, [playTone])

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    playButtonFlee,
    playCheckboxReset,
    playError,
    playVictory,
    playEasterEgg,
    playEmailClear,
    playKeypress,
    initAudio,
  }
}

export default useSoundEffects

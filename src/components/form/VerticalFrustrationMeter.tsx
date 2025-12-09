'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { FormStats, DefenseLevel } from '@/types'

const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

interface VerticalFrustrationMeterProps {
  stats: FormStats
  defenseLevel: DefenseLevel
}

export function VerticalFrustrationMeter({ stats, defenseLevel }: VerticalFrustrationMeterProps) {
  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }, [position])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragStartRef.current.x
      let newY = e.clientY - dragStartRef.current.y

      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const maxX = window.innerWidth - rect.width
        const maxY = window.innerHeight - rect.height
        // Allow moving up (negative Y relative to center) and down
        newX = Math.max(-16, Math.min(newX, maxX))
        newY = Math.max(-window.innerHeight / 2 + 20, Math.min(newY, maxY))
      }

      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])
  const frustrationScore = useMemo(() => {
    const errorWeight = stats.validationErrors * 5
    const chaseWeight = stats.buttonChases * 8
    const timeWeight = Math.min(stats.timeSpent / 10, 20)
    const shuffleWeight = stats.fieldsShuffled * 10
    const checkboxWeight = stats.checkboxResets * 15

    return Math.min(100, errorWeight + chaseWeight + timeWeight + shuffleWeight + checkboxWeight)
  }, [stats])

  const frustrationMessage = useMemo(() => {
    if (frustrationScore < 20) return { text: 'Calm', color: '#008000' }
    if (frustrationScore < 40) return { text: 'Annoyed', color: '#808000' }
    if (frustrationScore < 60) return { text: 'Frustrated', color: '#FF8000' }
    if (frustrationScore < 80) return { text: 'Angry', color: '#FF0000' }
    return { text: 'RAGE!', color: '#800000' }
  }, [frustrationScore])

  const barColor = useMemo(() => {
    if (frustrationScore < 20) return '#00FF00'
    if (frustrationScore < 40) return '#FFFF00'
    if (frustrationScore < 60) return '#FFA500'
    if (frustrationScore < 80) return '#FF0000'
    return '#800000'
  }, [frustrationScore])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={elementRef}
      className="fixed left-4 top-1/2 z-40 select-none"
      style={{
        fontFamily: WIN95_FONT,
        transform: `translate(${position.x}px, calc(-50% + ${position.y}px))`,
      }}
    >
      {/* Windows 95 style window */}
      <div className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]">
        {/* Title bar - DRAGGABLE */}
        <div
          onMouseDown={handleMouseDown}
          className="h-[18px] bg-gradient-to-r from-[#000080] to-[#1084d0] px-[2px] py-[2px] flex items-center justify-between"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex items-center gap-[2px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" fill="#c0c0c0" stroke="#808080"/>
              <rect x="3" y="5" width="8" height="6" fill="#FF0000"/>
              <rect x="3" y="3" width="8" height="2" fill="#00FF00"/>
            </svg>
            <span className="text-white text-[11px] font-bold">Stats</span>
          </div>
          <button className="w-[14px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
            <span className="text-black text-[9px] font-bold leading-none">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-2">
          {/* Time display - LCD style */}
          <div className="mb-2">
            <div className="text-[10px] text-black mb-[2px]">Time Elapsed:</div>
            <div
              className="bg-[#000000] px-2 py-1 shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff]"
            >
              <span
                className="font-mono text-[16px] font-bold tracking-wider"
                style={{ color: '#00FF00', textShadow: '0 0 5px #00FF00' }}
              >
                {formatTime(stats.timeSpent)}
              </span>
            </div>
          </div>

          {/* Frustration thermometer */}
          <div className="mb-2">
            <div className="text-[10px] text-black mb-[2px]">Frustration Level:</div>
            <div className="flex items-center gap-2">
              {/* Vertical thermometer */}
              <div
                className="relative w-[20px] h-[80px] bg-[#ffffff] shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080]"
              >
                {/* Fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ backgroundColor: barColor }}
                  initial={{ height: 0 }}
                  animate={{ height: `${frustrationScore}%` }}
                  transition={{ duration: 0.5 }}
                />
                {/* Tick marks */}
                {[0, 25, 50, 75, 100].map((tick) => (
                  <div
                    key={tick}
                    className="absolute w-full h-[1px] bg-[#808080]"
                    style={{ bottom: `${tick}%` }}
                  />
                ))}
              </div>
              {/* Percentage and status */}
              <div className="flex flex-col">
                <span
                  className="text-[14px] font-bold"
                  style={{ color: frustrationMessage.color }}
                >
                  {Math.round(frustrationScore)}%
                </span>
                <span
                  className="text-[9px] font-bold"
                  style={{ color: frustrationMessage.color }}
                >
                  {frustrationMessage.text}
                </span>
              </div>
            </div>
          </div>

          {/* Stats group box */}
          <fieldset className="border-t border-l border-[#808080] shadow-[1px_1px_0_0_#ffffff] p-2 pt-1 mb-2">
            <legend className="px-1 text-[10px] text-black">Statistics</legend>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-black">Errors:</span>
                <span className="font-mono font-bold text-black">{stats.validationErrors}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-black">Chases:</span>
                <span className="font-mono font-bold text-black">{stats.buttonChases}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-black">Resets:</span>
                <span className="font-mono font-bold text-black">{stats.checkboxResets}</span>
              </div>
            </div>
          </fieldset>

          {/* Defense level indicator */}
          <div className="text-[10px] text-black mb-[2px]">Defense Level:</div>
          <div className="flex gap-[2px]">
            {[1, 2, 3].map((level) => (
              <motion.div
                key={level}
                className="w-[22px] h-[18px] flex items-center justify-center text-[10px] font-bold shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]"
                style={{
                  backgroundColor: defenseLevel >= level
                    ? level === 3 ? '#FF0000'
                      : level === 2 ? '#FFA500'
                      : '#FFFF00'
                    : '#c0c0c0',
                  color: defenseLevel >= level ? '#000000' : '#808080',
                }}
                animate={{
                  scale: defenseLevel >= level ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {level}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerticalFrustrationMeter

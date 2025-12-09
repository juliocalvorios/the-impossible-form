'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition?: Position
  bounds?: 'window' | 'parent' | 'none'
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, bounds = 'window' } = options

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from title bar (check if target has data-drag-handle)
    const target = e.target as HTMLElement
    if (!target.closest('[data-drag-handle]')) return

    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    let newX = e.clientX - dragStartRef.current.x
    let newY = e.clientY - dragStartRef.current.y

    // Apply bounds
    if (bounds === 'window' && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height

      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
    }

    setPosition({ x: newX, y: newY })
  }, [isDragging, bounds])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: isDragging ? 'grabbing' : undefined,
    },
  }
}

export default useDraggable

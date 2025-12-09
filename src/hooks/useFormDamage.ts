'use client'

import { useMemo } from 'react'

export type DamageLevel = 0 | 1 | 2 | 3 | 4 | 5

export interface DamageState {
  level: DamageLevel
  // Visual effects
  shake: boolean
  glitchIntensity: number // 0-1
  crackCount: number
  colorShift: number // hue rotation degrees
  opacity: number
  // CSS classes
  containerClass: string
  formClass: string
}

interface UseFormDamageProps {
  validationErrors: number
  buttonChases: number
  checkboxResets: number
  timeSpent: number
  isSurrendered: boolean
}

export function useFormDamage({
  validationErrors,
  buttonChases,
  checkboxResets,
  timeSpent,
  isSurrendered,
}: UseFormDamageProps): DamageState {

  const damage = useMemo(() => {
    // Calculate total "damage" score
    const damageScore =
      validationErrors * 2 +
      buttonChases * 5 +
      checkboxResets * 8 +
      Math.floor(timeSpent / 30) * 3

    // Determine damage level (0-5)
    let level: DamageLevel = 0
    if (damageScore >= 80) level = 5
    else if (damageScore >= 50) level = 4
    else if (damageScore >= 30) level = 3
    else if (damageScore >= 15) level = 2
    else if (damageScore >= 5) level = 1

    // If surrendered, max damage
    if (isSurrendered) level = 5

    // Calculate visual effects based on level
    const glitchIntensity = level * 0.15
    const crackCount = level
    const colorShift = level * 3 // subtle hue shift
    const opacity = 1 - (level * 0.03)
    const shake = level >= 3 && !isSurrendered

    // Generate CSS classes
    const containerClasses = [
      'transition-all duration-500',
      level >= 1 && 'form-damage-1',
      level >= 2 && 'form-damage-2',
      level >= 3 && 'form-damage-3',
      level >= 4 && 'form-damage-4',
      level >= 5 && 'form-damage-5',
      isSurrendered && 'form-surrendered',
    ].filter(Boolean).join(' ')

    const formClasses = [
      'transition-all duration-300',
      shake && 'animate-subtle-shake',
      level >= 2 && 'shadow-damage',
      level >= 4 && 'border-damage',
    ].filter(Boolean).join(' ')

    return {
      level,
      shake,
      glitchIntensity,
      crackCount,
      colorShift,
      opacity,
      containerClass: containerClasses,
      formClass: formClasses,
    }
  }, [validationErrors, buttonChases, checkboxResets, timeSpent, isSurrendered])

  return damage
}

export default useFormDamage

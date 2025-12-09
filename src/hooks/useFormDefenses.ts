'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { FormStats, DefenseLevel, FormDefenseState } from '@/types'
import { getInitialRequirements } from '@/lib/formSchema'

const CHECKBOX_TIME_LIMIT = 10 // seconds

interface UseFormDefensesReturn {
  state: FormDefenseState
  stats: FormStats
  // Actions
  incrementButtonFlee: () => void
  incrementCheckboxReset: () => void
  incrementValidationError: () => void
  updatePasswordRequirements: (newReqs: string[]) => void
  surrenderForm: () => void
  // Computed
  checkboxTimeLimit: number
  isSurrendered: boolean
}

export function useFormDefenses(): UseFormDefensesReturn {
  // Defense state
  const [state, setState] = useState<FormDefenseState>({
    defenseLevel: 1,
    buttonFleeCount: 0,
    shuffleCount: 0,
    checkboxTimeRemaining: null,
    currentPasswordRequirements: getInitialRequirements(),
    isFormSurrendered: false,
  })

  // Stats tracking
  const [stats, setStats] = useState<FormStats>({
    totalAttempts: 0,
    validationErrors: 0,
    buttonChases: 0,
    timeSpent: 0,
    fieldsShuffled: 0,
    checkboxResets: 0,
    passwordRequirementChanges: 0,
  })

  // Timer for time tracking
  const startTimeRef = useRef<number>(Date.now())

  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update defense level based on frustration
  useEffect(() => {
    const frustration = stats.validationErrors + stats.buttonChases * 2 + stats.checkboxResets * 3

    let newLevel: DefenseLevel = 1
    if (frustration > 15) newLevel = 3
    else if (frustration > 7) newLevel = 2

    if (newLevel !== state.defenseLevel) {
      setState(prev => ({ ...prev, defenseLevel: newLevel }))
    }
  }, [stats, state.defenseLevel])

  // Actions
  const incrementButtonFlee = useCallback(() => {
    setState(prev => ({
      ...prev,
      buttonFleeCount: prev.buttonFleeCount + 1,
    }))
    setStats(prev => ({
      ...prev,
      buttonChases: prev.buttonChases + 1,
    }))
  }, [])

  const incrementCheckboxReset = useCallback(() => {
    setStats(prev => ({
      ...prev,
      checkboxResets: prev.checkboxResets + 1,
    }))
  }, [])

  const incrementValidationError = useCallback(() => {
    setStats(prev => ({
      ...prev,
      validationErrors: prev.validationErrors + 1,
      totalAttempts: prev.totalAttempts + 1,
    }))
  }, [])

  const updatePasswordRequirements = useCallback((newReqs: string[]) => {
    setState(prev => ({
      ...prev,
      currentPasswordRequirements: newReqs,
    }))
    setStats(prev => ({
      ...prev,
      passwordRequirementChanges: prev.passwordRequirementChanges + 1,
    }))
  }, [])

  const surrenderForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFormSurrendered: true,
    }))
  }, [])

  // Checkbox time limit decreases as defense level increases
  const checkboxTimeLimit = CHECKBOX_TIME_LIMIT - (state.defenseLevel - 1) * 2

  return {
    state,
    stats,
    incrementButtonFlee,
    incrementCheckboxReset,
    incrementValidationError,
    updatePasswordRequirements,
    surrenderForm,
    checkboxTimeLimit,
    isSurrendered: state.isFormSurrendered,
  }
}

export default useFormDefenses

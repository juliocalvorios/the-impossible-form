'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

import {
  FleeingButton,
  SelfUncheckingCheckbox,
  SelfClearingEmailInput,
  GaslightingPasswordInput,
  VerticalFrustrationMeter,
  EasterEggToast,
  MovingAgeField,
} from '@/components/form'
import { themeStyles, type ThemeId } from '@/components/ThemePreviewModal'
import { HackButton, MatrixHackOverlay } from '@/components/MatrixHack'
import { useFormDefenses } from '@/hooks/useFormDefenses'
import { useEasterEggs } from '@/hooks/useEasterEggs'
import { useFormDamage } from '@/hooks/useFormDamage'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { formSchema, type FormSchemaType } from '@/lib/formSchema'

// Windows 95 style constants
const WIN95_FONT = 'Tahoma, "MS Sans Serif", Geneva, sans-serif'

export default function Home() {
  const router = useRouter()
  const [agePosition, setAgePosition] = useState(0)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('retro')
  const [isHacking, setIsHacking] = useState(false)

  // Draggable window state
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [isDraggingWindow, setIsDraggingWindow] = useState(false)
  const windowDragStartRef = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleWindowMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingWindow(true)
    windowDragStartRef.current = {
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    }
  }, [windowPosition])

  useEffect(() => {
    if (!isDraggingWindow) return

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - windowDragStartRef.current.x
      let newY = e.clientY - windowDragStartRef.current.y

      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect()
        // Allow dragging with reasonable bounds
        const minX = -rect.width + 100
        const maxX = window.innerWidth - 100
        const minY = -rect.height + 50
        const maxY = window.innerHeight - 50
        newX = Math.max(minX, Math.min(newX, maxX))
        newY = Math.max(minY, Math.min(newY, maxY))
      }

      setWindowPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => setIsDraggingWindow(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingWindow])

  const {
    state,
    stats,
    incrementButtonFlee,
    incrementCheckboxReset,
    incrementValidationError,
    updatePasswordRequirements,
    surrenderForm,
    checkboxTimeLimit,
    isSurrendered,
  } = useFormDefenses()

  const { activeEgg } = useEasterEggs()

  const damage = useFormDamage({
    validationErrors: stats.validationErrors,
    buttonChases: stats.buttonChases,
    checkboxResets: stats.checkboxResets,
    timeSpent: stats.timeSpent,
    isSurrendered,
  })

  const {
    playButtonFlee,
    playCheckboxReset,
    playError,
    playVictory,
    playEasterEgg,
    playEmailClear,
  } = useSoundEffects()

  // Play sound on easter egg
  useEffect(() => {
    if (activeEgg) {
      playEasterEgg()
    }
  }, [activeEgg, playEasterEgg])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      age: null,
      terms: false,
      honeypot: '',
    },
  })

  const termsValue = watch('terms')
  const passwordValue = watch('password')
  const emailValue = watch('email')
  const ageValue = watch('age')

  // Track validation errors with sound
  useEffect(() => {
    const errorCount = Object.keys(errors).length
    if (errorCount > 0) {
      incrementValidationError()
      playError()
    }
  }, [errors, incrementValidationError, playError])

  const handleTermsChange = useCallback((checked: boolean) => {
    setValue('terms', checked)
  }, [setValue])

  const handleTermsExpired = useCallback(() => {
    incrementCheckboxReset()
    playCheckboxReset()
  }, [incrementCheckboxReset, playCheckboxReset])

  const handlePasswordChange = useCallback((value: string) => {
    setValue('password', value)
    trigger('password')
  }, [setValue, trigger])

  const handleEmailChange = useCallback((value: string) => {
    const prevValue = emailValue
    setValue('email', value)
    trigger('email')
    if (value === '' && prevValue && prevValue.length > 0) {
      playEmailClear()
    }
  }, [setValue, trigger, emailValue, playEmailClear])

  const handleAgeChange = useCallback((value: number | null) => {
    setValue('age', value)
    if (value !== null) {
      trigger('age')
    }
  }, [setValue, trigger])

  const handleAgePositionChange = useCallback(() => {
    setAgePosition(prev => Math.min(prev + 1, 3))
    playButtonFlee()
  }, [playButtonFlee])

  const handleButtonFlee = useCallback(() => {
    incrementButtonFlee()
    playButtonFlee()
  }, [incrementButtonFlee, playButtonFlee])

  const onSubmit = () => {
    playVictory()
    const statsParam = encodeURIComponent(JSON.stringify(stats))
    router.push(`/victory?stats=${statsParam}`)
  }

  const onError = () => {
    incrementValidationError()
    playError()

    if (stats.validationErrors >= 10 && !isSurrendered) {
      surrenderForm()
    }
  }

  // Matrix hack handlers
  const handleHackStart = useCallback(() => {
    setIsHacking(true)
  }, [])

  const handleHackComplete = useCallback((values: {
    name: string
    email: string
    password: string
    age: number
  }) => {
    setIsHacking(false)
    setValue('name', values.name)
    setValue('email', values.email)
    setValue('password', values.password)
    setValue('age', values.age)
    setValue('terms', true)
    surrenderForm()
    playVictory()
  }, [setValue, surrenderForm, playVictory])

  const theme = themeStyles[currentTheme]
  const isRetro = currentTheme === 'retro'

  // Windows 95 input style
  const win95InputClass = `
    w-full px-1 py-[2px]
    bg-white text-black text-[11px]
    shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#0a0a0a,inset_-2px_-2px_0_0_#dfdfdf,inset_2px_2px_0_0_#808080]
    focus:outline-none border-none
  `

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${currentTheme === 'terminal' ? theme.container : ''}`}
      style={{
        backgroundColor: currentTheme === 'retro' ? '#008080' : undefined,
        fontFamily: isRetro ? WIN95_FONT : undefined,
      }}
    >
      {/* Theme extra elements */}
      {theme.extra}

      {/* Secret Hack Button */}
      <HackButton onClick={handleHackStart} />

      {/* Vertical Frustration Meter - Left side */}
      <VerticalFrustrationMeter
        stats={stats}
        defenseLevel={state.defenseLevel}
      />

      {/* Easter Egg Toast */}
      <EasterEggToast egg={activeEgg} />

      {isRetro ? (
        /* Windows 95 Style Window */
        <motion.div
          ref={windowRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: windowPosition.x,
            y: windowPosition.y,
          }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
          className="w-full max-w-lg select-none"
        >
          {/* Window Container */}
          <div
            className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]"
            style={{ fontFamily: WIN95_FONT }}
          >
            {/* Title Bar - DRAGGABLE */}
            <div
              onMouseDown={handleWindowMouseDown}
              className="h-[18px] bg-gradient-to-r from-[#000080] to-[#1084d0] px-[2px] py-[2px] flex items-center justify-between select-none"
              style={{ cursor: isDraggingWindow ? 'grabbing' : 'grab' }}
            >
              <div className="flex items-center gap-[3px]">
                {/* Window Icon */}
                <div className="w-[16px] h-[14px] flex items-center justify-center">
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <rect x="0" y="0" width="14" height="12" fill="#c0c0c0"/>
                    <rect x="0" y="0" width="14" height="3" fill="#000080"/>
                    <rect x="1" y="4" width="12" height="7" fill="white" stroke="#808080" strokeWidth="0.5"/>
                  </svg>
                </div>
                <span className="text-white text-[11px] font-bold">
                  The Impossible Form
                </span>
              </div>

              {/* Window Controls */}
              <div className="flex gap-[2px]">
                {/* Minimize */}
                <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center">
                  <div className="w-[6px] h-[2px] bg-black mt-[4px]" />
                </button>
                {/* Maximize */}
                <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center">
                  <div className="w-[8px] h-[7px] border border-black border-t-2" />
                </button>
                {/* Close */}
                <button className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center">
                  <span className="text-black text-[11px] font-bold leading-none mt-[-1px]">×</span>
                </button>
              </div>
            </div>

            {/* Menu Bar */}
            <div className="bg-[#c0c0c0] px-[2px] py-[1px] flex border-b border-[#808080]">
              <button className="px-[6px] py-[1px] text-[11px] text-black hover:bg-[#000080] hover:text-white">
                <span className="underline">F</span>ile
              </button>
              <button className="px-[6px] py-[1px] text-[11px] text-black hover:bg-[#000080] hover:text-white">
                <span className="underline">E</span>dit
              </button>
              <button className="px-[6px] py-[1px] text-[11px] text-black hover:bg-[#000080] hover:text-white">
                <span className="underline">V</span>iew
              </button>
              <button className="px-[6px] py-[1px] text-[11px] text-black hover:bg-[#000080] hover:text-white">
                <span className="underline">H</span>elp
              </button>
            </div>

            {/* Toolbar */}
            <div className="bg-[#c0c0c0] px-[4px] py-[2px] flex items-center gap-[2px] border-b border-[#808080]">
              <button className="w-[23px] h-[22px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#808080,inset_1px_1px_0_0_#ffffff] hover:shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" fill="white" stroke="#808080"/>
                  <line x1="3" y1="5" x2="13" y2="5" stroke="#000080" strokeWidth="2"/>
                </svg>
              </button>
              <button className="w-[23px] h-[22px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#808080,inset_1px_1px_0_0_#ffffff] hover:shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="10" height="12" fill="#ffffcc" stroke="#808080"/>
                  <rect x="5" y="1" width="10" height="12" fill="white" stroke="#808080"/>
                </svg>
              </button>
              <div className="w-[1px] h-[20px] bg-[#808080] mx-[2px]" />
              <button className="w-[23px] h-[22px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#808080,inset_1px_1px_0_0_#ffffff] hover:shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] flex items-center justify-center text-[11px]">
                ?
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-[#c0c0c0] p-[8px] relative overflow-hidden max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Matrix Hack Overlay - Inside the window */}
              <AnimatePresence>
                {isHacking && (
                  <MatrixHackOverlay
                    isHacking={isHacking}
                    onComplete={handleHackComplete}
                  />
                )}
              </AnimatePresence>

              {/* Description */}
              <div className="mb-3 p-2 bg-[#ffffcc] border border-[#808080] shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080]">
                <p className="text-[11px] text-black">
                  <strong>Warning:</strong> This form doesn&apos;t want to be filled out. Good luck.
                </p>
                {damage.level > 0 && (
                  <p className="text-[11px] text-red-700 mt-1">
                    {damage.level === 1 && "The form is getting annoyed..."}
                    {damage.level === 2 && "The form is frustrated."}
                    {damage.level === 3 && "The form is angry!"}
                    {damage.level === 4 && "The form is furious!"}
                    {damage.level === 5 && (isSurrendered ? "The form has given up." : "THE FORM IS BREAKING!")}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                {/* Group Box - User Information */}
                <fieldset className="border-t border-l border-[#808080] shadow-[1px_1px_0_0_#ffffff] p-3 pt-1 mb-3">
                  <legend className="px-1 text-[11px] text-black">User Information</legend>

                  <div className="flex flex-col gap-3">
                    {/* Name field */}
                    <div style={{ order: 0 }}>
                      <label className="text-[11px] text-black block mb-1">Full Name:</label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Enter your name"
                        className={win95InputClass}
                        style={{ fontFamily: WIN95_FONT }}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-700 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email field */}
                    <div style={{ order: 1 }}>
                      <label className="text-[11px] text-black block mb-1">Email:</label>
                      <SelfClearingEmailInput
                        value={emailValue || ''}
                        onChange={handleEmailChange}
                        error={errors.email?.message}
                        inputClassName={win95InputClass}
                        errorClassName="text-[10px] text-red-700"
                      />
                    </div>

                    {/* Age field - MOVES! */}
                    <MovingAgeField
                      value={ageValue}
                      onChange={handleAgeChange}
                      error={errors.age?.message}
                      position={agePosition}
                      onPositionChange={handleAgePositionChange}
                      inputClassName={win95InputClass}
                      labelClassName="text-[11px] text-black"
                      errorClassName="text-[10px] text-red-700"
                    />
                  </div>
                </fieldset>

                {/* Group Box - Security */}
                <fieldset className="border-t border-l border-[#808080] shadow-[1px_1px_0_0_#ffffff] p-3 pt-1 mb-3">
                  <legend className="px-1 text-[11px] text-black">Security</legend>

                  <div>
                    <label className="text-[11px] text-black block mb-1">Password:</label>
                    <GaslightingPasswordInput
                      value={passwordValue || ''}
                      onChange={handlePasswordChange}
                      currentRequirements={state.currentPasswordRequirements}
                      onRequirementsChange={updatePasswordRequirements}
                      error={errors.password?.message}
                      inputClassName={win95InputClass}
                      labelClassName="text-[11px] text-black"
                    />
                  </div>
                </fieldset>

                {/* Group Box - Agreement */}
                <fieldset className="border-t border-l border-[#808080] shadow-[1px_1px_0_0_#ffffff] p-3 pt-1 mb-3">
                  <legend className="px-1 text-[11px] text-black">Terms and Conditions</legend>

                  <SelfUncheckingCheckbox
                    checked={termsValue || false}
                    onChange={handleTermsChange}
                    timeLimit={checkboxTimeLimit}
                    onTimeExpired={handleTermsExpired}
                    label="I agree to the terms and conditions"
                    labelClassName="text-[11px] text-black"
                  />
                  {errors.terms && (
                    <p className="text-[10px] text-red-700 mt-1">{errors.terms.message}</p>
                  )}
                </fieldset>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <input {...register('honeypot')} type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  <FleeingButton
                    onClick={() => {}}
                    fleeCount={state.buttonFleeCount}
                    onFlee={handleButtonFlee}
                    surrendered={isSurrendered}
                    buttonClassName={`
                      px-4 py-1 min-w-[75px]
                      bg-[#c0c0c0] text-[11px] text-black
                      shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]
                      active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff]
                      focus:outline-dotted focus:outline-1 focus:outline-black focus:outline-offset-[-4px]
                    `}
                  >
                    OK
                  </FleeingButton>
                  <button
                    type="button"
                    className="px-4 py-1 min-w-[75px] bg-[#c0c0c0] text-[11px] text-black shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff]"
                    style={{ fontFamily: WIN95_FONT }}
                  >
                    Cancel
                  </button>
                </div>

                {/* Hidden submit */}
                <button type="submit" className="sr-only">Submit form</button>
              </form>
            </div>

            {/* Status Bar */}
            <div className="bg-[#c0c0c0] px-[2px] py-[2px] flex border-t border-[#ffffff]">
              <div className="flex-1 shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] mr-[2px]">
                <span className="text-[11px] text-black">
                  {isSurrendered ? 'Form surrendered - Click OK to submit' : 'Fill out the form to continue'}
                </span>
              </div>
              <div className="w-[100px] shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] text-center mr-[2px]">
                <span className="text-[11px] text-black">Errors: {stats.validationErrors}</span>
              </div>
              <div className="w-[80px] shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] flex items-center justify-end">
                {/* Resize handle */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line x1="11" y1="2" x2="2" y2="11" stroke="#ffffff" />
                  <line x1="11" y1="3" x2="3" y2="11" stroke="#808080" />
                  <line x1="11" y1="5" x2="5" y2="11" stroke="#ffffff" />
                  <line x1="11" y1="6" x2="6" y2="11" stroke="#808080" />
                  <line x1="11" y1="8" x2="8" y2="11" stroke="#ffffff" />
                  <line x1="11" y1="9" x2="9" y2="11" stroke="#808080" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer - Outside window */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-white" style={{ textShadow: '1px 1px 0 #000' }}>
              Built by{' '}
              <a href="https://github.com/juliocalvorios" target="_blank" rel="noopener noreferrer" className="underline">
                Julio Calvo
              </a>
            </p>
          </div>
        </motion.div>
      ) : (
        /* Terminal Theme */
        <div className="max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className={`text-3xl font-bold mb-2 ${theme.title}`}>
              The Impossible Form
            </h1>
            <p className={theme.subtitle}>
              A form that doesn&apos;t want to be filled out.
              <span className="italic opacity-75"> Good luck.</span>
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit, onError)}
            className={`p-6 ${theme.form}`}
          >
            <div className="flex flex-col gap-6">
              <div>
                <label className={`block text-sm mb-1 ${theme.label}`}>Full Name:</label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Enter your name"
                  className={`mt-1 w-full px-4 py-2 ${theme.input}`}
                />
                {errors.name && <p className={`mt-1 text-xs ${theme.error}`}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={`block text-sm mb-1 ${theme.label}`}>Email:</label>
                <SelfClearingEmailInput
                  value={emailValue || ''}
                  onChange={handleEmailChange}
                  error={errors.email?.message}
                  inputClassName={theme.input}
                  errorClassName={theme.error}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${theme.label}`}>Password:</label>
                <GaslightingPasswordInput
                  value={passwordValue || ''}
                  onChange={handlePasswordChange}
                  currentRequirements={state.currentPasswordRequirements}
                  onRequirementsChange={updatePasswordRequirements}
                  error={errors.password?.message}
                  inputClassName={theme.input}
                  labelClassName={theme.label}
                />
              </div>

              <MovingAgeField
                value={ageValue}
                onChange={handleAgeChange}
                error={errors.age?.message}
                position={agePosition}
                onPositionChange={handleAgePositionChange}
                inputClassName={theme.input}
                labelClassName={theme.label}
                errorClassName={theme.error}
              />

              <SelfUncheckingCheckbox
                checked={termsValue || false}
                onChange={handleTermsChange}
                timeLimit={checkboxTimeLimit}
                onTimeExpired={handleTermsExpired}
                label="I agree to the terms"
                labelClassName={theme.label}
              />

              <div className="hidden" aria-hidden="true">
                <input {...register('honeypot')} type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <FleeingButton
                onClick={() => {}}
                fleeCount={state.buttonFleeCount}
                onFlee={handleButtonFlee}
                surrendered={isSurrendered}
                buttonClassName={theme.button}
              >
                Submit
              </FleeingButton>
            </div>

            <button type="submit" className="sr-only">Submit form</button>
          </motion.form>
        </div>
      )}
    </div>
  )
}

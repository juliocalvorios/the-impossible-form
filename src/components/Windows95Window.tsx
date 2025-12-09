'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Windows95WindowProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  onClose?: () => void
}

export function Windows95Window({
  title,
  children,
  icon,
  className = '',
  onClose,
}: Windows95WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        bg-[#c0c0c0]
        shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]
        ${className}
      `}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-[3px] py-[3px] flex items-center justify-between select-none">
        <div className="flex items-center gap-1">
          {/* Window Icon */}
          {icon || (
            <div className="w-4 h-4 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="14" height="14" fill="#c0c0c0" stroke="#808080" strokeWidth="1"/>
                <rect x="2" y="4" width="12" height="9" fill="white" stroke="#808080" strokeWidth="1"/>
                <rect x="2" y="2" width="12" height="2" fill="#000080"/>
              </svg>
            </div>
          )}
          <span className="text-white text-[11px] font-bold tracking-wide" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex gap-[2px]">
          {/* Minimize */}
          <button
            className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center"
          >
            <div className="w-[6px] h-[2px] bg-black mt-[6px]" />
          </button>
          {/* Maximize */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center"
          >
            <div className="w-[9px] h-[9px] border-[1px] border-black border-t-[2px]" />
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf] active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff] flex items-center justify-center text-black font-bold text-[12px] leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-[2px] flex gap-1">
        <button className="px-2 py-[1px] text-[11px] hover:bg-[#000080] hover:text-white" style={{ fontFamily: 'Tahoma, sans-serif' }}>
          File
        </button>
        <button className="px-2 py-[1px] text-[11px] hover:bg-[#000080] hover:text-white" style={{ fontFamily: 'Tahoma, sans-serif' }}>
          Edit
        </button>
        <button className="px-2 py-[1px] text-[11px] hover:bg-[#000080] hover:text-white" style={{ fontFamily: 'Tahoma, sans-serif' }}>
          View
        </button>
        <button className="px-2 py-[1px] text-[11px] hover:bg-[#000080] hover:text-white" style={{ fontFamily: 'Tahoma, sans-serif' }}>
          Help
        </button>
      </div>

      {/* Content */}
      <div className="p-2">
        {children}
      </div>

      {/* Status Bar */}
      <div className="bg-[#c0c0c0] border-t border-[#ffffff] px-2 py-1 flex justify-between">
        <div className="shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] flex-1 mr-1">
          <span className="text-[11px] text-black" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            Ready
          </span>
        </div>
        <div className="shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#808080] px-2 py-[1px] w-20 text-center">
          <span className="text-[11px] text-black" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            v1.0
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Windows 95 Button component
export function Win95Button({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-1 min-w-[75px]
        bg-[#c0c0c0]
        text-[11px] text-black font-normal
        shadow-[inset_-1px_-1px_0_0_#0a0a0a,inset_1px_1px_0_0_#ffffff,inset_-2px_-2px_0_0_#808080,inset_2px_2px_0_0_#dfdfdf]
        active:shadow-[inset_1px_1px_0_0_#0a0a0a,inset_-1px_-1px_0_0_#ffffff,inset_2px_2px_0_0_#808080,inset_-2px_-2px_0_0_#dfdfdf]
        active:pt-[5px] active:pb-[3px]
        disabled:text-[#808080] disabled:cursor-not-allowed
        focus:outline-dotted focus:outline-1 focus:outline-black focus:outline-offset-[-4px]
        ${className}
      `}
      style={{ fontFamily: 'Tahoma, sans-serif' }}
    >
      {children}
    </button>
  )
}

// Windows 95 Input component
export function Win95Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={`
        w-full px-1 py-[2px]
        bg-white
        text-[11px] text-black
        shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#0a0a0a,inset_-2px_-2px_0_0_#dfdfdf,inset_2px_2px_0_0_#808080]
        focus:outline-none
        ${className}
      `}
      style={{ fontFamily: 'Tahoma, sans-serif' }}
    />
  )
}

// Windows 95 Checkbox component
export function Win95Checkbox({
  checked,
  onChange,
  label,
  className = '',
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <div
        onClick={() => onChange(!checked)}
        className="w-[13px] h-[13px] bg-white shadow-[inset_-1px_-1px_0_0_#ffffff,inset_1px_1px_0_0_#0a0a0a,inset_-2px_-2px_0_0_#dfdfdf,inset_2px_2px_0_0_#808080] flex items-center justify-center"
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1 4L3.5 7L8 1" stroke="black" strokeWidth="1.5" />
          </svg>
        )}
      </div>
      <span className="text-[11px] text-black" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        {label}
      </span>
    </label>
  )
}

// Windows 95 Group Box
export function Win95GroupBox({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <fieldset
      className={`
        border-t border-l border-[#808080]
        shadow-[1px_1px_0_0_#ffffff]
        px-3 pb-3 pt-1
        ${className}
      `}
    >
      <legend className="px-1 text-[11px] text-black" style={{ fontFamily: 'Tahoma, sans-serif' }}>
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

// Windows 95 Label
export function Win95Label({
  children,
  htmlFor,
  className = '',
}: {
  children: React.ReactNode
  htmlFor?: string
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-[11px] text-black block mb-1 ${className}`}
      style={{ fontFamily: 'Tahoma, sans-serif' }}
    >
      {children}
    </label>
  )
}

export default Windows95Window

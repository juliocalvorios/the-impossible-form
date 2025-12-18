'use client'

import { motion } from 'framer-motion'

export type ThemeId = 'retro' | 'terminal'

// Theme styles that will be applied to the actual form
export const themeStyles: Record<ThemeId, {
  container: string
  form: string
  input: string
  label: string
  button: string
  title: string
  subtitle: string
  error: string
  extra?: React.ReactNode
}> = {
  retro: {
    container: 'bg-[#008080]',
    form: 'bg-[#c0c0c0] rounded-none shadow-[2px_2px_0_#000,inset_-1px_-1px_0_#808080,inset_1px_1px_0_#fff]',
    input: 'bg-white rounded-none shadow-[inset_-1px_-1px_0_#fff,inset_1px_1px_0_#808080,inset_-2px_-2px_0_#c0c0c0,inset_2px_2px_0_#000] border-none',
    label: 'text-black font-bold',
    button: 'bg-[#c0c0c0] text-black rounded-none shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#fff,-1px_-1px_0_#000,1px_1px_0_#fff] font-bold active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#fff]',
    title: 'text-[#000080]',
    subtitle: 'text-black',
    error: 'text-red-700',
  },
  terminal: {
    container: 'bg-black',
    form: 'bg-black/80 rounded-none border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)] font-mono',
    input: 'bg-green-950/50 border border-green-500/30 rounded-none text-green-400 placeholder:text-green-700 focus:ring-green-500/50 focus:border-green-500 font-mono',
    label: 'text-green-400 font-mono',
    button: 'bg-transparent border border-green-500 text-green-500 rounded-none hover:bg-green-500/20 font-mono',
    title: 'text-green-500 font-mono',
    subtitle: 'text-green-600 font-mono',
    error: 'text-red-500 font-mono',
    extra: (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-10 text-green-500 text-xs font-mono leading-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap" style={{ animationDelay: `${i * 0.1}s` }}>
              {'10'.repeat(100)}
            </div>
          ))}
        </div>
      </div>
    ),
  },
}

// Empty theme button (hidden since we only have one theme now)
export function ThemeToggleButton({ onClick }: { onClick: () => void }) {
  return null
}

// Empty modal (no longer needed)
export function ThemePreviewModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: {
  isOpen: boolean
  onClose: () => void
  currentTheme: ThemeId
  onSelectTheme: (theme: ThemeId) => void
}) {
  return null
}

export default ThemePreviewModal

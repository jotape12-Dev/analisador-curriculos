'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const messages = [
  'Lendo seu currículo...',
  'Identificando habilidades...',
  'Comparando com a vaga...',
  'Analisando compatibilidade ATS...',
  'Gerando recomendações...',
  'Quase lá...',
]

export function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isVisible])

  if (!isVisible) return null

  const isDark = mounted ? resolvedTheme === 'dark' : false

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center gap-6
        backdrop-blur-sm transition-opacity duration-300
        ${isDark ? 'bg-black/60 text-white' : 'bg-white/60 text-gray-800'}
      `}
    >
      <svg
        className="animate-spin h-16 w-16"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle
          cx="32" cy="32" r="28"
          stroke="currentColor"
          strokeWidth="6"
          className="opacity-20"
        />
        <path
          d="M32 4 a28 28 0 0 1 28 28"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>
      <p className="text-lg font-medium tracking-wide animate-pulse">
        {messages[messageIndex]}
      </p>
    </div>
  )
}

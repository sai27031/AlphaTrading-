'use client'
import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  index: {
    name: string
    value: number
    change: number
    changePct: number
  }
}

export function IndexCard({ index }: Props) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prev = useRef(index.value)

  useEffect(() => {
    if (index.value !== prev.current) {
      setFlash(index.value > prev.current ? 'up' : 'down')
      prev.current = index.value
      const t = setTimeout(() => setFlash(null), 700)
      return () => clearTimeout(t)
    }
  }, [index.value])

  const up = index.changePct >= 0

  return (
    <div className={`card ${flash ? `flash-${flash}` : ''}`} style={{ padding: '14px 16px' }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
        {index.name}
      </p>
      <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', marginBottom: 4 }}>
        {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color: up ? 'var(--up)' : 'var(--down)', display: 'flex', alignItems: 'center', gap: 3 }}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {up ? '+' : ''}{index.changePct.toFixed(2)}%
      </p>
    </div>
  )
}
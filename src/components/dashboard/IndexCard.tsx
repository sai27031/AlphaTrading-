'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Index } from '@/types'
import { formatPrice, formatChangePct, getPriceColor, cn } from '@/lib/utils'
import Link from 'next/link'

interface IndexCardProps {
  index: Index
}

export function IndexCard({ index }: IndexCardProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevValue = useRef(index.value)

  useEffect(() => {
    if (index.value !== prevValue.current) {
      setFlash(index.value > prevValue.current ? 'up' : 'down')
      prevValue.current = index.value
      const t = setTimeout(() => setFlash(null), 600)
      return () => clearTimeout(t)
    }
  }, [index.value])

  const isVIX = index.name.includes('VIX')
  const up = index.changePct >= 0
  const symbol = encodeURIComponent(index.symbol)

  return (
    <Link href={`/charts?symbol=${symbol}`}>
      <div
        className={cn(
          'card card-hover p-3 cursor-pointer transition-all',
          flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
        )}
      >
        <p className="text-xs font-500 truncate" style={{ color: 'var(--text-muted)' }}>
          {index.name}
        </p>

        <p className="font-display text-base font-700 mt-1.5 tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {formatPrice(index.value)}
        </p>

        <div className={`flex items-center gap-1 mt-1 text-xs font-500 ${getPriceColor(isVIX ? -index.changePct : index.changePct)}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          <span>{formatChangePct(index.changePct)}</span>
          <span className="font-400" style={{ color: 'var(--text-muted)' }}>
            ({index.change > 0 ? '+' : ''}{formatPrice(index.change)})
          </span>
        </div>
      </div>
    </Link>
  )
}
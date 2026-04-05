'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatChangePct, getPriceColor } from '@/lib/utils'

const MOCK_TICKERS = [
  { symbol: 'NIFTY 50', ltp: 22150.45, change: 1.21 },
  { symbol: 'SENSEX', ltp: 73128.77, change: 0.87 },
  { symbol: 'BANK NIFTY', ltp: 47823.10, change: -0.32 },
  { symbol: 'RELIANCE', ltp: 2943.50, change: 1.45 },
  { symbol: 'TCS', ltp: 3812.30, change: 0.62 },
  { symbol: 'HDFC BANK', ltp: 1567.85, change: -0.91 },
  { symbol: 'INFY', ltp: 1423.60, change: 2.14 },
  { symbol: 'WIPRO', ltp: 462.30, change: 1.87 },
  { symbol: 'BAJFINANCE', ltp: 7234.90, change: -1.23 },
  { symbol: 'ICICIBANK', ltp: 1078.45, change: 0.54 },
  { symbol: 'TATAMOTORS', ltp: 812.60, change: 3.21 },
  { symbol: 'SUNPHARMA', ltp: 1587.30, change: 1.92 },
]

export function TickerTape() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        height: 36,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
      }} />
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        height: 36,
        fontSize: 12,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* LIVE badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 12px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        height: '100%',
      }}>
        <span className="live-dot" />
        <span style={{ color: 'var(--up)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: 'ticker 60s linear infinite',
        }}>
          {[...MOCK_TICKERS, ...MOCK_TICKERS].map((ticker, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 16px',
                borderRight: '1px solid var(--border)',
                height: 36,
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ticker.symbol}</span>
              <span style={{ color: 'var(--text-secondary)' }}>₹{formatPrice(ticker.ltp)}</span>
              <span style={{
                color: ticker.change >= 0 ? 'var(--up)' : 'var(--down)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontWeight: 500,
              }}>
                {ticker.change >= 0
                  ? <TrendingUp size={10} />
                  : <TrendingDown size={10} />
                }
                {formatChangePct(ticker.change)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

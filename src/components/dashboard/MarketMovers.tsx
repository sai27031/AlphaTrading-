'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Stock {
  symbol: string
  ltp: number
  changePct: number
  change: number
}

const FALLBACK_GAINERS = [
  { symbol: 'TATAMOTORS', changePct: 3.21, ltp: 812.60, change: 25.3 },
  { symbol: 'INFY', changePct: 2.14, ltp: 1423.60, change: 29.8 },
  { symbol: 'WIPRO', changePct: 1.87, ltp: 462.30, change: 8.5 },
  { symbol: 'RELIANCE', changePct: 1.45, ltp: 2943.50, change: 42.1 },
  { symbol: 'SBIN', changePct: 1.55, ltp: 812.30, change: 12.4 },
]

const FALLBACK_LOSERS = [
  { symbol: 'BAJFINANCE', changePct: -1.23, ltp: 7234.90, change: -90.1 },
  { symbol: 'HDFCBANK', changePct: -0.91, ltp: 1567.85, change: -14.4 },
  { symbol: 'KOTAKBANK', changePct: -0.59, ltp: 1923.60, change: -11.4 },
  { symbol: 'ADANIPORTS', changePct: -0.78, ltp: 1234.50, change: -9.7 },
  { symbol: 'BHARTIARTL', changePct: -0.49, ltp: 1678.90, change: -8.3 },
]

const INDEX_NAMES = [
  'NIFTY 50', 'SENSEX', 'NIFTY BANK', 'NIFTY IT',
  'NIFTY MIDCAP 100', 'INDIA VIX', 'Nifty Fin Service', 'NIFTY MID SELECT'
]

export function MarketMovers() {
  const [gainers, setGainers] = useState<Stock[]>(FALLBACK_GAINERS)
  const [losers, setLosers] = useState<Stock[]>(FALLBACK_LOSERS)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    fetchMovers()
    const interval = setInterval(fetchMovers, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchMovers = async () => {
    try {
      const res = await fetch('/api/market')
      const data = await res.json()

      if (data.authenticated && data.indices?.length > 0) {
        const stocks = data.indices
          .filter((s: any) => !INDEX_NAMES.includes(s.name))
          .map((s: any) => ({
            symbol: s.name,
            ltp: s.value || 0,
            changePct: s.changePct || 0,
            change: s.change || 0,
          }))

        if (stocks.length > 0) {
          const sorted = [...stocks].sort((a, b) => b.changePct - a.changePct)
          setGainers(sorted.filter(s => s.changePct >= 0).slice(0, 5))
          setLosers([...sorted].reverse().filter(s => s.changePct < 0).slice(0, 5))
          setIsLive(true)
        }
      }
    } catch (err) {
      console.error('MarketMovers error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Gainers */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={15} color="var(--up)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Top Gainers</span>
          {isLive && <span style={{ fontSize: 10, color: 'var(--up)', marginLeft: 'auto' }}>● Live</span>}
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Symbol</th><th>LTP</th><th>Change</th></tr>
          </thead>
          <tbody>
            {gainers.map(s => (
              <tr key={s.symbol}>
                <td style={{ fontWeight: 600, fontSize: 12 }}>{s.symbol}</td>
                <td style={{ fontSize: 12 }}>₹{(s.ltp || 0).toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--up)', fontWeight: 600, fontSize: 12 }}>
                  +{s.changePct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Losers */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={15} color="var(--down)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Top Losers</span>
          {isLive && <span style={{ fontSize: 10, color: 'var(--down)', marginLeft: 'auto' }}>● Live</span>}
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Symbol</th><th>LTP</th><th>Change</th></tr>
          </thead>
          <tbody>
            {losers.map(s => (
              <tr key={s.symbol}>
                <td style={{ fontWeight: 600, fontSize: 12 }}>{s.symbol}</td>
                <td style={{ fontSize: 12 }}>₹{(s.ltp || 0).toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--down)', fontWeight: 600, fontSize: 12 }}>
                  {s.changePct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
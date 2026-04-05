'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { formatPrice, formatChangePct, formatVolume, getPriceColor } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'
import { Bot } from 'lucide-react'
import Link from 'next/link'

const MOCK_GAINERS = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors', ltp: 812.60, changePct: 3.21, change: 25.30, volume: 12456789, sector: 'Auto' },
  { symbol: 'INFY', name: 'Infosys', ltp: 1423.60, changePct: 2.14, change: 29.85, volume: 8923456, sector: 'IT' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', ltp: 1587.30, changePct: 1.92, change: 29.90, volume: 3456789, sector: 'Pharma' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2943.50, changePct: 1.45, change: 41.95, volume: 9876543, sector: 'Energy' },
  { symbol: 'WIPRO', name: 'Wipro', ltp: 462.30, changePct: 1.87, change: 8.50, volume: 6543210, sector: 'IT' },
  { symbol: 'MRF' , name: 'MRF',ltp:99000.76, changePct:2.2,change: 6.5, volume:738211,sector:'Automobile'},
]

const MOCK_LOSERS = [
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', ltp: 7234.90, changePct: -1.23, change: -90.10, volume: 2345678, sector: 'Finance' },
  { symbol: 'HDFC BANK', name: 'HDFC Bank', ltp: 1567.85, changePct: -0.91, change: -14.40, volume: 15678900, sector: 'Banking' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', ltp: 1234.50, changePct: -0.78, change: -9.70, volume: 4567890, sector: 'Infra' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life', ltp: 623.75, changePct: -0.44, change: -2.75, volume: 2134567, sector: 'Insurance' },
  { symbol: 'ONGC', name: 'ONGC', ltp: 267.45, changePct: -0.34, change: -0.92, volume: 7890123, sector: 'Energy' },
  { symbol: 'MRF' , name: 'MRF',ltp:99000.76, changePct:2.2,change: 6.5, volume:738211,sector:'Automobile'},
]

const MOCK_ACTIVE = [
  { symbol: 'HDFC BANK', name: 'HDFC Bank', ltp: 1567.85, changePct: -0.91, change: -14.40, volume: 15678900, sector: 'Banking' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 2943.50, changePct: 1.45, change: 41.95, volume: 9876543, sector: 'Energy' },
  { symbol: 'INFY', name: 'Infosys', ltp: 1423.60, changePct: 2.14, change: 29.85, volume: 8923456, sector: 'IT' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', ltp: 812.60, changePct: 3.21, change: 25.30, volume: 12456789, sector: 'Auto' },
  { symbol: 'WIPRO', name: 'Wipro', ltp: 462.30, changePct: 1.87, change: 8.50, volume: 6543210, sector: 'IT' },
  { symbol: 'MRF' , name: 'MRF',ltp:99000.76, changePct:2.2,change: 6.5, volume:738211,sector:'Automobile'},
]

type Tab = 'gainers' | 'losers' | 'active'

export function MarketMovers() {
  const [tab, setTab] = useState<Tab>('gainers')
  const { openBot } = useAIBotStore()

  const data = tab === 'gainers' ? MOCK_GAINERS : tab === 'losers' ? MOCK_LOSERS : MOCK_ACTIVE

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Activity size={16} style={{ color: 'var(--brand)' }} />
          <h3 className="font-500 text-sm" style={{ color: 'var(--text-primary)' }}>Market Movers</h3>
        </div>
        <div className="flex items-center gap-1" style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 3 }}>
          {(['gainers', 'losers', 'active'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 rounded-md text-xs font-500 transition-all capitalize"
              style={{
                background: tab === t ? 'var(--brand)' : 'transparent',
                color: tab === t ? '#000' : 'var(--text-muted)',
              }}
            >
              {t === 'gainers' ? '▲ Gainers' : t === 'losers' ? '▼ Losers' : '⚡ Active'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th className="text-right">LTP</th>
              <th className="text-right">Change</th>
              <th className="text-right">Volume</th>
              <th className="text-right">Sector</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock) => (
              <tr key={stock.symbol} className="group">
                <td>
                  <Link href={`/charts?symbol=${stock.symbol}`} className="flex items-center gap-2.5 hover:text-brand-500">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-700 flex-shrink-0"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--brand)' }}
                    >
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-500 text-sm" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</p>
                      <p className="text-xs truncate max-w-[140px]" style={{ color: 'var(--text-muted)' }}>{stock.name}</p>
                    </div>
                  </Link>
                </td>
                <td className="text-right font-500 tabular-nums text-sm" style={{ color: 'var(--text-primary)' }}>
                  ₹{formatPrice(stock.ltp)}
                </td>
                <td className="text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-500 ${stock.changePct >= 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
                    {stock.changePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatChangePct(stock.changePct)}
                  </div>
                </td>
                <td className="text-right text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {formatVolume(stock.volume)}
                </td>
                <td className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    {stock.sector}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => openBot(`Analyse ${stock.symbol} — should I invest? Current price ₹${stock.ltp}, change ${formatChangePct(stock.changePct)}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                    style={{ color: 'var(--brand)' }}
                    title="AI Analysis"
                  >
                    <Bot size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
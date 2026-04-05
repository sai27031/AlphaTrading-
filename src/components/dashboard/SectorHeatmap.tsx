'use client'

import { useState } from 'react'
import { Grid, Bot } from 'lucide-react'
import { useAIBotStore } from '@/lib/store'

const SECTORS = [
  { name: 'Banking', change: 1.24, marketCap: 28.5, stocks: 12 },
  { name: 'IT', change: 2.16, marketCap: 22.1, stocks: 8 },
  { name: 'Energy', change: -0.45, marketCap: 19.8, stocks: 6 },
  { name: 'Auto', change: 3.21, marketCap: 14.2, stocks: 10 },
  { name: 'Pharma', change: 1.87, marketCap: 12.7, stocks: 15 },
  { name: 'FMCG', change: -1.23, marketCap: 11.4, stocks: 9 },
  { name: 'Metals', change: -0.89, marketCap: 9.8, stocks: 7 },
  { name: 'Realty', change: 2.45, marketCap: 7.2, stocks: 11 },
  { name: 'Media', change: -0.34, marketCap: 3.1, stocks: 5 },
  { name: 'Infra', change: 0.67, marketCap: 8.4, stocks: 8 },
  { name: 'Insurance', change: -0.52, marketCap: 6.9, stocks: 6 },
  { name: 'Chemicals', change: 1.05, marketCap: 5.3, stocks: 13 },
]

function getHeatColor(change: number): { bg: string; text: string } {
  if (change >= 3) return { bg: 'rgba(0,193,118,0.4)', text: '#00c176' }
  if (change >= 1.5) return { bg: 'rgba(0,193,118,0.25)', text: '#00c176' }
  if (change >= 0.5) return { bg: 'rgba(0,193,118,0.12)', text: '#00c176' }
  if (change >= 0) return { bg: 'rgba(0,193,118,0.06)', text: 'var(--text-muted)' }
  if (change >= -0.5) return { bg: 'rgba(239,68,68,0.06)', text: 'var(--text-muted)' }
  if (change >= -1.5) return { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' }
  if (change >= -3) return { bg: 'rgba(239,68,68,0.25)', text: '#ef4444' }
  return { bg: 'rgba(239,68,68,0.4)', text: '#ef4444' }
}

export function SectorHeatmap() {
  const { openBot } = useAIBotStore()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="card">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Grid size={16} style={{ color: 'var(--brand)' }} />
          <h3 className="font-500 text-sm" style={{ color: 'var(--text-primary)' }}>Sector Heatmap</h3>
        </div>
        <button
          onClick={() => openBot('Analyse sector performance today. Which sectors are outperforming and which are underperforming? What does this mean for investors?')}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(0,196,126,0.1)', color: 'var(--brand)', border: '1px solid rgba(0,196,126,0.2)' }}
        >
          <Bot size={12} />
          AI Sector Analysis
        </button>
      </div>

      <div className="p-4 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
        {SECTORS.sort((a, b) => b.marketCap - a.marketCap).map((sector) => {
          const colors = getHeatColor(sector.change)
          return (
            <div
              key={sector.name}
              className="rounded-lg p-3 cursor-pointer transition-all hover:scale-105"
              style={{
                background: colors.bg,
                border: hovered === sector.name ? `1px solid ${colors.text}` : '1px solid transparent',
                minHeight: 70,
              }}
              onMouseEnter={() => setHovered(sector.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => openBot(`Tell me about the ${sector.name} sector performance today. Which stocks are driving the move?`)}
            >
              <p className="text-xs font-500 truncate" style={{ color: 'var(--text-primary)' }}>
                {sector.name}
              </p>
              <p className="text-sm font-700 mt-1 font-display" style={{ color: colors.text }}>
                {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {sector.stocks} stocks
              </p>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>Bearish</span>
        {['-3%', '-1.5%', '-0.5%', '0%', '+0.5%', '+1.5%', '+3%'].map((label, i) => {
          const changes = [-4, -2, -1, 0, 1, 2, 4]
          const { bg } = getHeatColor(changes[i])
          return (
            <div
              key={label}
              className="w-6 h-4 rounded"
              style={{ background: bg, border: '1px solid var(--border)' }}
              title={label}
            />
          )
        })}
        <span>Bullish</span>
      </div>
    </div>
  )
}
'use client'
import { useEffect, useState } from 'react'

const MOCK_SECTORS = [
  { name: 'Banking', change: 1.24 },
  { name: 'IT', change: 2.16 },
  { name: 'Energy', change: -0.45 },
  { name: 'Auto', change: 3.21 },
  { name: 'Pharma', change: 1.87 },
  { name: 'FMCG', change: -1.23 },
  { name: 'Metals', change: -0.89 },
  { name: 'Realty', change: 2.45 },
  { name: 'Infra', change: 0.67 },
  { name: 'Telecom', change: -0.49 },
  { name: 'Insurance', change: -0.52 },
  { name: 'Chemicals', change: 1.05 },
]

const SECTOR_TOKEN_MAP: Record<string, string> = {
  'Nifty Fin Service': 'Banking',
  'NIFTY BANK': 'Banking',
  'NIFTY IT': 'IT',
  'NIFTY MID SELECT': 'Midcap',
  'NIFTY 50': 'Largecap',
  'NIFTY MIDCAP 100': 'Midcap',
}

const getBg = (c: number) => {
  if (c >= 2) return 'rgba(22,163,74,.35)'
  if (c >= 1) return 'rgba(22,163,74,.2)'
  if (c > 0) return 'rgba(22,163,74,.1)'
  if (c > -1) return 'rgba(220,38,38,.1)'
  if (c > -2) return 'rgba(220,38,38,.2)'
  return 'rgba(220,38,38,.35)'
}

export function SectorHeatmap() {
  const [sectors, setSectors] = useState(MOCK_SECTORS)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    fetchSectors()
    const interval = setInterval(fetchSectors, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchSectors = async () => {
    try {
      const res = await fetch('/api/market')
      const data = await res.json()
      if (data.authenticated && data.indices?.length > 0) {
        const liveSectors = data.indices
          .filter((idx: any) => SECTOR_TOKEN_MAP[idx.name])
          .map((idx: any) => ({
            name: SECTOR_TOKEN_MAP[idx.name],
            change: idx.changePct,
          }))

        if (liveSectors.length > 0) {
          const merged = MOCK_SECTORS.map(mock => {
            const live = liveSectors.find((l: any) => l.name === mock.name)
            return live || mock
          })
          setSectors(merged)
          setIsLive(true)
        }
      }
    } catch (e) {}
  }

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)' }}>
          Sector Heatmap
        </p>
        {isLive && <span style={{ fontSize: 10, color: 'var(--up)' }}>● Live</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
        {sectors.map(s => (
          <div key={s.name} style={{ padding: '10px 12px', borderRadius: 9, background: getBg(s.change), cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{s.name}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.change >= 0 ? 'var(--up)' : 'var(--down)' }}>
              {s.change >= 0 ? '+' : ''}{s.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
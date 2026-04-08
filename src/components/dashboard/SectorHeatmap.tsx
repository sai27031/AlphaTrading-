'use client'

const SECTORS = [
  { name: 'Banking',   change: 1.24  },
  { name: 'IT',        change: 2.16  },
  { name: 'Energy',    change: -0.45 },
  { name: 'Auto',      change: 3.21  },
  { name: 'Pharma',    change: 1.87  },
  { name: 'FMCG',      change: -1.23 },
  { name: 'Metals',    change: -0.89 },
  { name: 'Realty',    change: 2.45  },
  { name: 'Infra',     change: 0.67  },
  { name: 'Telecom',   change: -0.49 },
  { name: 'Insurance', change: -0.52 },
  { name: 'Chemicals', change: 1.05  },
]

const getBg = (c: number) => {
  if (c >= 2)  return 'rgba(22,163,74,.35)'
  if (c >= 1)  return 'rgba(22,163,74,.2)'
  if (c > 0)   return 'rgba(22,163,74,.1)'
  if (c > -1)  return 'rgba(220,38,38,.1)'
  if (c > -2)  return 'rgba(220,38,38,.2)'
  return 'rgba(220,38,38,.35)'
}

export function SectorHeatmap() {
  return (
    <div className="card" style={{ padding: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
        Sector Heatmap
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
        {SECTORS.map(s => (
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
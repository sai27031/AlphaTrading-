'use client'
import { TrendingUp, TrendingDown } from 'lucide-react'

const GAINERS = [
  { symbol: 'TATAMOTORS', changePct: 3.21,  ltp: 812.60   },
  { symbol: 'INFY',       changePct: 2.14,  ltp: 1423.60  },
  { symbol: 'WIPRO',      changePct: 1.87,  ltp: 462.30   },
  { symbol: 'RELIANCE',   changePct: 1.45,  ltp: 2943.50  },
  { symbol: 'SBIN',       changePct: 1.55,  ltp: 812.30   },
]

const LOSERS = [
  { symbol: 'BAJFINANCE', changePct: -1.23, ltp: 7234.90  },
  { symbol: 'HDFCBANK',   changePct: -0.91, ltp: 1567.85  },
  { symbol: 'KOTAKBANK',  changePct: -0.59, ltp: 1923.60  },
  { symbol: 'ADANIPORTS', changePct: -0.78, ltp: 1234.50  },
  { symbol: 'BHARTIARTL', changePct: -0.49, ltp: 1678.90  },
]

export function MarketMovers() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Gainers */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={15} color="var(--up)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Top Gainers</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Symbol</th><th>LTP</th><th>Change</th></tr>
          </thead>
          <tbody>
            {GAINERS.map(s => (
              <tr key={s.symbol}>
                <td style={{ fontWeight: 600, fontSize: 12 }}>{s.symbol}</td>
                <td style={{ fontSize: 12 }}>₹{s.ltp.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--up)', fontWeight: 600, fontSize: 12 }}>+{s.changePct}%</td>
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
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Symbol</th><th>LTP</th><th>Change</th></tr>
          </thead>
          <tbody>
            {LOSERS.map(s => (
              <tr key={s.symbol}>
                <td style={{ fontWeight: 600, fontSize: 12 }}>{s.symbol}</td>
                <td style={{ fontSize: 12 }}>₹{s.ltp.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--down)', fontWeight: 600, fontSize: 12 }}>{s.changePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
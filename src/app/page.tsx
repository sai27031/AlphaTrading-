'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { IndexCard } from '@/components/dashboard/IndexCard'
import { MarketMovers } from '@/components/dashboard/MarketMovers'
import { SectorHeatmap } from '@/components/dashboard/SectorHeatmap'
import { useMarketStore, useAIBotStore } from '@/lib/store'
import { getMarketStatus } from '@/lib/utils'
import { Bot, Activity, ArrowRight, RefreshCw, LogIn, CheckCircle, AlertCircle, X, Key } from 'lucide-react'

const MOCK_INDICES = [
  { name: 'NIFTY 50',      symbol: '99926000', value: 23114.50, change: 265.20,  changePct: 1.21,  open: 22950.30, high: 23210.80, low: 22940.15, prevClose: 22849.30, timestamp: Date.now() },
  { name: 'SENSEX',        symbol: '999944',   value: 76456.89, change: 632.50,  changePct: 0.87,  open: 75900.00, high: 76600.20, low: 75890.10, prevClose: 75824.39, timestamp: Date.now() },
  { name: 'NIFTY BANK',    symbol: '99926009', value: 53427.05, change: -154.40, changePct: -0.32, open: 53600.00, high: 53720.50, low: 53380.30, prevClose: 53581.45, timestamp: Date.now() },
  { name: 'NIFTY IT',      symbol: '99926037', value: 38456.75, change: 812.30,  changePct: 2.16,  open: 37800.00, high: 38520.40, low: 37790.20, prevClose: 37644.45, timestamp: Date.now() },
  { name: 'NIFTY MIDCAP',  symbol: '99926074', value: 49234.60, change: 345.70,  changePct: 0.71,  open: 48900.00, high: 49400.00, low: 48880.00, prevClose: 48888.90, timestamp: Date.now() },
  { name: 'INDIA VIX',     symbol: '99919000', value: 14.23,    change: -0.82,   changePct: -5.43, open: 15.10,    high: 15.20,    low: 14.10,    prevClose: 15.05,    timestamp: Date.now() },
]

const QUICK_STATS = [
  { label: 'Advances',  value: '1,842', color: 'var(--up)' },
  { label: 'Declines',  value: '986',   color: 'var(--down)' },
  { label: 'Unchanged', value: '134',   color: 'var(--text-muted)' },
  { label: '52W Highs', value: '48',    color: 'var(--text-primary)' },
]

export default function DashboardPage() {
  const { indices, setIndices } = useMarketStore()
  const { openBot } = useAIBotStore()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [needsTotp, setNeedsTotp] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)
  const [totp, setTotp] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [justConnected, setJustConnected] = useState(false)
  const [error, setError] = useState('')
  const [marketStatus] = useState(getMarketStatus())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMarketData = useCallback(async (totpCode?: string) => {
    try {
      const url = totpCode ? `/api/market?totp=${totpCode}` : '/api/market'
      const res = await fetch(url)
      const data = await res.json()

      if (data.authenticated && data.indices?.length > 0) {
        setAuthenticated(true)
        setNeedsTotp(false)
        setTokenExpired(false)
        setError('')
        setIndices(data.indices)
        setLastUpdated(new Date())
        if (totpCode) {
          setJustConnected(true)
          setTimeout(() => setJustConnected(false), 5000)
        }
      } else if (data.needsTotp) {
        setAuthenticated(false)
        setNeedsTotp(true)
        setTokenExpired(data.tokenExpired || false)
        setIndices(MOCK_INDICES)
      } else {
        setAuthenticated(false)
        setIndices(MOCK_INDICES)
        if (data.error) setError(data.error)
      }
    } catch (err) {
      setIndices(MOCK_INDICES)
    } finally {
      setLoading(false)
      setConnecting(false)
    }
  }, [setIndices])

  // Initial fetch + auto-refresh every 10s when authenticated
  useEffect(() => {
    fetchMarketData()
  }, [])

  useEffect(() => {
    if (authenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => fetchMarketData(), 10000)
      return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }
  }, [authenticated, fetchMarketData])

  const handleConnect = async () => {
    if (!totp || totp.length !== 6) {
      setError('Please enter the 6-digit TOTP code from Google Authenticator')
      return
    }
    setConnecting(true)
    setError('')
    await fetchMarketData(totp)
    setTotp('')
  }

  const displayIndices = indices.length > 0 ? indices : MOCK_INDICES

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Market Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>NSE · BSE</span>
            {authenticated ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(22,163,74,0.1)', color: 'var(--up)', border: '1px solid rgba(22,163,74,0.2)', fontWeight: 600 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--up)', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
                Live · Angel One
              </span>
            ) : (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>Demo data</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!authenticated && (
            <button onClick={() => setNeedsTotp(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
              <LogIn size={14} /> Connect Live Data
            </button>
          )}
          {authenticated && lastUpdated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
              <RefreshCw size={10} />
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
          <button onClick={() => openBot('Summarise today\'s Indian stock market. Key trends, movers and what investors should watch.')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <Bot size={14} /> AI Summary
          </button>
        </div>
      </div>

      {/* TOTP Connect Panel */}
      {(needsTotp || !authenticated) && !loading && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Key size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                {tokenExpired ? 'Session expired — reconnect Angel One' : 'Connect Angel One for live prices'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                Open Google Authenticator on your phone and enter the 6-digit code for Angel One
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={totp}
                  onChange={e => { setTotp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleConnect()}
                  placeholder="Enter 6-digit TOTP"
                  maxLength={6}
                  style={{ width: 180, padding: '9px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 18, letterSpacing: '0.4em', textAlign: 'center', outline: 'none', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                  autoFocus
                />
                <button
                  onClick={handleConnect}
                  disabled={connecting || totp.length !== 6}
                  style={{ padding: '9px 20px', borderRadius: 9, background: totp.length === 6 ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: totp.length === 6 ? 'var(--bg-primary)' : 'var(--text-muted)', border: 'none', cursor: totp.length === 6 ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}>
                  {connecting ? 'Connecting...' : 'Connect'}
                </button>
                <button onClick={() => setNeedsTotp(false)} style={{ padding: '9px', borderRadius: 9, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>
              {error && <p style={{ fontSize: 12, color: 'var(--down)', marginTop: 8 }}>⚠ {error}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {justConnected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <CheckCircle size={16} style={{ color: 'var(--up)', flexShrink: 0 }} />
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Angel One connected! Live prices updating every 10 seconds.</p>
        </div>
      )}

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {QUICK_STATS.map(stat => (
          <div key={stat.label} className="card" style={{ padding: '13px 16px' }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>{stat.label}</p>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Indices */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Indices</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <Activity size={11} />
            <span>{authenticated ? 'Updates every 10s' : 'Demo mode — connect for live data'}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {displayIndices.map(idx => <IndexCard key={idx.symbol} index={idx} />)}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <MarketMovers />
          <SectorHeatmap />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Market Breadth</p>
            {[['Advances', '1842', 'var(--up)'], ['Declines', '986', 'var(--down)'], ['Unchanged', '134', 'var(--text-muted)']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: 'Space Grotesk, sans-serif' }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>Market Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: marketStatus.open ? 'var(--up)' : 'var(--down)', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: marketStatus.open ? 'var(--up)' : 'var(--down)' }}>{marketStatus.label}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{marketStatus.nextEvent}</p>
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <div
        className="card"
        onClick={() => openBot('What are the key market trends today? Give me a complete analysis of NSE and BSE.')}
        style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--text-primary)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} style={{ color: 'var(--bg-primary)' }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--bg-primary)' }}>Ask AI about today's market</p>
            <p style={{ fontSize: 12, color: 'var(--bg-primary)', opacity: 0.55, marginTop: 1 }}>Analyse trends · predict moves · find opportunities</p>
          </div>
        </div>
        <ArrowRight size={18} style={{ color: 'var(--bg-primary)', opacity: 0.5 }} />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Bell, X, LogIn } from 'lucide-react'
import { useMarketStore } from '@/lib/store'
import { getMarketStatus, formatPrice, formatChangePct, getPriceColor } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; symbol: string; exchange: string; ltp?: number; change?: number }[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [marketStatus, setMarketStatus] = useState({ open: false, label: 'Loading...', nextEvent: '' })
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setMarketStatus(getMarketStatus())
    const timer = setInterval(() => setMarketStatus(getMarketStatus()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch { setResults([]) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <header style={{
      background: 'var(--header-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 30,
      height: 56,
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
    }}>

      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search stocks, indices... (e.g. RELIANCE, NIFTY)"
            className="input"
            style={{ paddingLeft: 36, paddingRight: 36, height: 36, fontSize: 13 }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }} style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {searchOpen && query.length >= 2 && (
          <div style={{
            position: 'absolute', top: '100%', marginTop: 6,
            left: 0, right: 0, zIndex: 50, borderRadius: 10,
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden',
          }}>
            {results.length === 0 ? (
              <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : results.map((r) => (
              <button key={`${r.exchange}:${r.symbol}`}
                onClick={() => { router.push(`/charts?symbol=${r.symbol}`); setSearchOpen(false); setQuery('') }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '10px 16px',
                  borderBottom: '1px solid var(--border)', background: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'var(--bg-tertiary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: 'var(--text-primary)',
                  }}>
                    {r.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{r.symbol}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.name} · {r.exchange}</p>
                  </div>
                </div>
                {r.ltp && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>₹{formatPrice(r.ltp)}</p>
                    <p style={{ fontSize: 11, color: r.change && r.change >= 0 ? 'var(--up)' : 'var(--down)' }}>
                      {formatChangePct(r.change || 0)}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Market status */}
      {mounted && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
          background: marketStatus.open ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
          color: marketStatus.open ? 'var(--up)' : 'var(--down)',
          border: `1px solid ${marketStatus.open ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: marketStatus.open ? 'var(--up)' : 'var(--down)',
          }} />
          {marketStatus.label}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>·</span>
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>{marketStatus.nextEvent}</span>
        </div>
      )}

      {/* Bell */}
      <button style={{
        width: 36, height: 36, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: '1px solid var(--border)',
        cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative',
      }}>
        <Bell size={15} />
        <span style={{
          position: 'absolute', top: 7, right: 7,
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--down)',
        }} />
      </button>

      {/* Sign in */}
      <a href="/auth" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 8, fontSize: 13,
        fontWeight: 500, textDecoration: 'none',
        background: 'var(--text-primary)', color: 'var(--bg-primary)',
      }}>
        <LogIn size={13} />
        Sign In
      </a>
    </header>
  )
}

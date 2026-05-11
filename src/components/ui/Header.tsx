'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Bell, X, LogIn, LogOut, User } from 'lucide-react'
import { useMarketStore } from '@/lib/store'
import { getMarketStatus, formatPrice, formatChangePct } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { title } from 'process'
import { time } from 'console'

export function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; symbol: string; exchange: string; ltp?: number; change?: number }[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [marketStatus, setMarketStatus] = useState({ open: false, label: 'Loading...', nextEvent: '' })
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)

const NOTIFICATIONS = [
  { icon: '📈', title: 'NIFTY 50 crossed 24,000 — Market bullish!', time: '2 mins ago', unread: true, color: 'rgba(0,193,118,0.15)' },
  { icon: '🤖', title: 'AI Alert: RELIANCE showing buy signal', time: '15 mins ago', unread: true, color: 'rgba(99,102,241,0.15)' },
  { icon: '📉', title: 'HDFCBANK dropped 1.5% — Watch support levels', time: '1 hour ago', unread: true, color: 'rgba(239,68,68,0.15)' },
  { icon: '📊', title: 'Market opens in 30 minutes', time: '8:45 AM', unread: false, color: 'rgba(245,158,11,0.15)' },
  { icon: '✅', title: 'Angel One connected successfully', time: 'Yesterday', unread: false, color: 'rgba(0,193,118,0.15)' },
  { icon : 'Rel',  title:  'Reliance company is set to cross starlink with the reliance sattilite wifi ', time: 'Today' , unread: true , color: 'blue' },
]
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setMarketStatus(getMarketStatus())
    const timer = setInterval(() => setMarketStatus(getMarketStatus()), 60000)

    // Check if user is logged in
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('alpha_current_user')
        if (stored) setUser(JSON.parse(stored))
        else setUser(null)
      } catch { setUser(null) }
    }
    checkUser()
    window.addEventListener('storage', checkUser)
    window.addEventListener('focus', checkUser)

    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', checkUser)
      window.removeEventListener('focus', checkUser)
    }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim() || query.length < 1) { setResults([]); return }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch { setResults([]) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleLogout = () => {
    localStorage.removeItem('alpha_current_user')
    setUser(null)
    router.push('/auth')
  }

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
        {searchOpen && query.length >= 1 && (
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
<div style={{ position: 'relative' }}>
  <button
    onClick={() => setNotifOpen(!notifOpen)}
    style={{
      width: 36, height: 36, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: notifOpen ? 'var(--bg-secondary)' : 'transparent',
      border: '1px solid var(--border)',
      cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative',
    }}>
    <Bell size={15} />
    <span style={{
      position: 'absolute', top: 7, right: 7,
      width: 6, height: 6, borderRadius: '50%',
      background: 'var(--down)',
    }} />
  </button>

  {/* Notifications Dropdown */}
  {notifOpen && (
    <div style={{
      position: 'absolute', top: '100%', right: 0, marginTop: 8,
      width: 320, borderRadius: 12,
      background: 'var(--card-bg)', border: '1px solid var(--border)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 50, overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
        <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={13} />
        </button>
      </div>
      {NOTIFICATIONS.map((notif, i) => (
        <div key={i} style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
          background: notif.unread ? 'rgba(0,196,126,0.03)' : 'transparent',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: notif.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            {notif.icon}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: notif.unread ? 600 : 400, color: 'var(--text-primary)', marginBottom: 2 }}>
              {notif.title}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{notif.time}</p>
          </div>
          {notif.unread && (
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', marginLeft: 'auto', marginTop: 4, flexShrink: 0 }} />
          )}
        </div>
      ))}
      <div style={{ padding: '10px 16px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Mark all as read</span>
      </div>
    </div>
  )}
</div>

      {/* User / Sign In */}
      {mounted && (
        user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            }}>
              <User size={13} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                {user.name?.split(' ')[0] || user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 8, fontSize: 13,
                fontWeight: 500, cursor: 'pointer',
                background: 'rgba(220,38,38,0.1)',
                color: 'var(--down)',
                border: '1px solid rgba(220,38,38,0.2)',
              }}>
              <LogOut size={13} />
              Logout
            </button>
          </div>
        ) : (
          <a href="/auth" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8, fontSize: 13,
            fontWeight: 500, textDecoration: 'none',
            background: 'var(--text-primary)', color: 'var(--bg-primary)',
          }}>
            <LogIn size={13} />
            Sign In
          </a>
        )
      )}
    </header>
  )
}
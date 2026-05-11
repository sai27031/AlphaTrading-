'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Zap, Shield, Bot, BarChart2, ArrowRight, Star } from 'lucide-react'

const TICKER_DATA = [
  { symbol: 'NIFTY 50', value: '24,139.60', change: '+0.59%', up: true },
  { symbol: 'SENSEX', value: '79,408.50', change: '+0.55%', up: true },
  { symbol: 'BANK NIFTY', value: '55,121.40', change: '+0.47%', up: true },
  { symbol: 'RELIANCE', value: '2,943.50', change: '+1.45%', up: true },
  { symbol: 'TCS', value: '3,812.30', change: '+0.62%', up: true },
  { symbol: 'INFY', value: '1,423.60', change: '+2.14%', up: true },
  { symbol: 'HDFCBANK', value: '1,567.85', change: '-0.91%', up: false },
  { symbol: 'BAJFINANCE', value: '7,234.90', change: '-1.23%', up: false },
]

const FEATURES = [
  { icon: BarChart2, title: 'Real-time Market Data', desc: 'Live NSE & BSE prices powered by Angel One API updating every 10 seconds' },
  { icon: Bot, title: 'AI Market Assistant', desc: 'Get instant stock analysis, market insights and trading recommendations from AI' },
  { icon: TrendingUp, title: 'Advanced Screener', desc: 'Filter stocks by fundamentals, technicals and custom criteria' },
  { icon: Shield, title: 'Portfolio Tracking', desc: 'Track your investments, P&L and portfolio performance in real-time' },
]

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px', borderBottom: '1px solid #1a1a1a',
        position: 'sticky', top: 0, background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#ffffff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>Alpha Trading</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/auth')}
            style={{ padding: '8px 20px', borderRadius: 8, background: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
            Sign In
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{ padding: '8px 20px', borderRadius: 8, background: '#ffffff', border: 'none', color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Ticker Tape */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'ticker 30s linear infinite', gap: 0 }}>
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 24px', borderRight: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: 12, color: '#888' }}>{t.symbol}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>₹{t.value}</span>
              <span style={{ fontSize: 12, color: t.up ? '#00c176' : '#ef4444' }}>
                {t.up ? '▲' : '▼'} {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '100px 60px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0a0a0a', border: '1px solid #222', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 12, color: '#888' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c176', display: 'inline-block' }} />
          Live Market Data · AI Powered · Free to Use
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>
          Trade Smarter with
          <span style={{ color: '#00c176' }}> AI-Powered</span>
          <br />Market Intelligence
        </h1>

        <p style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Real-time NSE & BSE data, AI stock analysis, portfolio tracking and advanced screener — all in one professional platform.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/auth')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, background: '#ffffff', color: '#000', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
            Start Trading Free <ArrowRight size={16} />
          </button>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, background: 'transparent', color: '#fff', border: '1px solid #333', cursor: 'pointer', fontSize: 15 }}>
            View Live Market
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#444', marginTop: 20 }}>
          ✓ No credit card required &nbsp; ✓ Free forever &nbsp; ✓ Angel One integration
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, margin: '0 60px 80px', overflow: 'hidden' }}>
        {[
          { label: 'Stocks Tracked', value: '5,000+' },
          { label: 'Live Updates', value: 'Every 10s' },
          { label: 'AI Queries/Day', value: 'Unlimited' },
          { label: 'Cost', value: '₹0' },
        ].map((stat, i) => (
          <div key={i} style={{ padding: '32px 24px', textAlign: 'center', background: '#000', borderRight: i < 3 ? '1px solid #1a1a1a' : 'none' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'monospace' }}>{stat.value}</p>
            <p style={{ fontSize: 13, color: '#555' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '0 60px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 48, letterSpacing: '-1px' }}>
          Everything you need to trade professionally
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28, transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
            >
              <div style={{ width: 40, height: 40, background: '#111', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={18} color="#00c176" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: '0 60px 80px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>
          Start trading smarter today
        </h2>
        <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>
          Join thousands of traders using Alpha Trading for market intelligence
        </p>
        <button
          onClick={() => router.push('/auth')}
          style={{ padding: '14px 32px', borderRadius: 10, background: '#ffffff', color: '#000', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
          Create Free Account →
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #111', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={14} color="#fff" />
          <span style={{ fontSize: 13, color: '#555' }}>Alpha Trading © 2026</span>
        </div>
        <p style={{ fontSize: 12, color: '#333' }}>For educational purposes only. Not financial advice.</p>
      </div>

    </div>
  )
}
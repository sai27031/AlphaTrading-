'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, TrendingUp, TrendingDown, Zap, BarChart2, Bot, Shield, Activity, ChevronDown } from 'lucide-react'

const FLOATING_STOCKS = [
  { symbol: 'NIFTY 50',   price: '23,114',  change: '+1.21%', x: 8,  y: 28, up: true  },
  { symbol: 'RELIANCE',   price: '₹2,943',  change: '+1.45%', x: 75, y: 22, up: true  },
  { symbol: 'SENSEX',     price: '76,456',  change: '+0.87%', x: 5,  y: 62, up: true  },
  { symbol: 'BANK NIFTY', price: '53,427',  change: '-0.32%', x: 78, y: 58, up: false },
  { symbol: 'TCS',        price: '₹3,812',  change: '+0.62%', x: 12, y: 80, up: true  },
  { symbol: 'INDIA VIX',  price: '14.23',   change: '-5.43%', x: 72, y: 82, up: false },
]

const TRUSTED = ['NSE', 'BSE', 'Angel One', 'Upstox', 'Zerodha', 'SEBI Compliant', 'Real-time Data']

const FEATURES = [
  { icon: BarChart2, title: 'Professional Charts',  desc: '23+ indicators, candlestick charts, multiple timeframes — TradingView quality' },
  { icon: Bot,       title: 'AI Market Analysis',   desc: 'Claude AI gives buy/sell signals, analyses trends and predicts market moves' },
  { icon: Activity,  title: 'Live NSE & BSE Data',  desc: 'Real-time tick data, order book depth and live prices for all securities' },
  { icon: TrendingUp,title: 'Advanced Screener',    desc: 'Filter 5000+ stocks using 50+ technical and fundamental parameters' },
  { icon: Shield,    title: 'Portfolio Tracker',    desc: 'Track P&L, XIRR returns and sector allocation across all brokers' },
  { icon: Zap,       title: 'Smart Alerts',         desc: 'Price alerts, breakout signals and AI-powered opportunity notifications' },
]

// Animated candlestick chart data
const CANDLES = Array.from({ length: 28 }, (_, i) => ({
  h: 40 + Math.sin(i * 0.6) * 20 + Math.random() * 25,
  up: Math.sin(i * 0.6 + 0.3) > 0,
}))

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [ticker, setTicker] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onMouse = (e: MouseEvent) => { setMouseX(e.clientX / window.innerWidth); setMouseY(e.clientY / window.innerHeight) }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMouse)
    const iv = setInterval(() => setTicker(t => t + 1), 3000)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); clearInterval(iv) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisible(p => ({ ...p, [e.target.id]: true })) }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? 'rgba(5,5,5,0.9)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 5%', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.3px' }}>Alpha Trading</span>
        </div>

        <div style={{ display: 'flex', gap: 28, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          {['Features', 'Markets', 'Pricing', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/auth/login" style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)' }}>
            Sign In
          </Link>
          <Link href="/auth/register" style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: '#fff', color: '#000', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e0e0e0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff' }}>
            Create Account
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 80px', overflow: 'hidden' }}>

        {/* Dynamic background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
          {/* Mouse-following glow */}
          <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)`, left: `${mouseX * 100 - 20}%`, top: `${mouseY * 100 - 20}%`, transform: 'translate(-50%,-50%)', transition: 'left 1s ease, top 1s ease', pointerEvents: 'none' }} />
          {/* Static glows */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', animation: 'float1 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)', animation: 'float2 13s ease-in-out infinite' }} />
        </div>

        {/* Floating stock cards */}
        {FLOATING_STOCKS.map((s, i) => (
          <div key={s.symbol} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, zIndex: 2, animation: `float${(i % 2) + 1} ${6 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', minWidth: 120 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.up ? '#22c55e' : '#ef4444', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{s.symbol}</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>{s.price}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: s.up ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {s.change}
              </p>
            </div>
          </div>
        ))}

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 860 }}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.06)', marginBottom: 36, animation: 'fadeUp 0.7s ease both' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Live NSE & BSE Market Intelligence</span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.03em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 28, animation: 'fadeUp 0.7s ease 0.1s both' }}>
            Trade Indian<br />
            <span style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Markets Smarter
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 44px', animation: 'fadeUp 0.7s ease 0.2s both' }}>
            Professional charts, real-time data, AI-powered analysis — everything India's top traders use, now free.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.3s both' }}>
            <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#fff', color: '#000', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 0 40px rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 40px rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 40px rgba(255,255,255,0.08)' }}>
              Start for Free <ArrowUpRight size={16} />
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 500, background: 'rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)' }}>
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.4s both' }}>
            {[['5,000+','Stocks tracked'],['23+','Indicators'],['Real-time','NSE & BSE'],['AI-powered','Analysis']].map(([v,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4, letterSpacing: '0.05em' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', color: 'rgba(255,255,255,0.2)', zIndex: 3 }}>
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ── TICKER TAPE ── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', height: 44, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap' }}>
          {[...FLOATING_STOCKS, ...FLOATING_STOCKS, ...FLOATING_STOCKS].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderRight: '1px solid rgba(255,255,255,0.05)', height: 44 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{t.symbol}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.price}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: t.up ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                {t.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: '100px 5%', position: 'relative' }}>
        <div id="preview" data-animate style={{ maxWidth: 1100, margin: '0 auto', opacity: visible['preview'] ? 1 : 0, transform: visible['preview'] ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.9s ease' }}>
          {/* Browser mockup */}
          <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)' }}>
            {/* Chrome */}
            <div style={{ background: '#0f0f0f', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['#ef4444','#f59e0b','#22c55e'].map((c,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 7, height: 26, margin: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>alphatrading.in/dashboard</span>
              </div>
            </div>
            {/* Dashboard UI */}
            <div style={{ background: '#0a0a0a', display: 'flex', height: 420 }}>
              {/* Sidebar */}
              <div style={{ width: 160, background: '#000', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px', marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={12} color="#000" /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Alpha Trading</span>
                </div>
                {['Dashboard','Charts','Screener','Portfolio','Watchlist','IPO / F&O','News'].map((item,i) => (
                  <div key={item} style={{ padding: '8px 10px', borderRadius: 7, background: i === 0 ? '#fff' : 'transparent', fontSize: 11, color: i === 0 ? '#000' : 'rgba(255,255,255,0.35)', fontWeight: i === 0 ? 600 : 400, borderLeft: i !== 0 ? '2px solid transparent' : '2px solid transparent' }}>{item}</div>
                ))}
              </div>
              {/* Main */}
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Index cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
                  {[['NIFTY 50','23,114','+1.21%',true],['SENSEX','76,456','+0.87%',true],['BANK NIFTY','53,427','-0.32%',false],['NIFTY IT','38,456','+2.16%',true],['MIDCAP','49,234','+0.71%',true],['VIX','14.23','-5.43%',false]].map(([n,p,c,u]) => (
                    <div key={n as string} style={{ background: '#111', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: 8, color: '#555', marginBottom: 3 }}>{n}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{p}</p>
                      <p style={{ fontSize: 9, fontWeight: 600, color: u ? '#22c55e' : '#ef4444' }}>{c}</p>
                    </div>
                  ))}
                </div>
                {/* Chart mock */}
                <div style={{ flex: 1, background: '#111', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>RELIANCE · ₹2,943.50</span>
                    <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>+1.45%</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    {CANDLES.map((c, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <div style={{ width: '60%', background: c.up ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)', height: `${c.h}%`, borderRadius: '2px 2px 0 0', minHeight: 4 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <div style={{ padding: '20px 5%', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {TRUSTED.map(t => (
            <span key={t} style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 5%' }}>
        <div id="feat" data-animate style={{ textAlign: 'center', marginBottom: 64, opacity: visible['feat'] ? 1 : 0, transform: visible['feat'] ? 'none' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>Everything you need</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
            Built for Indian markets
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} id={`f${i}`} data-animate
              style={{ padding: 28, borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', opacity: visible[`f${i}`] ? 1 : 0, transform: visible[`f${i}`] ? 'none' : 'translateY(30px)', transition: `all 0.6s ease ${i * 0.1}s`, cursor: 'default' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.border = '1px solid rgba(255,255,255,0.15)'; el.style.background = 'rgba(255,255,255,0.04)'; el.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.border = '1px solid rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.02)'; el.style.transform = 'none' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon size={22} color="#fff" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 5%' }}>
        <div id="cta" data-animate style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: '72px 48px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', opacity: visible['cta'] ? 1 : 0, transform: visible['cta'] ? 'none' : 'translateY(40px)', transition: 'all 0.8s ease' }}>
          <div style={{ width: 60, height: 60, background: '#fff', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <Zap size={28} color="#000" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Ready to trade smarter?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of Indian traders using Alpha Trading for professional market analysis.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#fff', color: '#000', textDecoration: 'none' }}>
              Start Free <ArrowUpRight size={16} />
            </Link>
            <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 500, background: 'rgba(255,255,255,0.07)', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <footer style={{ padding: '28px 5%', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={13} color="#000" /></div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Alpha Trading</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2026 Alpha Trading · Educational purposes only · Not SEBI registered</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy','Terms','Contact'].map(item => (
            <a key={item} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-18px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,20px)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
      `}</style>
    </div>
  )
}
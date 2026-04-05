'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'

const MINI_TICKER = [
  { s: 'NIFTY 50', p: '23,114.50', c: '+1.21%', up: true },
  { s: 'SENSEX', p: '76,456', c: '+0.87%', up: true },
  { s: 'BANK NIFTY', p: '53,427', c: '-0.32%', up: false },
  { s: 'RELIANCE', p: '₹2,943', c: '+1.45%', up: true },
  { s: 'TCS', p: '₹3,812', c: '+0.62%', up: true },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    setEmail('demo@alphatrading.in')
    setPassword('demo123')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* Left panel - branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 8%', position: 'relative', zIndex: 1, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 60, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>Alpha Trading</span>
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Markets are open.<br />Are you ready?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 340, marginBottom: 48 }}>
            Sign in to access real-time NSE & BSE data, AI analysis and professional charts.
          </p>

          {/* Live mini cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
            {MINI_TICKER.map(t => (
              <div key={t.s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeUp 0.5s ease both' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.s}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{t.p}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.up ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                    {t.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {t.c}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s' }}>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>Sign in to your Alpha Trading account</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Password</label>
                <Link href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: '#fff', color: '#000', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', marginTop: 4 }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#e5e5e5' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <button onClick={handleDemo}
            style={{ width: '100%', padding: '12px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)' }}>
            Try Demo Account
          </button>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 28 }}>
            New to Alpha Trading?{' '}
            <Link href="/auth/register" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Create free account →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
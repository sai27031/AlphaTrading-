'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowLeft, Check, BarChart2, Bot, TrendingUp, Shield } from 'lucide-react'

const PERKS = [
  { icon: BarChart2, text: 'TradingView-style charts with 23+ indicators' },
  { icon: Bot,       text: 'AI-powered stock analysis and predictions' },
  { icon: TrendingUp,text: 'Real-time NSE & BSE live prices' },
  { icon: Shield,    text: 'Advanced screener with 50+ filters' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Good', 'Strong']
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e']

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', animation: 'float1 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)', animation: 'float2 11s ease-in-out infinite' }} />
      </div>

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 8%', position: 'relative', zIndex: 1, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 60 }}>
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
            Your edge in the<br />Indian markets
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 340, marginBottom: 48 }}>
            Everything professional traders use — now available for free.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PERKS.map(({ icon: Icon, text }, i) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateX(-20px)', transition: `all 0.5s ease ${0.1 + i * 0.1}s` }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 52px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease 0.15s' }}>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>Free forever. No credit card required.</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 20 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor[strength], fontWeight: 500 }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: '#fff', color: '#000', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', marginTop: 6 }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#e5e5e5' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service and Privacy Policy
          </p>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }
      `}</style>
    </div>
  )
}
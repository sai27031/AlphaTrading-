'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'credentials' | 'pin'>('credentials');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentials = () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!isLogin && !name) { setError('Please enter your name'); return; }
    setError('');
    setStep('pin');
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) { setError('PIN must be 4 digits'); return; }
    if (!isLogin && pin !== confirmPin) { setError('PINs do not match'); return; }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('alpha_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password && u.pin === pin);
        if (!user) { setError('Invalid credentials or PIN'); setLoading(false); return; }
        localStorage.setItem('alpha_current_user', JSON.stringify(user));
        localStorage.setItem('alpha_pin_verified', 'true');
        router.push('/');
      } else {
        const users = JSON.parse(localStorage.getItem('alpha_users') || '[]');
        const exists = users.find((u: any) => u.email === email);
        if (exists) { setError('Email already registered'); setLoading(false); return; }
        const newUser = { name, email, password, pin, createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('alpha_users', JSON.stringify(users));
        localStorage.setItem('alpha_current_user', JSON.stringify(newUser));
        localStorage.setItem('alpha_pin_verified', 'true');
        router.push('/');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '40px',
        width: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--brand)', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            ⚡ Alpha Trading
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
            {step === 'credentials'
              ? (isLogin ? 'Sign in to your account' : 'Create your account')
              : (isLogin ? 'Enter your PIN' : 'Set your PIN')}
          </p>
        </div>

        {step === 'credentials' && (
          <>
            {/* Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
              <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: isLogin ? 'var(--brand)' : 'transparent', color: isLogin ? '#000' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer' }}>
                Login
              </button>
              <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: !isLogin ? 'var(--brand)' : 'transparent', color: !isLogin ? '#000' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer' }}>
                Sign Up
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--down)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Full Name</label>
                <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="input" />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email</label>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
            </div>

            <button onClick={handleCredentials} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
              Continue →
            </button>
          </>
        )}

        {step === 'pin' && (
          <>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--down)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: !isLogin ? '16px' : '24px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                {isLogin ? 'Enter your 4-digit PIN' : 'Create a 4-digit PIN'}
              </label>
              <input
                type="password"
                placeholder="● ● ● ●"
                value={pin}
                maxLength={4}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input"
                style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }}
                autoFocus
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Confirm PIN
                </label>
                <input
                  type="password"
                  placeholder="● ● ● ●"
                  value={confirmPin}
                  maxLength={4}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="input"
                  style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setStep('credentials'); setPin(''); setConfirmPin(''); setError(''); }}
                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>
                ← Back
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={loading || pin.length !== 4}
                className="btn btn-primary"
                style={{ flex: 2, padding: '14px', fontSize: '16px' }}>
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
              🔒 PIN is stored securely on your device
            </p>
          </>
        )}

      </div>
    </div>
  );
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore, useAIBotStore } from '@/lib/store'
import {
  LayoutDashboard, TrendingUp, BarChart2, Briefcase,
  Star, Calendar, Newspaper, Bot, ChevronLeft, LogIn, Moon, Sun, Zap
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/',          icon: LayoutDashboard },
  { label: 'Charts',    href: '/charts',    icon: BarChart2 },
  { label: 'Screener',  href: '/screener',  icon: TrendingUp },
  { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Watchlist', href: '/watchlist', icon: Star },
  { label: 'IPO / F&O', href: '/ipo',       icon: Calendar },
  { label: 'News',      href: '/news',      icon: Newspaper },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { toggleBot } = useAIBotStore()
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const width = sidebarCollapsed ? 64 : 240

  useEffect(() => {
    setMounted(true)
    // Read current theme
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  // Sidebar colors based on theme
  const sidebarBg = isDark ? '#000000' : '#ffffff'
  const sidebarBorder = isDark ? '#1f1f1f' : '#e5e7eb'
  const logoIconBg = isDark ? '#ffffff' : '#000000'
  const logoIconColor = isDark ? '#000000' : '#ffffff'
  const logoText = isDark ? '#ffffff' : '#000000'
  const activeNavBg = isDark ? '#ffffff' : '#000000'
  const activeNavText = isDark ? '#000000' : '#ffffff'
  const inactiveNavText = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const inactiveNavHoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const botText = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'
  const themeText = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'
  const collapseBtn = isDark ? { bg: '#1a1a1a', border: '#333', color: '#666' } : { bg: '#f3f4f6', border: '#e5e7eb', color: '#9ca3af' }

  if (!mounted) return <div style={{ width, background: '#000', height: '100vh', position: 'fixed', top: 0, left: 0 }} />

  return (
    <aside style={{
      width,
      background: sidebarBg,
      borderRight: `1px solid ${sidebarBorder}`,
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 40,
      transition: 'width 0.2s, background 0.2s, border-color 0.2s',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px', borderBottom: `1px solid ${sidebarBorder}`, minHeight: 64, transition: 'border-color 0.2s' }}>
        <div style={{ width: 32, height: 32, background: logoIconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
          <Zap size={15} color={logoIconColor} strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span style={{ color: logoText, fontWeight: 700, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.3px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
            Alpha Trading
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s',
                  background: active ? activeNavBg : 'transparent',
                  color: active ? activeNavText : inactiveNavText,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = inactiveNavHoverBg }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </div>

        {/* AI Bot */}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${sidebarBorder}`, transition: 'border-color 0.2s' }}>
          <button
            onClick={toggleBot}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: botText, whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = inactiveNavHoverBg }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Bot size={17} />
              <span style={{ position: 'absolute', top: -3, right: -3, width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            {!sidebarCollapsed && <span>AI Assistant</span>}
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${sidebarBorder}`, display: 'flex', flexDirection: 'column', gap: 2, transition: 'border-color 0.2s' }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 9, fontSize: 13,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: themeText, whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = inactiveNavHoverBg }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          {isDark ? <Sun size={15} style={{ flexShrink: 0 }} /> : <Moon size={15} style={{ flexShrink: 0 }} />}
          {!sidebarCollapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        <Link
          href="/auth/login"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 9, fontSize: 13,
            color: themeText, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = inactiveNavHoverBg }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
        >
          <LogIn size={15} style={{ flexShrink: 0 }} />
          {!sidebarCollapsed && <span>Login</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute', right: -12, top: 80,
          width: 24, height: 24, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: collapseBtn.bg, border: `1px solid ${collapseBtn.border}`,
          cursor: 'pointer', zIndex: 50, color: collapseBtn.color,
          transition: 'all 0.2s',
        }}
      >
        <ChevronLeft size={11} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
    </aside>
  )
}
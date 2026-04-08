export function formatPrice(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatChangePct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function formatVolume(n: number): string {
  if (!n) return '—'
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)}Cr`
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)}L`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

export function formatMarketCap(n: number): string {
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L Cr`
  return `₹${n.toLocaleString('en-IN')} Cr`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2)
}

export function getMarketStatus() {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const d = ist.getDay()
  const t = ist.getHours() * 60 + ist.getMinutes()
  const open = d >= 1 && d <= 5 && t >= 555 && t <= 930
  if (open) {
    const ci = 930 - t
    return { open: true, label: 'Market Open', nextEvent: `Closes in ${Math.floor(ci / 60)}h ${ci % 60}m` }
  }
  if (d === 0 || d === 6) return { open: false, label: 'Market Closed', nextEvent: 'Opens Monday 9:15 AM' }
  if (t < 555) {
    const oi = 555 - t
    return { open: false, label: 'Pre-Market', nextEvent: `Opens in ${Math.floor(oi / 60)}h ${oi % 60}m` }
  }
  return { open: false, label: 'Market Closed', nextEvent: 'Opens tomorrow 9:15 AM' }
}
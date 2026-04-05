import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatPrice(value: number, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatChange(value: number): string {
  if (!value) return '0.00'
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatPrice(value)}`
}

export function formatChangePct(value: number): string {
  if (!value) return '0.00%'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatVolume(value: number): string {
  if (!value) return '0'
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)}Cr`
  if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(2)}L`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}

export function formatMarketCap(value: number): string {
  if (!value) return '—'
  if (value >= 1_00_000_00_00_000) return `₹${(value / 1_00_000_00_00_000).toFixed(2)}L Cr`
  if (value >= 1_00_00_00_000) return `₹${(value / 1_00_00_00_000).toFixed(2)}K Cr`
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`
  return `₹${formatPrice(value)}`
}

export function formatCurrency(value: number): string {
  return `₹${formatPrice(value)}`
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_00_00_00_000) return `${(value / 1_00_00_00_000).toFixed(2)}B`
  if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)}Cr`
  if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(2)}L`
  return value.toFixed(0)
}

// ─── Color Helpers ────────────────────────────────────────────────────────────

export function getPriceColor(change: number): string {
  if (change > 0) return 'text-up'
  if (change < 0) return 'text-down'
  return 'text-surface-500'
}

export function getPriceBgColor(change: number): string {
  if (change > 0) return 'bg-up/10 text-up'
  if (change < 0) return 'bg-down/10 text-down'
  return 'bg-surface-200 dark:bg-surface-700 text-surface-500'
}

export function getSentimentColor(sentiment: 'positive' | 'negative' | 'neutral'): string {
  if (sentiment === 'positive') return 'text-up'
  if (sentiment === 'negative') return 'text-down'
  return 'text-warn'
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date(date))
}

export function formatTimeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ─── Market Hours ─────────────────────────────────────────────────────────────

export function isMarketOpen(): boolean {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay()
  const hours = ist.getHours()
  const minutes = ist.getMinutes()
  const time = hours * 60 + minutes
  // Mon-Fri, 9:15 AM - 3:30 PM IST
  return day >= 1 && day <= 5 && time >= 555 && time <= 930
}

export function getMarketStatus(): { open: boolean; label: string; nextEvent: string } {
  const open = isMarketOpen()
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay()
  const hours = ist.getHours()
  const minutes = ist.getMinutes()
  const time = hours * 60 + minutes

  if (open) {
    const closeIn = 930 - time
    return { open: true, label: 'Market Open', nextEvent: `Closes in ${Math.floor(closeIn / 60)}h ${closeIn % 60}m` }
  }

  if (day === 0 || day === 6) {
    return { open: false, label: 'Market Closed', nextEvent: 'Opens Monday 9:15 AM IST' }
  }

  if (time < 555) {
    const openIn = 555 - time
    return { open: false, label: 'Pre-Market', nextEvent: `Opens in ${Math.floor(openIn / 60)}h ${openIn % 60}m` }
  }

  return { open: false, label: 'Market Closed', nextEvent: 'Opens tomorrow 9:15 AM IST' }
}

// ─── Technical Indicators ─────────────────────────────────────────────────────

export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(NaN); continue }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    result.push(sum / period)
  }
  return result
}

export function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const result: number[] = [data[0]]
  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k))
  }
  return result
}

export function calculateRSI(data: number[], period = 14): number[] {
  const result: number[] = new Array(period).fill(NaN)
  let gains = 0, losses = 0

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1]
    if (diff > 0) gains += diff
    else losses += Math.abs(diff)
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  for (let i = period; i < data.length; i++) {
    const diff = data[i] - data[i - 1]
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? Math.abs(diff) : 0)) / period
    const rs = avgGain / (avgLoss || 0.0001)
    result.push(100 - 100 / (1 + rs))
  }
  return result
}

export function calculateMACD(data: number[]): {
  macd: number[]; signal: number[]; histogram: number[]
} {
  const ema12 = calculateEMA(data, 12)
  const ema26 = calculateEMA(data, 26)
  const macd = ema12.map((v, i) => v - ema26[i])
  const signal = calculateEMA(macd, 9)
  const histogram = macd.map((v, i) => v - signal[i])
  return { macd, signal, histogram }
}

export function calculateBollingerBands(data: number[], period = 20, stdDev = 2): {
  upper: number[]; middle: number[]; lower: number[]
} {
  const middle = calculateSMA(data, period)
  const upper: number[] = [], lower: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { upper.push(NaN); lower.push(NaN); continue }
    const slice = data.slice(i - period + 1, i + 1)
    const mean = middle[i]
    const variance = slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period
    const sd = Math.sqrt(variance)
    upper.push(mean + stdDev * sd)
    lower.push(mean - stdDev * sd)
  }
  return { upper, middle, lower }
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
// @ts-nocheck
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, TrendingUp, TrendingDown, Bot, Maximize2, Minimize2, ChevronDown, Check, X, Star, Bell, Share2, Camera } from 'lucide-react'
import { formatPrice, formatChangePct, formatVolume } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y']
const INTERVALS = [
  { label: '1m',  value: '1minute' },
  { label: '3m',  value: '3minute' },
  { label: '5m',  value: '5minute' },
  { label: '15m', value: '15minute' },
  { label: '30m', value: '30minute' },
  { label: '1H',  value: '60minute' },
  { label: '2H',  value: '120minute' },
  { label: '4H',  value: '240minute' },
  { label: '1D',  value: 'day' },
  { label: '1W',  value: 'week' },
  { label: '1M',  value: 'month' },
]

const ALL_INDICATORS = [
  { id: 'sma20',   label: 'SMA 20',           category: 'Moving Averages', color: '#3b82f6' },
  { id: 'sma50',   label: 'SMA 50',           category: 'Moving Averages', color: '#f59e0b' },
  { id: 'sma100',  label: 'SMA 100',          category: 'Moving Averages', color: '#a855f7' },
  { id: 'sma200',  label: 'SMA 200',          category: 'Moving Averages', color: '#8b5cf6' },
  { id: 'ema9',    label: 'EMA 9',            category: 'Moving Averages', color: '#f97316' },
  { id: 'ema20',   label: 'EMA 20',           category: 'Moving Averages', color: '#06b6d4' },
  { id: 'ema50',   label: 'EMA 50',           category: 'Moving Averages', color: '#ec4899' },
  { id: 'ema200',  label: 'EMA 200',          category: 'Moving Averages', color: '#14b8a6' },
  { id: 'vwap',    label: 'VWAP',             category: 'Volume',          color: '#f97316' },
  { id: 'volume',  label: 'Volume',           category: 'Volume',          color: '#22c55e' },
  { id: 'obv',     label: 'OBV',              category: 'Volume',          color: '#84cc16' },
  { id: 'bb',      label: 'Bollinger Bands',  category: 'Volatility',      color: '#6366f1' },
  { id: 'atr',     label: 'ATR (14)',         category: 'Volatility',      color: '#d946ef' },
  { id: 'rsi',     label: 'RSI (14)',         category: 'Oscillators',     color: '#ef4444' },
  { id: 'macd',    label: 'MACD',             category: 'Oscillators',     color: '#14b8a6' },
  { id: 'stoch',   label: 'Stochastic',       category: 'Oscillators',     color: '#eab308' },
  { id: 'cci',     label: 'CCI (20)',         category: 'Oscillators',     color: '#f43f5e' },
  { id: 'williams','label': 'Williams %R',    category: 'Oscillators',     color: '#0ea5e9' },
  { id: 'adx',     label: 'ADX',             category: 'Trend',           color: '#fb923c' },
  { id: 'ichimoku',label: 'Ichimoku Cloud',   category: 'Trend',           color: '#a3e635' },
  { id: 'psar',    label: 'Parabolic SAR',    category: 'Trend',           color: '#fbbf24' },
  { id: 'pivot',   label: 'Pivot Points',     category: 'Support/Resistance', color: '#94a3b8' },
  { id: 'fib',     label: 'Fibonacci',        category: 'Support/Resistance', color: '#c084fc' },
]

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE',   name: 'Reliance Industries', exchange: 'NSE', sector: 'Energy' },
  { symbol: 'TCS',        name: 'Tata Consultancy',    exchange: 'NSE', sector: 'IT' },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank',           exchange: 'NSE', sector: 'Banking' },
  { symbol: 'INFY',       name: 'Infosys',             exchange: 'NSE', sector: 'IT' },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank',          exchange: 'NSE', sector: 'Banking' },
  { symbol: 'WIPRO',      name: 'Wipro',               exchange: 'NSE', sector: 'IT' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors',         exchange: 'NSE', sector: 'Auto' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance',       exchange: 'NSE', sector: 'Finance' },
  { symbol: 'SUNPHARMA',  name: 'Sun Pharma',          exchange: 'NSE', sector: 'Pharma' },
  { symbol: 'ONGC',       name: 'ONGC',                exchange: 'NSE', sector: 'Energy' },
  { symbol: 'SBIN',       name: 'State Bank of India', exchange: 'NSE', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel',       exchange: 'NSE', sector: 'Telecom' },
  { symbol: 'ITC',        name: 'ITC Limited',         exchange: 'NSE', sector: 'FMCG' },
  { symbol: 'AXISBANK',   name: 'Axis Bank',           exchange: 'NSE', sector: 'Banking' },
  { symbol: 'KOTAKBANK',  name: 'Kotak Bank',          exchange: 'NSE', sector: 'Banking' },
  { symbol: 'MARUTI',     name: 'Maruti Suzuki',       exchange: 'NSE', sector: 'Auto' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever',  exchange: 'NSE', sector: 'FMCG' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports',         exchange: 'NSE', sector: 'Infra' },
  { symbol: 'LTIM',       name: 'LTIMindtree',         exchange: 'NSE', sector: 'IT' },
  { symbol: 'NESTLEIND',  name: 'Nestle India',        exchange: 'NSE', sector: 'FMCG' },
]

const STOCK_DATA: Record<string, any> = {
  RELIANCE:   { price: 2943.50, change: 41.95,  changePct: 1.45,  volume: 9876543,  high: 2968.00, low: 2901.20, open: 2901.55, prevClose: 2901.55, mktCap: '19.93L Cr', pe: 27.4, pb: 2.1 },
  TCS:        { price: 3812.30, change: 23.50,  changePct: 0.62,  volume: 3456789,  high: 3835.00, low: 3780.10, open: 3788.80, prevClose: 3788.80, mktCap: '13.82L Cr', pe: 32.1, pb: 14.2 },
  HDFCBANK:   { price: 1567.85, change: -14.40, changePct: -0.91, volume: 15678900, high: 1590.00, low: 1560.05, open: 1582.25, prevClose: 1582.25, mktCap: '11.95L Cr', pe: 18.3, pb: 2.8 },
  INFY:       { price: 1423.60, change: 29.85,  changePct: 2.14,  volume: 8923456,  high: 1435.00, low: 1390.20, open: 1393.75, prevClose: 1393.75, mktCap: '5.92L Cr',  pe: 28.7, pb: 9.1 },
  ICICIBANK:  { price: 1078.45, change: 5.80,   changePct: 0.54,  volume: 12345678, high: 1085.00, low: 1065.30, open: 1072.65, prevClose: 1072.65, mktCap: '7.58L Cr',  pe: 19.2, pb: 3.1 },
  WIPRO:      { price: 462.30,  change: 8.50,   changePct: 1.87,  volume: 6543210,  high: 467.00,  low: 453.80,  open: 453.80,  prevClose: 453.80,  mktCap: '2.41L Cr',  pe: 22.4, pb: 4.3 },
  TATAMOTORS: { price: 812.60,  change: 25.30,  changePct: 3.21,  volume: 12456789, high: 820.00,  low: 785.40,  open: 787.30,  prevClose: 787.30,  mktCap: '3.02L Cr',  pe: 8.9,  pb: 2.4 },
  BAJFINANCE: { price: 7234.90, change: -90.10, changePct: -1.23, volume: 2345678,  high: 7350.00, low: 7200.00, open: 7325.00, prevClose: 7325.00, mktCap: '4.37L Cr',  pe: 31.2, pb: 5.8 },
  SUNPHARMA:  { price: 1587.30, change: 29.90,  changePct: 1.92,  volume: 3456789,  high: 1600.00, low: 1558.00, open: 1557.40, prevClose: 1557.40, mktCap: '3.81L Cr',  pe: 34.6, pb: 6.2 },
  ONGC:       { price: 267.45,  change: 0.92,   changePct: 0.34,  volume: 7890123,  high: 270.00,  low: 264.50,  open: 266.53,  prevClose: 266.53,  mktCap: '3.36L Cr',  pe: 7.8,  pb: 1.1 },
  SBIN:       { price: 812.30,  change: 12.40,  changePct: 1.55,  volume: 18234567, high: 820.00,  low: 798.50,  open: 799.90,  prevClose: 799.90,  mktCap: '7.25L Cr',  pe: 10.2, pb: 1.8 },
  BHARTIARTL: { price: 1678.90, change: -8.20,  changePct: -0.49, volume: 4567890,  high: 1695.00, low: 1665.30, open: 1687.10, prevClose: 1687.10, mktCap: '9.98L Cr',  pe: 62.3, pb: 8.4 },
  ITC:        { price: 453.20,  change: 3.10,   changePct: 0.69,  volume: 9876543,  high: 457.00,  low: 449.50,  open: 450.10,  prevClose: 450.10,  mktCap: '5.66L Cr',  pe: 26.8, pb: 8.9 },
  AXISBANK:   { price: 1089.45, change: 14.30,  changePct: 1.33,  volume: 7654321,  high: 1098.00, low: 1074.20, open: 1075.15, prevClose: 1075.15, mktCap: '3.35L Cr',  pe: 14.7, pb: 2.3 },
  KOTAKBANK:  { price: 1923.60, change: -11.40, changePct: -0.59, volume: 3456789,  high: 1942.00, low: 1915.30, open: 1935.00, prevClose: 1935.00, mktCap: '3.83L Cr',  pe: 20.1, pb: 3.4 },
  MARUTI:     { price: 11234.50, change: 234.60, changePct: 2.13, volume: 1234567,  high: 11300.00, low: 10980.00, open: 10999.90, prevClose: 10999.90, mktCap: '3.39L Cr', pe: 26.4, pb: 4.7 },
  HINDUNILVR: { price: 2345.80, change: -12.30, changePct: -0.52, volume: 2345678,  high: 2368.00, low: 2335.50, open: 2358.10, prevClose: 2358.10, mktCap: '5.50L Cr',  pe: 52.3, pb: 12.1 },
  ADANIPORTS: { price: 1234.50, change: -9.70,  changePct: -0.78, volume: 4567890,  high: 1255.00, low: 1228.00, open: 1244.20, prevClose: 1244.20, mktCap: '2.67L Cr',  pe: 32.4, pb: 4.8 },
  LTIM:       { price: 5234.60, change: 87.30,  changePct: 1.70,  volume: 1234567,  high: 5260.00, low: 5140.00, open: 5147.30, prevClose: 5147.30, mktCap: '1.55L Cr',  pe: 31.8, pb: 8.2 },
  NESTLEIND:  { price: 2189.40, change: 18.90,  changePct: 0.87,  volume: 987654,   high: 2205.00, low: 2165.30, open: 2170.50, prevClose: 2170.50, mktCap: '2.11L Cr',  pe: 68.4, pb: 71.2 },
}

function generateCandles(days: number, basePrice: number) {
  const candles = []
  let price = basePrice * 0.75
  const now = Date.now()
  const msPerDay = 24 * 60 * 60 * 1000
  for (let i = days; i >= 0; i--) {
    const time = Math.floor((now - i * msPerDay) / 1000)
    const open = price
    const change = (Math.random() - 0.47) * price * 0.022
    const close = Math.max(open + change, open * 0.94)
    const high = Math.max(open, close) * (1 + Math.random() * 0.012)
    const low = Math.min(open, close) * (1 - Math.random() * 0.012)
    const volume = Math.floor(Math.random() * 8000000 + 500000)
    candles.push({ time, open, high, low, close, volume })
    price = close
  }
  return candles
}

function calcSMA(closes: number[], period: number) {
  return closes.map((_, i) => {
    if (i < period - 1) return null
    return closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
  })
}

function calcEMA(closes: number[], period: number) {
  const k = 2 / (period + 1)
  let ema = closes[0]
  return closes.map(c => { ema = c * k + ema * (1 - k); return ema })
}

export default function ChartsPage() {
  const { openBot } = useAIBotStore()
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [selectedStock, setSelectedStock] = useState('RELIANCE')
  const [selectedInterval, setSelectedInterval] = useState('day')
  const [selectedTimeframe, setSelectedTimeframe] = useState('3M')
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['volume', 'sma20', 'sma50'])
  const [chartType, setChartType] = useState<'candle' | 'line' | 'bar' | 'area'>('candle')
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showIndicators, setShowIndicators] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [indicatorSearch, setIndicatorSearch] = useState('')
  const [watchlisted, setWatchlisted] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'chart' | 'info' | 'financials'>('chart')
  const indicatorRef = useRef<HTMLDivElement>(null)

  const stockInfo = STOCK_DATA[selectedStock] || STOCK_DATA.RELIANCE
  const indicatorCategories = [...new Set(ALL_INDICATORS.map(i => i.category))]

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    return () => { document.body.classList.remove('fullscreen-active') }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!indicatorRef.current?.contains(e.target as Node)) setShowIndicators(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.body.classList.add('fullscreen-active')
    } else {
      document.body.classList.remove('fullscreen-active')
    }
    setIsFullscreen(!isFullscreen)
  }

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const initChart = useCallback(async () => {
    if (!chartRef.current || !mounted) return
    const LWC = await import('lightweight-charts')
    if (chartInstance.current) { chartInstance.current.remove(); chartInstance.current = null }

    const isDark = document.documentElement.classList.contains('dark')
    const bg = isDark ? '#111111' : '#ffffff'
    const textColor = isDark ? '#9aa0a6' : '#5f6368'
    const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'

    const chart = LWC.createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      layout: { background: { color: bg }, textColor, fontFamily: 'Inter, sans-serif', fontSize: 11 },
      grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
      crosshair: { mode: LWC.CrosshairMode.Normal },
      rightPriceScale: { borderColor: 'transparent', scaleMargins: { top: 0.08, bottom: 0.25 } },
      timeScale: { borderColor: 'transparent', timeVisible: true, secondsVisible: false },
    })
    chartInstance.current = chart

    const days = selectedTimeframe === '1D' ? 1 : selectedTimeframe === '1W' ? 7 : selectedTimeframe === '1M' ? 30 : selectedTimeframe === '3M' ? 90 : selectedTimeframe === '6M' ? 180 : selectedTimeframe === '1Y' ? 365 : 1825
    const candles = generateCandles(days, stockInfo.price)
    const closes = candles.map(c => c.close)

    // Main series
    if (chartType === 'candle') {
      chart.addCandlestickSeries({
        upColor: '#16a34a', downColor: '#dc2626',
        borderUpColor: '#16a34a', borderDownColor: '#dc2626',
        wickUpColor: '#16a34a', wickDownColor: '#dc2626',
      }).setData(candles as any)
    } else if (chartType === 'line') {
      chart.addLineSeries({ color: '#16a34a', lineWidth: 2 }).setData((candles as any).map((c: any) => ({ time: c.time, value: c.close })))
    } else if (chartType === 'bar') {
      chart.addBarSeries({ upColor: '#16a34a', downColor: '#dc2626' }).setData(candles as any)
    } else if (chartType === 'area') {
      chart.addAreaSeries({
        lineColor: '#16a34a', topColor: 'rgba(22,163,74,0.3)',
        bottomColor: 'rgba(22,163,74,0)', lineWidth: 2,
      }).setData((candles as any).map((c: any) => ({ time: c.time, value: c.close })))
    }

    // Volume
    if (activeIndicators.includes('volume')) {
      chart.addHistogramSeries({
        priceFormat: { type: 'volume' }, priceScaleId: 'volume',
        // scaleMargins: { top: 0.8, bottom: 0 },
      }).setData((candles as any).map((c: any) => ({
        time: c.time, value: c.volume,
        color: c.close >= c.open ? 'rgba(22,163,74,0.4)' : 'rgba(220,38,38,0.4)',
      })))
    }

    // SMAs
    const smaConfigs = [
      { id: 'sma20', period: 20, color: '#3b82f6', title: 'SMA 20' },
      { id: 'sma50', period: 50, color: '#f59e0b', title: 'SMA 50' },
      { id: 'sma100', period: 100, color: '#a855f7', title: 'SMA 100' },
      { id: 'sma200', period: 200, color: '#8b5cf6', title: 'SMA 200' },
    ]
    for (const cfg of smaConfigs) {
      if (activeIndicators.includes(cfg.id) && candles.length >= cfg.period) {
        const sma = calcSMA(closes, cfg.period)
        const s = chart.addLineSeries({ color: cfg.color, lineWidth: 1, title: cfg.title })
        s.setData(candles.filter((_, i) => sma[i] !== null).map((c, i) => {
          const validSma = sma.filter(v => v !== null)
          return { time: c.time, value: validSma[i] as number }
        }))
      }
    }

    // EMAs
    const emaConfigs = [
      { id: 'ema9',   period: 9,   color: '#f97316', title: 'EMA 9' },
      { id: 'ema20',  period: 20,  color: '#06b6d4', title: 'EMA 20' },
      { id: 'ema50',  period: 50,  color: '#ec4899', title: 'EMA 50' },
      { id: 'ema200', period: 200, color: '#14b8a6', title: 'EMA 200' },
    ]
    for (const cfg of emaConfigs) {
      if (activeIndicators.includes(cfg.id)) {
        const ema = calcEMA(closes, cfg.period)
        const s = chart.addLineSeries({ color: cfg.color, lineWidth: 1, title: cfg.title })
        s.setData(candles.map((c, i) => ({ time: c.time, value: ema[i] })))
      }
    }

    // VWAP
    if (activeIndicators.includes('vwap')) {
      let cumPV = 0, cumV = 0
      const s = chart.addLineSeries({ color: '#f97316', lineWidth: 1, lineStyle: 2, title: 'VWAP' })
      s.setData(candles.map(c => {
        cumPV += ((c.high + c.low + c.close) / 3) * c.volume
        cumV += c.volume
        return { time: c.time, value: cumPV / cumV }
      }))
    }

    // Bollinger Bands
    if (activeIndicators.includes('bb') && candles.length >= 20) {
      const upper: any[] = [], lower: any[] = [], middle: any[] = []
      for (let i = 19; i < candles.length; i++) {
        const slice = closes.slice(i - 19, i + 1)
        const mean = slice.reduce((a, b) => a + b, 0) / 20
        const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / 20)
        middle.push({ time: candles[i].time, value: mean })
        upper.push({ time: candles[i].time, value: mean + 2 * std })
        lower.push({ time: candles[i].time, value: mean - 2 * std })
      }
      chart.addLineSeries({ color: '#6366f1', lineWidth: 1, lineStyle: 2, title: 'BB Upper' }).setData(upper)
      chart.addLineSeries({ color: '#6366f1', lineWidth: 1, title: 'BB Mid' }).setData(middle)
      chart.addLineSeries({ color: '#6366f1', lineWidth: 1, lineStyle: 2, title: 'BB Lower' }).setData(lower)
    }

    // Parabolic SAR (simplified)
    if (activeIndicators.includes('psar')) {
      const psarData: any[] = []
      let af = 0.02, ep = candles[0].low, psar = candles[0].high, bull = true
      for (let i = 1; i < candles.length; i++) {
        psar = psar + af * (ep - psar)
        if (bull) {
          if (candles[i].close < psar) { bull = false; psar = ep; ep = candles[i].low; af = 0.02 }
          else { if (candles[i].high > ep) { ep = candles[i].high; af = Math.min(af + 0.02, 0.2) } }
        } else {
          if (candles[i].close > psar) { bull = true; psar = ep; ep = candles[i].high; af = 0.02 }
          else { if (candles[i].low < ep) { ep = candles[i].low; af = Math.min(af + 0.02, 0.2) } }
        }
        psarData.push({ time: candles[i].time, value: psar })
      }
      chart.addLineSeries({ color: '#fbbf24', lineWidth: 0, lineStyle: 4, title: 'PSAR' }).setData(psarData)
    }

    chart.timeScale().fitContent()

    const handleResize = () => {
      if (chartRef.current && chartInstance.current) {
        chartInstance.current.applyOptions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted, selectedStock, selectedInterval, selectedTimeframe, chartType, activeIndicators, stockInfo.price])

  useEffect(() => {
    initChart()
    return () => { if (chartInstance.current) { chartInstance.current.remove(); chartInstance.current = null } }
  }, [initChart])

  const filteredStocks = POPULAR_STOCKS.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredIndicators = ALL_INDICATORS.filter(i =>
    i.label.toLowerCase().includes(indicatorSearch.toLowerCase()) ||
    i.category.toLowerCase().includes(indicatorSearch.toLowerCase())
  )

  const filteredCategories = [...new Set(filteredIndicators.map(i => i.category))]

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 130px)', gap: 0, position: 'relative' }}>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'var(--bg-primary)', display: 'flex' }}>
          {/* Sidebar in fullscreen */}
          <div style={{ width: 200, borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--card-bg)', flexShrink: 0 }}>
            <div style={{ padding: 8 }}>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search stocks..." style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
            </div>
            {filteredStocks.map(stock => {
              const info = STOCK_DATA[stock.symbol]
              const active = selectedStock === stock.symbol
              return (
                <button key={stock.symbol} onClick={() => setSelectedStock(stock.symbol)} style={{ width: '100%', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, background: active ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderLeft: active ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{stock.symbol}</span>
                    <span style={{ fontSize: 11, color: info?.changePct >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 500 }}>{info?.changePct >= 0 ? '+' : ''}{info?.changePct?.toFixed(2)}%</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 500 }}>₹{formatPrice(info?.price || 0)}</span>
                </button>
              )
            })}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {renderChartArea()}
          </div>
        </div>
      )}

      {/* Normal layout */}
      {!isFullscreen && (
        <>
          {/* Stock list */}
          <div style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search stocks..." style={{ width: '100%', padding: '6px 8px 6px 28px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredStocks.map(stock => {
                const info = STOCK_DATA[stock.symbol]
                const active = selectedStock === stock.symbol
                return (
                  <button key={stock.symbol} onClick={() => setSelectedStock(stock.symbol)} style={{ width: '100%', padding: '9px 12px', display: 'flex', flexDirection: 'column', gap: 2, background: active ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderLeft: active ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{stock.symbol}</span>
                      <span style={{ fontSize: 11, color: info?.changePct >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>{info?.changePct >= 0 ? '+' : ''}{info?.changePct?.toFixed(2)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{stock.sector}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 500 }}>₹{formatPrice(info?.price || 0)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main chart area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {renderChartArea()}
          </div>
        </>
      )}
    </div>
  )

  function renderChartArea() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Stock info header */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedStock.slice(0, 2)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{selectedStock}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '1px 6px', borderRadius: 4 }}>NSE</span>
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{POPULAR_STOCKS.find(s => s.symbol === selectedStock)?.name}</p>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>₹{formatPrice(stockInfo.price)}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: stockInfo.changePct >= 0 ? 'var(--up)' : 'var(--down)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  {stockInfo.changePct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stockInfo.change > 0 ? '+' : ''}₹{formatPrice(Math.abs(stockInfo.change))} ({formatChangePct(stockInfo.changePct)})
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                {[['O', stockInfo.open], ['H', stockInfo.high], ['L', stockInfo.low], ['PC', stockInfo.prevClose], ['Vol', stockInfo.volume]].map(([l, v]) => (
                  <span key={l as string}>{l}: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{l === 'Vol' ? formatVolume(v as number) : `₹${formatPrice(v as number)}`}</span></span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setWatchlisted(prev => prev.includes(selectedStock) ? prev.filter(s => s !== selectedStock) : [...prev, selectedStock])} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: watchlisted.includes(selectedStock) ? '#f59e0b' : 'var(--text-muted)' }}>
              <Star size={13} fill={watchlisted.includes(selectedStock) ? '#f59e0b' : 'none'} />
            </button>
            <button style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Bell size={13} />
            </button>
            <button onClick={() => openBot(`Do a complete analysis of ${selectedStock}. Price: ₹${formatPrice(stockInfo.price)}, Change: ${formatChangePct(stockInfo.changePct)}, P/E: ${stockInfo.pe}, P/B: ${stockInfo.pb}, Market Cap: ${stockInfo.mktCap}. Give technical levels, fundamentals assessment, and investment recommendation.`)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
              <Bot size={12} /> AI Analysis
            </button>
            <button onClick={toggleFullscreen} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)', padding: '0 16px' }}>
          {['chart', 'info', 'financials'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} style={{ padding: '8px 14px', fontSize: 12, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', textTransform: 'capitalize', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--text-primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Chart toolbar */}
        {activeTab === 'chart' && (
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: 'var(--card-bg)' }}>
            {/* Chart type */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 7, padding: 2, border: '1px solid var(--border)' }}>
              {[{v:'candle',l:'Candle'},{v:'area',l:'Area'},{v:'line',l:'Line'},{v:'bar',l:'Bar'}].map(({v,l}) => (
                <button key={v} onClick={() => setChartType(v as any)} style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, border: 'none', cursor: 'pointer', background: chartType === v ? 'var(--text-primary)' : 'transparent', color: chartType === v ? 'var(--bg-primary)' : 'var(--text-muted)', fontWeight: 500 }}>{l}</button>
              ))}
            </div>

            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

            {/* Intervals */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 7, padding: 2, border: '1px solid var(--border)' }}>
              {INTERVALS.map(({label, value}) => (
                <button key={value} onClick={() => setSelectedInterval(value)} style={{ padding: '3px 8px', borderRadius: 5, fontSize: 11, border: 'none', cursor: 'pointer', background: selectedInterval === value ? 'var(--text-primary)' : 'transparent', color: selectedInterval === value ? 'var(--bg-primary)' : 'var(--text-muted)', fontWeight: 500 }}>{label}</button>
              ))}
            </div>

            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

            {/* Timeframes */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 7, padding: 2, border: '1px solid var(--border)' }}>
              {TIMEFRAMES.map(tf => (
                <button key={tf} onClick={() => setSelectedTimeframe(tf)} style={{ padding: '3px 8px', borderRadius: 5, fontSize: 11, border: 'none', cursor: 'pointer', background: selectedTimeframe === tf ? 'var(--text-primary)' : 'transparent', color: selectedTimeframe === tf ? 'var(--bg-primary)' : 'var(--text-muted)', fontWeight: 500 }}>{tf}</button>
              ))}
            </div>

            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />

            {/* Indicators button */}
            <div ref={indicatorRef} style={{ position: 'relative' }}>
              <button onClick={() => setShowIndicators(!showIndicators)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, border: '1px solid var(--border)', background: activeIndicators.length > 0 ? 'var(--text-primary)' : 'var(--bg-secondary)', color: activeIndicators.length > 0 ? 'var(--bg-primary)' : 'var(--text-muted)', cursor: 'pointer' }}>
                Indicators
                {activeIndicators.length > 0 && <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>{activeIndicators.length}</span>}
                <ChevronDown size={10} style={{ transform: showIndicators ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showIndicators && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, width: 300, zIndex: 50, borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Indicators ({ALL_INDICATORS.length})</span>
                    {activeIndicators.length > 0 && <button onClick={() => setActiveIndicators([])} style={{ fontSize: 11, color: 'var(--down)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>}
                  </div>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                    <input type="text" value={indicatorSearch} onChange={e => setIndicatorSearch(e.target.value)} placeholder="Search indicators..." style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
                  </div>
                  <div style={{ maxHeight: 360, overflowY: 'auto', padding: '4px 0' }}>
                    {filteredCategories.map(category => (
                      <div key={category}>
                        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '8px 12px 4px' }}>{category}</p>
                        {filteredIndicators.filter(i => i.category === category).map(indicator => (
                          <button key={indicator.id} onClick={() => toggleIndicator(indicator.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: activeIndicators.includes(indicator.id) ? 'var(--bg-secondary)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 14, height: 3, borderRadius: 2, background: indicator.color }} />
                              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{indicator.label}</span>
                            </div>
                            {activeIndicators.includes(indicator.id) && <Check size={13} style={{ color: 'var(--up)' }} />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active indicator pills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {activeIndicators.map(id => {
                const ind = ALL_INDICATORS.find(i => i.id === id)
                if (!ind) return null
                return (
                  <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 500, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 8, height: 2, borderRadius: 1, background: ind.color }} />
                    {ind.label}
                    <button onClick={() => toggleIndicator(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', lineHeight: 1 }}><X size={9} /></button>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Chart or Info panel */}
        {activeTab === 'chart' && (
          <div ref={chartRef} style={{ flex: 1, width: '100%', minHeight: 300 }} />
        )}

        {activeTab === 'info' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                ['Market Cap', stockInfo.mktCap],
                ['P/E Ratio', stockInfo.pe],
                ['P/B Ratio', stockInfo.pb],
                ['52W High', `₹${formatPrice(stockInfo.high * 1.15)}`],
                ['52W Low', `₹${formatPrice(stockInfo.low * 0.85)}`],
                ['Volume', formatVolume(stockInfo.volume)],
                ['Avg Volume', formatVolume(stockInfo.volume * 0.9)],
                ['Open', `₹${formatPrice(stockInfo.open)}`],
                ['Prev Close', `₹${formatPrice(stockInfo.prevClose)}`],
              ].map(([label, value]) => (
                <div key={label as string} className="card" style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Key Financial Metrics</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                ['Revenue (TTM)', '₹8.74L Cr'],
                ['Net Profit (TTM)', '₹67,845 Cr'],
                ['EBITDA Margin', '18.4%'],
                ['ROE', '16.8%'],
                ['ROCE', '14.2%'],
                ['Debt to Equity', '0.42'],
                ['Current Ratio', '1.38'],
                ['EPS (TTM)', `₹${(stockInfo.price / stockInfo.pe).toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label as string} className="card" style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => openBot(`Give me detailed financial analysis of ${selectedStock}. Include revenue trends, profit margins, debt levels, ROE, growth prospects and valuation.`)}
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
              <Bot size={14} /> Get AI Financial Analysis
            </button>
          </div>
        )}
      </div>
    )
  }
}
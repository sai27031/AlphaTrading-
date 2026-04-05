/**
 * Upstox API Integration
 * Handles authentication, REST API calls, and WebSocket feed
 */

import axios, { AxiosInstance } from 'axios'
import { Stock, Candle, Index, MarketDepth, OptionChain } from '@/types'

const UPSTOX_BASE_URL = 'https://api.upstox.com/v2'
const UPSTOX_AUTH_URL = 'https://api.upstox.com/v2/login/authorization/token'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function getUpstoxAuthURL(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.UPSTOX_API_KEY!,
    redirect_uri: process.env.UPSTOX_REDIRECT_URI!,
  })
  return `https://api.upstox.com/v2/login/authorization/dialog?${params}`
}

export async function exchangeUpstoxCode(code: string): Promise<{ access_token: string; expires_in: number }> {
  const res = await axios.post(UPSTOX_AUTH_URL, new URLSearchParams({
    code,
    client_id: process.env.UPSTOX_API_KEY!,
    client_secret: process.env.UPSTOX_API_SECRET!,
    redirect_uri: process.env.UPSTOX_REDIRECT_URI!,
    grant_type: 'authorization_code',
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return res.data
}

// ─── API Client Factory ───────────────────────────────────────────────────────

export function createUpstoxClient(accessToken: string): AxiosInstance {
  return axios.create({
    baseURL: UPSTOX_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })
}

// ─── Market Data ──────────────────────────────────────────────────────────────

export async function getQuote(client: AxiosInstance, instrumentKeys: string[]): Promise<Record<string, Stock>> {
  const keys = instrumentKeys.join(',')
  const res = await client.get(`/market-quote/quotes?instrument_key=${keys}`)
  return transformQuotes(res.data.data)
}

export async function getLTP(client: AxiosInstance, instrumentKeys: string[]): Promise<Record<string, { ltp: number; change: number; changePct: number }>> {
  const keys = instrumentKeys.join(',')
  const res = await client.get(`/market-quote/ltp?instrument_key=${keys}`)
  return res.data.data
}

export async function getOHLC(client: AxiosInstance, instrumentKeys: string[]): Promise<Record<string, unknown>> {
  const keys = instrumentKeys.join(',')
  const res = await client.get(`/market-quote/ohlc?instrument_key=${keys}`)
  return res.data.data
}

export async function getHistoricalCandles(
  client: AxiosInstance,
  instrumentKey: string,
  interval: '1minute' | '30minute' | 'day' | 'week' | 'month',
  from: string,
  to: string
): Promise<Candle[]> {
  const res = await client.get(`/historical-candle/${instrumentKey}/${interval}/${to}/${from}`)
  const candles = res.data.data.candles
  return candles.map((c: number[]) => ({
    time: new Date(c[0]).getTime() / 1000,
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
    volume: c[5],
  }))
}

export async function getIntraDayCandles(
  client: AxiosInstance,
  instrumentKey: string,
  interval: '1minute' | '30minute'
): Promise<Candle[]> {
  const res = await client.get(`/historical-candle/intraday/${instrumentKey}/${interval}`)
  const candles = res.data.data.candles
  return candles.map((c: number[]) => ({
    time: new Date(c[0]).getTime() / 1000,
    open: c[1],
    high: c[2],
    low: c[3],
    close: c[4],
    volume: c[5],
  }))
}

export async function getMarketDepth(client: AxiosInstance, instrumentKey: string): Promise<MarketDepth> {
  const res = await client.get(`/market-quote/depth?instrument_key=${instrumentKey}`)
  const d = res.data.data[instrumentKey]
  return { buy: d.depth.buy, sell: d.depth.sell }
}

export async function getOptionChain(client: AxiosInstance, instrumentKey: string, expiry: string): Promise<OptionChain> {
  const res = await client.get(`/option/chain?instrument_key=${instrumentKey}&expiry_date=${expiry}`)
  return transformOptionChain(res.data.data)
}

export async function getOptionContracts(client: AxiosInstance, instrumentKey: string): Promise<{ expiries: string[] }> {
  const res = await client.get(`/option/contract?instrument_key=${instrumentKey}`)
  return { expiries: res.data.data.map((d: { expiry: string }) => d.expiry) }
}

// ─── Indices ──────────────────────────────────────────────────────────────────

// Key instrument keys for major indices
export const INDEX_KEYS = {
  NIFTY50: 'NSE_INDEX|Nifty 50',
  SENSEX: 'BSE_INDEX|SENSEX',
  NIFTYBANK: 'NSE_INDEX|Nifty Bank',
  NIFTYMIDCAP: 'NSE_INDEX|NIFTY MIDCAP 100',
  NIFTYIT: 'NSE_INDEX|Nifty IT',
  NIFTYPHARMA: 'NSE_INDEX|Nifty Pharma',
  VIX: 'NSE_INDEX|India VIX',
}

export async function getIndices(client: AxiosInstance): Promise<Index[]> {
  const keys = Object.values(INDEX_KEYS).join(',')
  const res = await client.get(`/market-quote/quotes?instrument_key=${keys}`)
  return Object.entries(res.data.data).map(([key, data]) => transformIndex(key, data as Record<string, unknown>))
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getPortfolioHoldings(client: AxiosInstance) {
  const res = await client.get('/portfolio/long-term-holdings')
  return res.data.data
}

export async function getPositions(client: AxiosInstance) {
  const res = await client.get('/portfolio/short-term-positions')
  return res.data.data
}

export async function getFunds(client: AxiosInstance) {
  const res = await client.get('/user/get-funds-and-margin')
  return res.data.data
}

// ─── Instrument Search ────────────────────────────────────────────────────────

export async function searchInstruments(query: string, exchange?: 'NSE' | 'BSE'): Promise<{ name: string; symbol: string; instrumentKey: string }[]> {
  // Upstox instrument master file is CSV — this uses their search endpoint
  const res = await axios.get(`${UPSTOX_BASE_URL}/instruments/search?q=${encodeURIComponent(query)}${exchange ? `&exchange=${exchange}` : ''}`)
  return res.data.data?.slice(0, 10) || []
}

// ─── WebSocket Feed ───────────────────────────────────────────────────────────

export class UpstoxWebSocket {
  private ws: WebSocket | null = null
  private accessToken: string
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private pingTimer: ReturnType<typeof setInterval> | null = null

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://api.upstox.com/v2/feed/market-data-streamer/lite?token=${this.accessToken}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('[UpstoxWS] Connected')
        this.startPing()
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (e) {
          // Binary protobuf — decode if needed
        }
      }

      this.ws.onclose = () => {
        console.log('[UpstoxWS] Disconnected — reconnecting in 3s')
        this.stopPing()
        this.reconnectTimer = setTimeout(() => this.connect(), 3000)
      }

      this.ws.onerror = (err) => {
        console.error('[UpstoxWS] Error:', err)
        reject(err)
      }
    })
  }

  subscribe(instrumentKeys: string[], callback: (data: unknown) => void): void {
    instrumentKeys.forEach(key => {
      if (!this.subscribers.has(key)) this.subscribers.set(key, new Set())
      this.subscribers.get(key)!.add(callback)
    })

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        guid: `sub_${Date.now()}`,
        method: 'sub',
        data: { mode: 'full', instrumentKeys },
      }))
    }
  }

  unsubscribe(instrumentKeys: string[]): void {
    instrumentKeys.forEach(key => this.subscribers.delete(key))
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        guid: `unsub_${Date.now()}`,
        method: 'unsub',
        data: { instrumentKeys },
      }))
    }
  }

  private handleMessage(data: { instrumentKey?: string; [key: string]: unknown }): void {
    const key = data.instrumentKey
    if (key && this.subscribers.has(key)) {
      this.subscribers.get(key)!.forEach(cb => cb(data))
    }
    // Broadcast to wildcard subscribers
    if (this.subscribers.has('*')) {
      this.subscribers.get('*')!.forEach(cb => cb(data))
    }
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ method: 'heartbeat' }))
      }
    }, 30000)
  }

  private stopPing(): void {
    if (this.pingTimer) clearInterval(this.pingTimer)
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.stopPing()
    this.ws?.close()
  }
}

// ─── Transformers ─────────────────────────────────────────────────────────────

function transformQuotes(raw: Record<string, unknown>): Record<string, Stock> {
  const result: Record<string, Stock> = {}
  for (const [key, data] of Object.entries(raw)) {
    const d = data as Record<string, unknown>
    const ohlc = d.ohlc as Record<string, number>
    const q = d as Record<string, number>
    result[key] = {
      symbol: (d.symbol as string) || key.split('|')[1],
      name: (d.companyName as string) || '',
      exchange: (key.startsWith('NSE') ? 'NSE' : 'BSE') as 'NSE' | 'BSE',
      isin: (d.isin as string) || '',
      sector: '',
      industry: '',
      ltp: q.last_price,
      open: ohlc?.open || 0,
      high: ohlc?.high || 0,
      low: ohlc?.low || 0,
      close: ohlc?.close || 0,
      prevClose: q.close_price || 0,
      change: q.net_change || 0,
      changePct: ((q.net_change || 0) / (q.close_price || 1)) * 100,
      volume: q.volume || 0,
      avgVolume: 0,
      marketCap: 0,
      pe: 0, pb: 0, eps: 0, dividendYield: 0,
      week52High: q['52_week_high'] || 0,
      week52Low: q['52_week_low'] || 0,
      beta: 0,
      timestamp: Date.now(),
    }
  }
  return result
}

function transformIndex(key: string, data: Record<string, unknown>): Index {
  const d = data as Record<string, number>
  const ohlc = (data.ohlc || {}) as Record<string, number>
  return {
    name: key.split('|')[1] || key,
    symbol: key,
    value: d.last_price || 0,
    change: d.net_change || 0,
    changePct: ((d.net_change || 0) / (d.close_price || 1)) * 100,
    open: ohlc.open || 0,
    high: ohlc.high || 0,
    low: ohlc.low || 0,
    prevClose: d.close_price || 0,
    timestamp: Date.now(),
  }
}

function transformOptionChain(data: unknown[]): OptionChain {
  const items = data as Array<Record<string, unknown>>
  return {
    underlying: '',
    underlyingPrice: 0,
    expiry: '',
    strikes: items.map(item => ({
      strikePrice: item.strike_price as number,
      call: transformOption(item.call_options as Record<string, unknown>),
      put: transformOption(item.put_options as Record<string, unknown>),
    }))
  }
}

function transformOption(data: Record<string, unknown>): import('@/types').OptionData {
  const mq = (data?.market_data || {}) as Record<string, number>
  const gr = (data?.option_greeks || {}) as Record<string, number>
  return {
    oi: mq.oi || 0,
    oiChange: mq.oi_day_change || 0,
    volume: mq.volume || 0,
    iv: mq.iv || 0,
    ltp: mq.ltp || 0,
    bid: mq.bid_price || 0,
    ask: mq.ask_price || 0,
    delta: gr.delta || 0,
    gamma: gr.gamma || 0,
    theta: gr.theta || 0,
    vega: gr.vega || 0,
  }
}
// ─── Stock & Market Types ─────────────────────────────────────────────────────

export interface Stock {
  symbol: string
  name: string
  exchange: 'NSE' | 'BSE'
  isin: string
  sector: string
  industry: string
  ltp: number          // Last Traded Price
  open: number
  high: number
  low: number
  close: number
  prevClose: number
  change: number
  changePct: number
  volume: number
  avgVolume: number
  marketCap: number
  pe: number
  pb: number
  eps: number
  dividendYield: number
  week52High: number
  week52Low: number
  oi?: number          // Open Interest (F&O)
  iv?: number          // Implied Volatility
  beta: number
  timestamp: number
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Index {
  name: string
  symbol: string
  value: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  prevClose: number
  timestamp: number
}

export interface MarketDepth {
  buy: OrderLevel[]
  sell: OrderLevel[]
}

export interface OrderLevel {
  price: number
  qty: number
  orders: number
}

// ─── Portfolio Types ──────────────────────────────────────────────────────────

export interface Holding {
  id: string
  symbol: string
  name: string
  exchange: 'NSE' | 'BSE'
  qty: number
  avgBuyPrice: number
  currentPrice: number
  currentValue: number
  investedValue: number
  pnl: number
  pnlPct: number
  dayChange: number
  dayChangePct: number
}

export interface Transaction {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  qty: number
  price: number
  date: string
  exchange: 'NSE' | 'BSE'
  brokerage: number
  notes?: string
}

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalPnL: number
  totalPnLPct: number
  dayPnL: number
  dayPnLPct: number
  holdings: Holding[]
}

// ─── IPO Types ────────────────────────────────────────────────────────────────

export interface IPO {
  id: string
  name: string
  symbol?: string
  exchange: 'NSE' | 'BSE' | 'Both'
  openDate: string
  closeDate: string
  listingDate?: string
  priceMin: number
  priceMax: number
  lotSize: number
  gmp?: number          // Grey Market Premium
  subscriptionStatus?: SubscriptionData
  status: 'upcoming' | 'open' | 'closed' | 'listed'
  type: 'mainboard' | 'sme'
  listingPrice?: number
  listingGain?: number
}

export interface SubscriptionData {
  total: number
  retail: number
  qib: number
  nii: number
}

// ─── F&O Types ────────────────────────────────────────────────────────────────

export interface OptionChain {
  underlying: string
  underlyingPrice: number
  expiry: string
  strikes: OptionStrike[]
}

export interface OptionStrike {
  strikePrice: number
  call: OptionData
  put: OptionData
}

export interface OptionData {
  oi: number
  oiChange: number
  volume: number
  iv: number
  ltp: number
  bid: number
  ask: number
  delta: number
  gamma: number
  theta: number
  vega: number
}

// ─── News Types ───────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  relatedSymbols: string[]
  imageUrl?: string
  category: 'market' | 'company' | 'economy' | 'global' | 'ipo'
}

// ─── Watchlist Types ──────────────────────────────────────────────────────────

export interface Watchlist {
  id: string
  name: string
  stocks: WatchlistItem[]
  createdAt: string
}

export interface WatchlistItem {
  symbol: string
  exchange: 'NSE' | 'BSE'
  alertPrice?: number
  alertType?: 'above' | 'below'
  notes?: string
}

// ─── Screener Types ───────────────────────────────────────────────────────────

export interface ScreenerFilter {
  field: string
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'between'
  value: number | [number, number]
}

export interface ScreenerResult {
  stocks: Stock[]
  total: number
  page: number
  pageSize: number
}

// ─── AI Bot Types ─────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  context?: string
}

export interface AIAnalysis {
  symbol: string
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  targetPrice: number
  stopLoss: number
  reasoning: string
  technicalSummary: string
  fundamentalSummary: string
  riskLevel: 'low' | 'medium' | 'high'
  timeHorizon: 'short' | 'medium' | 'long'
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  image?: string
  plan: 'free' | 'pro' | 'premium'
  upstoxConnected: boolean
  createdAt: string
}

// ─── WebSocket Types ──────────────────────────────────────────────────────────

export type WSEventType = 
  | 'TICK_UPDATE'
  | 'INDEX_UPDATE'
  | 'DEPTH_UPDATE'
  | 'ORDER_UPDATE'
  | 'ALERT_TRIGGER'
  | 'SUBSCRIBE'
  | 'UNSUBSCRIBE'

export interface WSMessage {
  type: WSEventType
  data: unknown
  timestamp: number
}
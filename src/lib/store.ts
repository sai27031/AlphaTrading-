import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Stock, Index, Holding, Watchlist, ChatMessage } from '@/types'

// ─── Market Store ─────────────────────────────────────────────────────────────

interface MarketStore {
  // Indices
  indices: Index[]
  setIndices: (indices: Index[]) => void
  updateIndex: (symbol: string, data: Partial<Index>) => void

  // Ticks
  ticks: Record<string, Stock>
  updateTick: (symbol: string, data: Partial<Stock>) => void
  setTicks: (ticks: Record<string, Stock>) => void

  // Subscriptions
  subscribedSymbols: Set<string>
  subscribeSymbol: (symbol: string) => void
  unsubscribeSymbol: (symbol: string) => void

  // Market status
  marketOpen: boolean
  setMarketOpen: (open: boolean) => void

  // Top movers
  topGainers: Stock[]
  topLosers: Stock[]
  setTopMovers: (gainers: Stock[], losers: Stock[]) => void

  // Most active
  mostActive: Stock[]
  setMostActive: (stocks: Stock[]) => void
}

export const useMarketStore = create<MarketStore>()(
  subscribeWithSelector((set) => ({
    indices: [],
    setIndices: (indices) => set({ indices }),
    updateIndex: (symbol, data) =>
      set((state) => ({
        indices: state.indices.map((idx) =>
          idx.symbol === symbol ? { ...idx, ...data } : idx
        ),
      })),

    ticks: {},
    updateTick: (symbol, data) =>
      set((state) => ({
        ticks: {
          ...state.ticks,
          [symbol]: { ...(state.ticks[symbol] || {}), ...data } as Stock,
        },
      })),
    setTicks: (ticks) => set({ ticks }),

    subscribedSymbols: new Set(),
    subscribeSymbol: (symbol) =>
      set((state) => ({
        subscribedSymbols: new Set([...state.subscribedSymbols, symbol]),
      })),
    unsubscribeSymbol: (symbol) =>
      set((state) => {
        const next = new Set(state.subscribedSymbols)
        next.delete(symbol)
        return { subscribedSymbols: next }
      }),

    marketOpen: false,
    setMarketOpen: (open) => set({ marketOpen: open }),

    topGainers: [],
    topLosers: [],
    setTopMovers: (topGainers, topLosers) => set({ topGainers, topLosers }),

    mostActive: [],
    setMostActive: (mostActive) => set({ mostActive }),
  }))
)

// ─── Portfolio Store ──────────────────────────────────────────────────────────

interface PortfolioStore {
  holdings: Holding[]
  setHoldings: (holdings: Holding[]) => void
  updateHolding: (symbol: string, data: Partial<Holding>) => void

  totalInvested: number
  currentValue: number
  totalPnL: number
  totalPnLPct: number
  dayPnL: number
  setPortfolioSummary: (data: { totalInvested: number; currentValue: number; totalPnL: number; totalPnLPct: number; dayPnL: number }) => void
}

export const usePortfolioStore = create<PortfolioStore>()((set) => ({
  holdings: [],
  setHoldings: (holdings) => set({ holdings }),
  updateHolding: (symbol, data) =>
    set((state) => ({
      holdings: state.holdings.map((h) =>
        h.symbol === symbol ? { ...h, ...data } : h
      ),
    })),

  totalInvested: 0,
  currentValue: 0,
  totalPnL: 0,
  totalPnLPct: 0,
  dayPnL: 0,
  setPortfolioSummary: (data) => set(data),
}))

// ─── Watchlist Store ──────────────────────────────────────────────────────────

interface WatchlistStore {
  watchlists: Watchlist[]
  activeWatchlist: string | null
  setWatchlists: (watchlists: Watchlist[]) => void
  setActiveWatchlist: (id: string) => void
  addToWatchlist: (id: string, symbol: string, exchange: 'NSE' | 'BSE') => void
  removeFromWatchlist: (id: string, symbol: string) => void
  createWatchlist: (name: string) => void
  deleteWatchlist: (id: string) => void
}

export const useWatchlistStore = create<WatchlistStore>()((set) => ({
  watchlists: [],
  activeWatchlist: null,
  setWatchlists: (watchlists) => set({ watchlists, activeWatchlist: watchlists[0]?.id || null }),
  setActiveWatchlist: (id) => set({ activeWatchlist: id }),
  addToWatchlist: (id, symbol, exchange) =>
    set((state) => ({
      watchlists: state.watchlists.map((wl) =>
        wl.id === id
          ? { ...wl, stocks: [...wl.stocks, { symbol, exchange }] }
          : wl
      ),
    })),
  removeFromWatchlist: (id, symbol) =>
    set((state) => ({
      watchlists: state.watchlists.map((wl) =>
        wl.id === id
          ? { ...wl, stocks: wl.stocks.filter((s) => s.symbol !== symbol) }
          : wl
      ),
    })),
  createWatchlist: (name) =>
    set((state) => ({
      watchlists: [
        ...state.watchlists,
        { id: `wl_${Date.now()}`, name, stocks: [], createdAt: new Date().toISOString() },
      ],
    })),
  deleteWatchlist: (id) =>
    set((state) => ({
      watchlists: state.watchlists.filter((wl) => wl.id !== id),
    })),
}))

// ─── AI Bot Store ─────────────────────────────────────────────────────────────

interface AIBotStore {
  isOpen: boolean
  messages: ChatMessage[]
  isLoading: boolean
  context: string
  toggleBot: () => void
  openBot: (context?: string) => void
  closeBot: () => void
  addMessage: (msg: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setContext: (context: string) => void
  clearMessages: () => void
}

export const useAIBotStore = create<AIBotStore>()((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  context: '',
  toggleBot: () => set((s) => ({ isOpen: !s.isOpen })),
  openBot: (context = '') => set({ isOpen: true, context }),
  closeBot: () => set({ isOpen: false }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (isLoading) => set({ isLoading }),
  setContext: (context) => set({ context }),
  clearMessages: () => set({ messages: [] }),
}))

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  selectedExchange: 'NSE' | 'BSE' | 'ALL'
  setSelectedExchange: (exchange: 'NSE' | 'BSE' | 'ALL') => void
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  selectedExchange: 'NSE',
  setSelectedExchange: (selectedExchange) => set({ selectedExchange }),
}))
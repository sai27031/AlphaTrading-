import { create } from 'zustand'

interface Index {
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

interface MarketStore {
  indices: Index[]
  setIndices: (indices: Index[]) => void
}

interface UIStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

interface AIBotStore {
  isOpen: boolean
  messages: any[]
  isLoading: boolean
  context: string
  openBot: (context?: string) => void
  closeBot: () => void
  toggleBot: () => void
  addMessage: (msg: any) => void
  setLoading: (v: boolean) => void
  clearMessages: () => void
}

export const useMarketStore = create<MarketStore>((set) => ({
  indices: [],
  setIndices: (indices) => set({ indices }),
}))

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))

export const useAIBotStore = create<AIBotStore>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  context: '',
  openBot: (context = '') => set({ isOpen: true, context }),
  closeBot: () => set({ isOpen: false, context: '' }),
  toggleBot: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}))
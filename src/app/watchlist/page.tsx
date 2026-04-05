'use client'

import { useState } from 'react'
import { Plus, Star, Trash2, Bell, BellOff, Bot, TrendingUp, TrendingDown, X, Search } from 'lucide-react'
import { formatPrice, formatChangePct } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface WatchItem {
  id: string
  symbol: string
  name: string
  ltp: number
  changePct: number
  change: number
  high: number
  low: number
  volume: number
  alert?: number
  alertType?: 'above' | 'below'
}

interface WatchlistGroup {
  id: string
  name: string
  items: WatchItem[]
}

const DEFAULT_LISTS: WatchlistGroup[] = [
  {
    id: '1', name: 'My Watchlist',
    items: [
      { id:'1', symbol:'RELIANCE',   name:'Reliance Industries', ltp:2943.50, changePct:1.45,  change:41.95,  high:2968.00, low:2901.20, volume:9876543  },
      { id:'2', symbol:'TCS',        name:'Tata Consultancy',    ltp:3812.30, changePct:0.62,  change:23.50,  high:3835.00, low:3780.10, volume:3456789  },
      { id:'3', symbol:'INFY',       name:'Infosys',             ltp:1423.60, changePct:2.14,  change:29.85,  high:1435.00, low:1390.20, volume:8923456  },
      { id:'4', symbol:'HDFCBANK',   name:'HDFC Bank',           ltp:1567.85, changePct:-0.91, change:-14.40, high:1590.00, low:1560.05, volume:15678900 },
    ],
  },
  {
    id: '2', name: 'IT Stocks',
    items: [
      { id:'5', symbol:'WIPRO',  name:'Wipro',        ltp:462.30,  changePct:1.87, change:8.50,  high:467.00, low:453.80, volume:6543210 },
      { id:'6', symbol:'TECHM',  name:'Tech Mahindra',ltp:1456.75, changePct:2.34, change:33.30, high:1470.00,low:1420.00,volume:3456789 },
      { id:'7', symbol:'LTIM',   name:'LTIMindtree',  ltp:5234.60, changePct:1.70, change:87.30, high:5260.00,low:5140.00,volume:1234567 },
    ],
  },
]

const SEARCH_POOL = [
  { symbol:'BAJFINANCE', name:'Bajaj Finance',   ltp:7234.90, changePct:-1.23, change:-90.10, high:7350.00,low:7200.00,volume:2345678 },
  { symbol:'SBIN',       name:'State Bank',      ltp:812.30,  changePct:1.55,  change:12.40,  high:820.00, low:798.50, volume:18234567},
  { symbol:'ITC',        name:'ITC Limited',     ltp:453.20,  changePct:0.69,  change:3.10,   high:457.00, low:449.50, volume:9876543 },
  { symbol:'AXISBANK',   name:'Axis Bank',       ltp:1089.45, changePct:1.33,  change:14.30,  high:1098.00,low:1074.20,volume:7654321 },
  { symbol:'SUNPHARMA',  name:'Sun Pharma',      ltp:1587.30, changePct:1.92,  change:29.90,  high:1600.00,low:1558.00,volume:3456789 },
  { symbol:'TATAMOTORS', name:'Tata Motors',     ltp:812.60,  changePct:3.21,  change:25.30,  high:820.00, low:785.40, volume:12456789},
  { symbol:'MARUTI',     name:'Maruti Suzuki',   ltp:11234.50,changePct:2.13,  change:234.60, high:11300.00,low:10980.00,volume:1234567},
  { symbol:'ONGC',       name:'ONGC',            ltp:267.45,  changePct:0.34,  change:0.92,   high:270.00, low:264.50, volume:7890123 },
]

export default function WatchlistPage() {
  const router = useRouter()
  const { openBot } = useAIBotStore()
  const [lists, setLists] = useState<WatchlistGroup[]>(DEFAULT_LISTS)
  const [activeList, setActiveList] = useState('1')
  const [showAdd, setShowAdd] = useState(false)
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [alertItem, setAlertItem] = useState<string | null>(null)
  const [alertPrice, setAlertPrice] = useState('')
  const [alertType, setAlertType] = useState<'above' | 'below'>('above')

  const currentList = lists.find(l => l.id === activeList)

  const filteredSearch = SEARCH_POOL.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToWatchlist = (stock: typeof SEARCH_POOL[0]) => {
    setLists(prev => prev.map(l => l.id === activeList ? {
      ...l,
      items: l.items.find(i => i.symbol === stock.symbol) ? l.items : [...l.items, { ...stock, id: Date.now().toString() }]
    } : l))
    setShowAdd(false)
    setSearchQuery('')
  }

  const removeFromList = (itemId: string) => {
    setLists(prev => prev.map(l => l.id === activeList ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l))
  }

  const createList = () => {
    if (!newListName.trim()) return
    const newList: WatchlistGroup = { id: Date.now().toString(), name: newListName.trim(), items: [] }
    setLists(prev => [...prev, newList])
    setActiveList(newList.id)
    setNewListName('')
    setShowNewList(false)
  }

  const deleteList = (id: string) => {
    if (lists.length === 1) return
    setLists(prev => prev.filter(l => l.id !== id))
    setActiveList(lists.find(l => l.id !== id)?.id || '')
  }

  const setAlert = (itemId: string) => {
    setLists(prev => prev.map(l => ({
      ...l,
      items: l.items.map(i => i.id === itemId ? { ...i, alert: parseFloat(alertPrice), alertType } : i)
    })))
    setAlertItem(null)
    setAlertPrice('')
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', height: 'calc(100vh - 130px)', gap: 12 }}>

      {/* Left - list tabs */}
      <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => setShowNewList(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', width: '100%', justifyContent: 'center', fontWeight: 500 }}>
          <Plus size={14} /> New List
        </button>

        {showNewList && (
          <div style={{ display: 'flex', gap: 6 }}>
            <input autoFocus type="text" placeholder="List name..." value={newListName} onChange={e => setNewListName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createList()}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' }} />
            <button onClick={createList} style={{ padding: '7px 10px', borderRadius: 8, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer', fontSize: 12 }}>Add</button>
          </div>
        )}

        <div className="card" style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
          {lists.map(list => (
            <div key={list.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <button onClick={() => setActiveList(list.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: activeList === list.id ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderLeft: activeList === list.id ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Star size={13} style={{ color: activeList === list.id ? 'var(--text-primary)' : 'var(--text-muted)' }} fill={activeList === list.id ? 'currentColor' : 'none'} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: activeList === list.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{list.name}</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 8 }}>{list.items.length}</span>
              </button>
              {lists.length > 1 && (
                <button onClick={() => deleteList(list.id)} style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right - watchlist items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{currentList?.name}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentList?.items.length} stocks</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => openBot(`Analyse my watchlist: ${currentList?.items.map(i => i.symbol).join(', ')}. Which ones look good to buy now?`)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
              <Bot size={13} /> AI Pick
            </button>
            <button onClick={() => setShowAdd(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <Plus size={13} /> Add Stock
            </button>
          </div>
        </div>

        <div className="card" style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ overflowY: 'auto', height: '100%' }}>
            {currentList?.items.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)', padding: 40 }}>
                <Star size={40} strokeWidth={1} />
                <p style={{ fontSize: 14 }}>No stocks in this watchlist</p>
                <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
                  <Plus size={14} /> Add stocks
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>LTP</th>
                    <th style={{ textAlign: 'right' }}>Change</th>
                    <th style={{ textAlign: 'right' }}>High</th>
                    <th style={{ textAlign: 'right' }}>Low</th>
                    <th style={{ textAlign: 'right' }}>Alert</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentList?.items.map(item => (
                    <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/charts?symbol=${item.symbol}`)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>
                            {item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.symbol}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>₹{formatPrice(item.ltp)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: item.changePct >= 0 ? 'var(--up)' : 'var(--down)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {item.changePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {formatChangePct(item.changePct)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--up)' }}>₹{formatPrice(item.high)}</td>
                      <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--down)' }}>₹{formatPrice(item.low)}</td>
                      <td style={{ textAlign: 'right', fontSize: 11, color: item.alert ? 'var(--warn)' : 'var(--text-muted)' }}>
                        {item.alert ? `${item.alertType === 'above' ? '▲' : '▼'} ₹${formatPrice(item.alert)}` : '—'}
                      </td>
                      <td onClick={e => e.stopPropagation()} style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button onClick={() => { setAlertItem(item.id); setAlertPrice(item.alert?.toString() || '') }}
                            style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: item.alert ? 'var(--warn)' : 'var(--text-muted)', display: 'flex' }}>
                            {item.alert ? <Bell size={12} /> : <BellOff size={12} />}
                          </button>
                          <button onClick={() => openBot(`Should I buy ${item.symbol} now? Current price ₹${formatPrice(item.ltp)}, change ${formatChangePct(item.changePct)}`)}
                            style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                            <Bot size={12} />
                          </button>
                          <button onClick={() => removeFromList(item.id)}
                            style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                            <X size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add stock modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 380, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Add to {currentList?.name}</h3>
              <button onClick={() => { setShowAdd(false); setSearchQuery('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input autoFocus type="text" placeholder="Search stocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {filteredSearch.map(s => (
                <button key={s.symbol} onClick={() => addToWatchlist(s)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {s.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{s.symbol}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.name}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>₹{formatPrice(s.ltp)}</p>
                    <p style={{ fontSize: 11, color: s.changePct >= 0 ? 'var(--up)' : 'var(--down)' }}>{formatChangePct(s.changePct)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert modal */}
      {alertItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 320, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Set Price Alert</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['above', 'below'] as const).map(t => (
                <button key={t} onClick={() => setAlertType(t)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: alertType === t ? 'var(--text-primary)' : 'transparent', color: alertType === t ? 'var(--bg-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                  {t === 'above' ? '▲ Above' : '▼ Below'}
                </button>
              ))}
            </div>
            <input type="number" placeholder="Enter price (₹)" value={alertPrice} onChange={e => setAlertPrice(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setAlert(alertItem)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Set Alert</button>
              <button onClick={() => setAlertItem(null)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
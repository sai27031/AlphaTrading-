'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Plus, Bot, PieChart, BarChart3, Trash2, Edit3, X } from 'lucide-react'
import { formatPrice, formatChangePct } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'

const MOCK_HOLDINGS = [
  { id:'1', symbol:'RELIANCE',   name:'Reliance Industries', qty:10, avgPrice:2750.00, currentPrice:2943.50, sector:'Energy'   },
  { id:'2', symbol:'TCS',        name:'Tata Consultancy',    qty:5,  avgPrice:3500.00, currentPrice:3812.30, sector:'IT'       },
  { id:'3', symbol:'HDFCBANK',   name:'HDFC Bank',           qty:20, avgPrice:1600.00, currentPrice:1567.85, sector:'Banking'  },
  { id:'4', symbol:'INFY',       name:'Infosys',             qty:15, avgPrice:1300.00, currentPrice:1423.60, sector:'IT'       },
  { id:'5', symbol:'TATAMOTORS', name:'Tata Motors',         qty:30, avgPrice:700.00,  currentPrice:812.60,  sector:'Auto'     },
  { id:'6', symbol:'SUNPHARMA',  name:'Sun Pharma',          qty:8,  avgPrice:1450.00, currentPrice:1587.30, sector:'Pharma'   },
]

const SECTOR_COLORS: Record<string, string> = {
  Energy: '#f59e0b', IT: '#3b82f6', Banking: '#8b5cf6',
  Auto: '#22c55e', Pharma: '#ec4899', Finance: '#06b6d4',
}

export default function PortfolioPage() {
  const { openBot } = useAIBotStore()
  const [holdings, setHoldings] = useState(MOCK_HOLDINGS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'holdings'|'analysis'>('holdings')
  const [newHolding, setNewHolding] = useState({ symbol:'', qty:'', avgPrice:'' })
  const [error, setError] = useState('')

  const totalInvested = holdings.reduce((s, h) => s + h.qty * h.avgPrice, 0)
  const currentValue = holdings.reduce((s, h) => s + h.qty * h.currentPrice, 0)
  const totalPnL = currentValue - totalInvested
  const totalPnLPct = (totalPnL / totalInvested) * 100
  const dayPnL = holdings.reduce((s, h) => s + h.qty * h.currentPrice * 0.0121, 0)

  const sectorAlloc = holdings.reduce((acc, h) => {
    const val = h.qty * h.currentPrice
    acc[h.sector] = (acc[h.sector] || 0) + val
    return acc
  }, {} as Record<string, number>)

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.qty || !newHolding.avgPrice) { setError('Fill all fields'); return }
    setHoldings(prev => [...prev, {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.symbol.toUpperCase(),
      qty: +newHolding.qty,
      avgPrice: +newHolding.avgPrice,
      currentPrice: +newHolding.avgPrice * 1.05,
      sector: 'Other',
    }])
    setNewHolding({ symbol:'', qty:'', avgPrice:'' })
    setShowAddModal(false)
    setError('')
  }

  const removeHolding = (id: string) => setHoldings(prev => prev.filter(h => h.id !== id))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Portfolio</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>{holdings.length} holdings · NSE & BSE</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>openBot(`Analyse my portfolio: ${holdings.map(h=>`${h.symbol}(${h.qty} shares, avg ₹${h.avgPrice})`).join(', ')}. Total invested ₹${(totalInvested/100000).toFixed(2)}L. Give detailed analysis, risk assessment and rebalancing suggestions.`)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:13, fontWeight:500, background:'var(--text-primary)', color:'var(--bg-primary)', border:'none', cursor:'pointer' }}>
            <Bot size={14}/> AI Analysis
          </button>
          <button onClick={()=>setShowAddModal(true)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:13, fontWeight:500, border:'1px solid var(--border)', background:'transparent', color:'var(--text-secondary)', cursor:'pointer' }}>
            <Plus size={14}/> Add Stock
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
        {[
          { label:'Total Invested',   value:`₹${(totalInvested/100000).toFixed(2)}L`,         color:'var(--text-primary)' },
          { label:'Current Value',    value:`₹${(currentValue/100000).toFixed(2)}L`,           color:'var(--text-primary)' },
          { label:'Total P&L',        value:`${totalPnL>0?'+':''}₹${(Math.abs(totalPnL)/100000).toFixed(2)}L (${totalPnLPct.toFixed(2)}%)`, color:totalPnL>=0?'var(--up)':'var(--down)' },
          { label:"Today's P&L",      value:`+₹${(dayPnL/1000).toFixed(2)}K`,                 color:'var(--up)' },
        ].map(({label,value,color})=>(
          <div key={label} className="card px-4 py-3">
            <p style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{label}</p>
            <p style={{ fontSize:20, fontWeight:700, color, fontFamily:'Space Grotesk, sans-serif' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', gap:0 }}>
        {(['holdings','analysis'] as const).map(tab=>(
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'8px 20px', fontSize:13, fontWeight:500, border:'none', background:'transparent', cursor:'pointer', textTransform:'capitalize', color:activeTab===tab?'var(--text-primary)':'var(--text-muted)', borderBottom:activeTab===tab?'2px solid var(--text-primary)':'2px solid transparent', transition:'all 0.15s' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'holdings' && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Stock</th><th>Qty</th><th>Avg Price</th><th>Current Price</th>
                <th>Invested</th><th>Current Value</th><th>P&L</th><th>P&L %</th><th></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h=>{
                const invested = h.qty * h.avgPrice
                const current = h.qty * h.currentPrice
                const pnl = current - invested
                const pnlPct = (pnl/invested)*100
                return (
                  <tr key={h.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:`${SECTOR_COLORS[h.sector] || '#666'}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:SECTOR_COLORS[h.sector]||'var(--text-primary)' }}>
                          {h.symbol.slice(0,2)}
                        </div>
                        <div>
                          <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{h.symbol}</p>
                          <p style={{ fontSize:10, color:'var(--text-muted)' }}>{h.sector}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{h.qty}</td>
                    <td style={{ fontSize:13, color:'var(--text-secondary)' }}>₹{formatPrice(h.avgPrice)}</td>
                    <td style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>₹{formatPrice(h.currentPrice)}</td>
                    <td style={{ fontSize:13, color:'var(--text-secondary)' }}>₹{(invested/1000).toFixed(1)}K</td>
                    <td style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>₹{(current/1000).toFixed(1)}K</td>
                    <td style={{ fontSize:13, fontWeight:600, color:pnl>=0?'var(--up)':'var(--down)' }}>{pnl>=0?'+':''}₹{(Math.abs(pnl)/1000).toFixed(1)}K</td>
                    <td>
                      <span style={{ fontSize:12, fontWeight:600, padding:'3px 8px', borderRadius:6, background:pnl>=0?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', color:pnl>=0?'var(--up)':'var(--down)', display:'flex', alignItems:'center', gap:2, width:'fit-content' }}>
                        {pnl>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{pnl>=0?'+':''}{pnlPct.toFixed(2)}%
                      </span>
                    </td>
                    <td>
                      <button onClick={()=>removeHolding(h.id)} style={{ padding:'4px', borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Sector allocation */}
          <div className="card p-4">
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:16, display:'flex', alignItems:'center', gap:6 }}>
              <PieChart size={15}/> Sector Allocation
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {Object.entries(sectorAlloc).sort((a,b)=>b[1]-a[1]).map(([sec,val])=>{
                const pct = (val/currentValue)*100
                return (
                  <div key={sec}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:13, color:'var(--text-primary)' }}>{sec}</span>
                      <span style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)' }}>{pct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height:6, background:'var(--bg-tertiary)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:SECTOR_COLORS[sec]||'#666', borderRadius:3, transition:'width 1s ease' }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance */}
          <div className="card p-4">
            <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:16, display:'flex', alignItems:'center', gap:6 }}>
              <BarChart3 size={15}/> Stock Performance
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[...holdings].sort((a,b)=>{
                const aP = ((a.currentPrice-a.avgPrice)/a.avgPrice)*100
                const bP = ((b.currentPrice-b.avgPrice)/b.avgPrice)*100
                return bP-aP
              }).map(h=>{
                const pct = ((h.currentPrice-h.avgPrice)/h.avgPrice)*100
                return (
                  <div key={h.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', width:80 }}>{h.symbol}</span>
                    <div style={{ flex:1, height:6, background:'var(--bg-tertiary)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min(Math.abs(pct)*3,100)}%`, background:pct>=0?'var(--up)':'var(--down)', borderRadius:3 }}/>
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color:pct>=0?'var(--up)':'var(--down)', width:60, textAlign:'right' }}>{pct>=0?'+':''}{pct.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setShowAddModal(false)}>
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:24, width:360 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'var(--text-primary)' }}>Add Stock</h3>
              <button onClick={()=>setShowAddModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={18}/></button>
            </div>
            {error && <p style={{ fontSize:12, color:'var(--down)', marginBottom:12 }}>{error}</p>}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[{label:'Symbol (e.g. RELIANCE)', key:'symbol', type:'text', placeholder:'RELIANCE'},{label:'Quantity', key:'qty', type:'number', placeholder:'10'},{label:'Avg Buy Price (₹)', key:'avgPrice', type:'number', placeholder:'2750'}].map(({label,key,type,placeholder})=>(
                <div key={key}>
                  <p style={{ fontSize:12, fontWeight:500, color:'var(--text-muted)', marginBottom:5 }}>{label}</p>
                  <input type={type} placeholder={placeholder} value={(newHolding as any)[key]} onChange={e=>setNewHolding(h=>({...h,[key]:e.target.value}))} className="input" style={{ height:36, fontSize:13 }}/>
                </div>
              ))}
              <button onClick={addHolding} style={{ padding:'10px', borderRadius:8, border:'none', background:'var(--text-primary)', color:'var(--bg-primary)', fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 }}>
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
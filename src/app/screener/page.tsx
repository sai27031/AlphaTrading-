'use client'

import { useState, useMemo } from 'react'
import { Search, TrendingUp, TrendingDown, Bot, Download, SlidersHorizontal, X } from 'lucide-react'
import { formatPrice, formatVolume } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const SECTORS = ['All', 'IT', 'Banking', 'Finance', 'Pharma', 'Auto', 'Energy', 'FMCG', 'Metals', 'Telecom', 'Infra', 'Realty']

const STOCKS = [
  { symbol: 'RELIANCE',   name: 'Reliance Industries', sector: 'Energy',   exchange: 'NSE', price: 2943.50, change: 1.45,  volume: 9876543,  mktCap: 1993000, pe: 27.4, pb: 2.1,  roe: 9.8,  de: 0.4,  rsi: 62, week52High: 3218, week52Low: 2221 },
  { symbol: 'TCS',        name: 'Tata Consultancy',    sector: 'IT',       exchange: 'NSE', price: 3812.30, change: 0.62,  volume: 3456789,  mktCap: 1382000, pe: 32.1, pb: 14.2, roe: 46.7, de: 0.0,  rsi: 55, week52High: 4592, week52Low: 3311 },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank',           sector: 'Banking',  exchange: 'NSE', price: 1567.85, change: -0.91, volume: 15678900, mktCap: 1195000, pe: 18.3, pb: 2.8,  roe: 16.5, de: 7.2,  rsi: 44, week52High: 1880, week52Low: 1363 },
  { symbol: 'INFY',       name: 'Infosys',             sector: 'IT',       exchange: 'NSE', price: 1423.60, change: 2.14,  volume: 8923456,  mktCap: 592000,  pe: 28.7, pb: 9.1,  roe: 32.4, de: 0.0,  rsi: 68, week52High: 1888, week52Low: 1284 },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank',          sector: 'Banking',  exchange: 'NSE', price: 1078.45, change: 0.54,  volume: 12345678, mktCap: 758000,  pe: 19.2, pb: 3.1,  roe: 17.8, de: 6.8,  rsi: 58, week52High: 1362, week52Low: 970  },
  { symbol: 'WIPRO',      name: 'Wipro',               sector: 'IT',       exchange: 'NSE', price: 462.30,  change: 1.87,  volume: 6543210,  mktCap: 241000,  pe: 22.4, pb: 4.3,  roe: 19.6, de: 0.1,  rsi: 61, week52High: 571,  week52Low: 416  },
  { symbol: 'TATAMOTORS', name: 'Tata Motors',         sector: 'Auto',     exchange: 'NSE', price: 812.60,  change: 3.21,  volume: 12456789, mktCap: 302000,  pe: 8.9,  pb: 2.4,  roe: 26.4, de: 1.2,  rsi: 72, week52High: 1179, week52Low: 679  },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance',       sector: 'Finance',  exchange: 'NSE', price: 7234.90, change: -1.23, volume: 2345678,  mktCap: 437000,  pe: 31.2, pb: 5.8,  roe: 21.3, de: 3.1,  rsi: 42, week52High: 8192, week52Low: 6187 },
  { symbol: 'SUNPHARMA',  name: 'Sun Pharma',          sector: 'Pharma',   exchange: 'NSE', price: 1587.30, change: 1.92,  volume: 3456789,  mktCap: 381000,  pe: 34.6, pb: 6.2,  roe: 18.9, de: 0.1,  rsi: 65, week52High: 1960, week52Low: 1337 },
  { symbol: 'SBIN',       name: 'State Bank of India', sector: 'Banking',  exchange: 'NSE', price: 812.30,  change: 1.55,  volume: 18234567, mktCap: 725000,  pe: 10.2, pb: 1.8,  roe: 18.2, de: 8.4,  rsi: 62, week52High: 912,  week52Low: 600  },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel',       sector: 'Telecom',  exchange: 'NSE', price: 1678.90, change: -0.49, volume: 4567890,  mktCap: 998000,  pe: 62.3, pb: 8.4,  roe: 13.6, de: 1.9,  rsi: 53, week52High: 1779, week52Low: 1143 },
  { symbol: 'ITC',        name: 'ITC Limited',         sector: 'FMCG',     exchange: 'NSE', price: 453.20,  change: 0.69,  volume: 9876543,  mktCap: 566000,  pe: 26.8, pb: 8.9,  roe: 33.2, de: 0.0,  rsi: 56, week52High: 528,  week52Low: 397  },
  { symbol: 'AXISBANK',   name: 'Axis Bank',           sector: 'Banking',  exchange: 'NSE', price: 1089.45, change: 1.33,  volume: 7654321,  mktCap: 335000,  pe: 14.7, pb: 2.3,  roe: 16.4, de: 7.6,  rsi: 60, week52High: 1339, week52Low: 972  },
  { symbol: 'MARUTI',     name: 'Maruti Suzuki',       sector: 'Auto',     exchange: 'NSE', price: 11234.50,change: 2.13,  volume: 1234567,  mktCap: 339000,  pe: 26.4, pb: 4.7,  roe: 18.2, de: 0.0,  rsi: 66, week52High: 13655,week52Low: 10193},
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever',  sector: 'FMCG',     exchange: 'NSE', price: 2345.80, change: -0.52, volume: 2345678,  mktCap: 550000,  pe: 52.3, pb: 12.1, roe: 23.1, de: 0.0,  rsi: 45, week52High: 2859, week52Low: 2172 },
  { symbol: 'JSWSTEEL',   name: 'JSW Steel',           sector: 'Metals',   exchange: 'NSE', price: 987.65,  change: 2.34,  volume: 5678901,  mktCap: 268000,  pe: 15.6, pb: 2.8,  roe: 18.4, de: 1.1,  rsi: 70, week52High: 1069, week52Low: 776  },
  { symbol: 'NESTLEIND',  name: 'Nestle India',        sector: 'FMCG',     exchange: 'NSE', price: 2189.40, change: 0.87,  volume: 987654,   mktCap: 211000,  pe: 68.4, pb: 71.2, roe: 104.2,de: 0.0,  rsi: 57, week52High: 2778, week52Low: 2107 },
  { symbol: 'DRREDDY',    name: "Dr. Reddy's Labs",    sector: 'Pharma',   exchange: 'NSE', price: 1234.56, change: 0.45,  volume: 2134567,  mktCap: 205000,  pe: 18.9, pb: 3.2,  roe: 17.4, de: 0.2,  rsi: 54, week52High: 1420, week52Low: 1092 },
  { symbol: 'TECHM',      name: 'Tech Mahindra',       sector: 'IT',       exchange: 'NSE', price: 1567.80, change: 1.56,  volume: 3456789,  mktCap: 152000,  pe: 35.2, pb: 5.6,  roe: 15.9, de: 0.1,  rsi: 67, week52High: 1762, week52Low: 1125 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports',         sector: 'Infra',    exchange: 'NSE', price: 1234.50, change: -0.78, volume: 4567890,  mktCap: 267000,  pe: 32.4, pb: 4.8,  roe: 14.8, de: 0.8,  rsi: 47, week52High: 1608, week52Low: 1018 },
  { symbol: 'POWERGRID',  name: 'Power Grid Corp',     sector: 'Energy',   exchange: 'NSE', price: 312.45,  change: 0.78,  volume: 6789012,  mktCap: 291000,  pe: 18.4, pb: 3.1,  roe: 17.2, de: 1.3,  rsi: 58, week52High: 366,  week52Low: 253  },
  { symbol: 'TITAN',      name: 'Titan Company',       sector: 'Metals',   exchange: 'NSE', price: 3456.70, change: 1.24,  volume: 1876543,  mktCap: 307000,  pe: 87.3, pb: 22.4, roe: 25.6, de: 0.1,  rsi: 63, week52High: 3886, week52Low: 2852 },
  { symbol: 'ONGC',       name: 'ONGC',                sector: 'Energy',   exchange: 'NSE', price: 267.45,  change: 0.34,  volume: 7890123,  mktCap: 336000,  pe: 7.8,  pb: 1.1,  roe: 14.2, de: 0.3,  rsi: 50, week52High: 345,  week52Low: 218  },
  { symbol: 'LTIM',       name: 'LTIMindtree',         sector: 'IT',       exchange: 'NSE', price: 5234.60, change: 1.70,  volume: 1234567,  mktCap: 155000,  pe: 31.8, pb: 8.2,  roe: 26.4, de: 0.0,  rsi: 64, week52High: 6769, week52Low: 4901 },
  { symbol: 'KOTAKBANK',  name: 'Kotak Mahindra Bank', sector: 'Banking',  exchange: 'NSE', price: 1923.60, change: -0.59, volume: 3456789,  mktCap: 383000,  pe: 20.1, pb: 3.4,  roe: 17.1, de: 5.9,  rsi: 48, week52High: 2063, week52Low: 1544 },
]

const PRESET_FILTERS = [
  { name: 'Overbought RSI>70', filters: { rsiMin: '70', rsiMax: '' } },
  { name: 'Oversold RSI<30',   filters: { rsiMin: '',  rsiMax: '30' } },
  { name: 'Low PE < 15',       filters: { peMin: '',   peMax: '15'  } },
  { name: 'High ROE > 20%',    filters: { roeMin: '20',roeMax: ''   } },
  { name: 'Large Cap',         filters: { mktCapMin: '500000', mktCapMax: '' } },
  { name: 'Gainers Today',     filters: { changeMin: '1', changeMax: '' } },
]

export default function ScreenerPage() {
  const router = useRouter()
  const { openBot } = useAIBotStore()
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const [sortBy, setSortBy] = useState('mktCap')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ peMin:'', peMax:'', pbMin:'', pbMax:'', roeMin:'', roeMax:'', rsiMin:'', rsiMax:'', mktCapMin:'', mktCapMax:'', changeMin:'', changeMax:'' })

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('desc') }
  }
  const filtered = useMemo(() => STOCKS.filter(s => {
    if (search && !s.symbol.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (sector !== 'All' && s.sector !== sector) return false
    if (filters.peMin && s.pe < +filters.peMin) return false
    if (filters.peMax && s.pe > +filters.peMax) return false
    if (filters.roeMin && s.roe < +filters.roeMin) return false
    if (filters.roeMax && s.roe > +filters.roeMax) return false
    if (filters.rsiMin && s.rsi < +filters.rsiMin) return false
    if (filters.rsiMax && s.rsi > +filters.rsiMax) return false
    if (filters.changeMin && s.change < +filters.changeMin) return false
    if (filters.changeMax && s.change > +filters.changeMax) return false
    if (filters.mktCapMin && s.mktCap < +filters.mktCapMin) return false
    return true
  }).sort((a, b) => {
    const av = (a as any)[sortBy] as number
    const bv = (b as any)[sortBy] as number
    return sortDir === 'asc' ? av - bv : bv - av
  }), [search, sector, filters, sortBy, sortDir])

  const activeFilters = Object.values(filters).filter(v => v !== '').length
  const clearFilters = () => setFilters({ peMin:'', peMax:'', pbMin:'', pbMax:'', roeMin:'', roeMax:'', rsiMin:'', rsiMax:'', mktCapMin:'', mktCapMax:'', changeMin:'', changeMax:'' })

  const cols = [
    { key: 'symbol', label: 'Company' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change' },
    { key: 'volume', label: 'Volume' },
    { key: 'mktCap', label: 'Mkt Cap' },
    { key: 'pe', label: 'P/E' },
    { key: 'pb', label: 'P/B' },
    { key: 'roe', label: 'ROE %' },
    { key: 'rsi', label: 'RSI' },
    { key: 'week52High', label: '52W High' },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Stock Screener</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{filtered.length} of {STOCKS.length} stocks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openBot('Screen the Indian market for the best buying opportunities right now. Consider RSI, PE ratio, ROE and recent price action.')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:13, fontWeight:500, background:'var(--text-primary)', color:'var(--bg-primary)', border:'none', cursor:'pointer' }}>
            <Bot size={14}/> AI Screen
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:13, border:'1px solid var(--border)', background:'transparent', color:'var(--text-secondary)', cursor:'pointer' }}>
            <Download size={14}/> Export CSV
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap">
        {PRESET_FILTERS.map(p => (
          <button key={p.name} onClick={() => setFilters(f => ({...f, ...p.filters}))}
            style={{ padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:500, border:'1px solid var(--border)', background:'var(--bg-secondary)', color:'var(--text-secondary)', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--text-primary)';(e.currentTarget as HTMLButtonElement).style.color='var(--text-primary)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)';(e.currentTarget as HTMLButtonElement).style.color='var(--text-secondary)'}}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="card p-3 flex gap-3 flex-wrap items-center">
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by symbol or name..."
            className="input" style={{ paddingLeft:30, height:36, fontSize:13 }}/>
        </div>
        <select value={sector} onChange={e=>setSector(e.target.value)} className="input" style={{ width:140, height:36, fontSize:13 }}>
          {SECTORS.map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={()=>setShowFilters(!showFilters)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:13, fontWeight:500, border:`1px solid ${activeFilters>0?'var(--text-primary)':'var(--border)'}`, background:activeFilters>0?'var(--text-primary)':'transparent', color:activeFilters>0?'var(--bg-primary)':'var(--text-secondary)', cursor:'pointer' }}>
          <SlidersHorizontal size={13}/> Filters {activeFilters>0&&`(${activeFilters})`}
        </button>
        {activeFilters>0&&<button onClick={clearFilters} style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 12px', borderRadius:8, fontSize:12, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'var(--down)', cursor:'pointer' }}><X size={12}/> Clear</button>}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="card p-4">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
            {[{label:'P/E Ratio',mk:'peMin',xk:'peMax'},{label:'P/B Ratio',mk:'pbMin',xk:'pbMax'},{label:'ROE (%)',mk:'roeMin',xk:'roeMax'},{label:'RSI',mk:'rsiMin',xk:'rsiMax'},{label:'Change (%)',mk:'changeMin',xk:'changeMax'}].map(({label,mk,xk})=>(
              <div key={label}>
                <p style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
                <div style={{ display:'flex', gap:6 }}>
                  <input type="number" placeholder="Min" value={(filters as any)[mk]} onChange={e=>setFilters(f=>({...f,[mk]:e.target.value}))} className="input" style={{ height:32, fontSize:12, flex:1 }}/>
                  <input type="number" placeholder="Max" value={(filters as any)[xk]} onChange={e=>setFilters(f=>({...f,[xk]:e.target.value}))} className="input" style={{ height:32, fontSize:12, flex:1 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div style={{ overflowX:'auto' }}>
          <table className="data-table" style={{ minWidth:1000 }}>
            <thead>
              <tr>
                {cols.map(col=>(
                  <th key={col.key} onClick={()=>handleSort(col.key)} style={{ cursor:'pointer', userSelect:'none', whiteSpace:'nowrap' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {col.label}
                      {sortBy===col.key&&<span>{sortDir==='asc'?'↑':'↓'}</span>}
                    </span>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(stock=>(
                <tr key={stock.symbol} style={{ cursor:'pointer' }} onClick={()=>router.push(`/charts?symbol=${stock.symbol}`)}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:'var(--bg-tertiary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--text-primary)', flexShrink:0 }}>
                        {stock.symbol.slice(0,2)}
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{stock.symbol}</p>
                        <p style={{ fontSize:10, color:'var(--text-muted)' }}>{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', fontFamily:'Space Grotesk, sans-serif' }}>₹{formatPrice(stock.price)}</td>
                  <td><span style={{ fontSize:12, fontWeight:600, color:stock.change>=0?'var(--up)':'var(--down)', display:'flex', alignItems:'center', gap:3 }}>{stock.change>=0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{stock.change>0?'+':''}{stock.change.toFixed(2)}%</span></td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{formatVolume(stock.volume)}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>₹{(stock.mktCap/100).toFixed(0)}Cr</td>
                  <td style={{ fontSize:12, fontWeight:500, color:stock.pe<15?'var(--up)':stock.pe>50?'var(--down)':'var(--text-secondary)' }}>{stock.pe.toFixed(1)}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{stock.pb.toFixed(1)}</td>
                  <td style={{ fontSize:12, fontWeight:500, color:stock.roe>20?'var(--up)':'var(--text-secondary)' }}>{stock.roe.toFixed(1)}%</td>
                  <td><span style={{ fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:6, background:stock.rsi>=70?'rgba(239,68,68,0.1)':stock.rsi<=30?'rgba(34,197,94,0.1)':'var(--bg-secondary)', color:stock.rsi>=70?'var(--down)':stock.rsi<=30?'var(--up)':'var(--text-secondary)' }}>{stock.rsi}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>₹{formatPrice(stock.week52High)}</td>
                  <td onClick={e=>{e.stopPropagation();openBot(`Analyse ${stock.symbol}: PE ${stock.pe}, ROE ${stock.roe}%, RSI ${stock.rsi}. Buy or avoid?`)}}>
                    <button style={{ padding:'3px 8px', borderRadius:6, fontSize:11, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:3 }}>
                      <Bot size={11}/> AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div style={{ textAlign:'center', padding:48, color:'var(--text-muted)', fontSize:14 }}>No stocks match your filters.</div>}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Calendar, TrendingUp, TrendingDown, Bot, ChevronRight, Info, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useAIBotStore } from '@/lib/store'

const IPOS = [
  { id:'1', name:'Ola Electric Mobility', symbol:'OLAELEC',  type:'mainboard', status:'open',    exchange:'NSE',  openDate:'2026-03-20', closeDate:'2026-03-22', listingDate:'2026-03-27', priceMin:72,    priceMax:76,    lotSize:195,  gmp:12,   total:4.2, retail:3.1, qib:5.8, nii:2.9, category:'Auto/EV' },
  { id:'2', name:'Hexaware Technologies', symbol:'HEXAWARE',  type:'mainboard', status:'open',    exchange:'NSE',  openDate:'2026-03-19', closeDate:'2026-03-21', listingDate:'2026-03-26', priceMin:674,   priceMax:708,   lotSize:21,   gmp:85,   total:6.1, retail:4.8, qib:8.2, nii:5.3, category:'IT' },
  { id:'3', name:'Stallion India Fluorochemicals', symbol:'STALLION', type:'sme', status:'upcoming', exchange:'BSE', openDate:'2026-03-25', closeDate:'2026-03-27', listingDate:'2026-04-01', priceMin:85, priceMax:90, lotSize:1600, gmp:18, total:0, retail:0, qib:0, nii:0, category:'Chemicals' },
  { id:'4', name:'Vikram Solar',           symbol:'VIKRAMSOL', type:'mainboard', status:'upcoming', exchange:'NSE', openDate:'2026-03-28', closeDate:'2026-04-01', listingDate:'2026-04-07', priceMin:280,   priceMax:295,   lotSize:50,   gmp:0,    total:0, retail:0, qib:0, nii:0, category:'Renewable' },
  { id:'5', name:'Swiggy',                 symbol:'SWIGGY',    type:'mainboard', status:'closed',   exchange:'NSE', openDate:'2026-03-06', closeDate:'2026-03-08', listingDate:'2026-03-13', priceMin:371,   priceMax:390,   lotSize:38,   gmp:-8,   total:3.6, retail:1.1, qib:6.9, nii:2.4, category:'Food Tech',  listingPrice:420, listingGain:7.69 },
  { id:'6', name:'NTPC Green Energy',      symbol:'NTPCGREEN', type:'mainboard', status:'closed',   exchange:'NSE', openDate:'2026-02-19', closeDate:'2026-02-21', listingDate:'2026-02-26', priceMin:102,   priceMax:108,   lotSize:138,  gmp:4,    total:2.6, retail:1.8, qib:4.7, nii:1.9, category:'Energy',     listingPrice:111, listingGain:2.78 },
  { id:'7', name:'Bajaj Housing Finance',  symbol:'BAJAJHFL',  type:'mainboard', status:'listed',   exchange:'NSE', openDate:'2026-01-09', closeDate:'2026-01-11', listingDate:'2026-01-16', priceMin:66,    priceMax:70,    lotSize:214,  gmp:0,    total:63.6,retail:6.9,qib:197.2,nii:43.6,category:'Finance',   listingPrice:150, listingGain:114.29 },
]

const FNO_STOCKS = [
  { symbol:'NIFTY',     expiry:'27 Mar 2026', ltp:23114.50, iv:14.23, oi:1234567,  oiChange:2.3, pcr:1.12 },
  { symbol:'BANKNIFTY', expiry:'27 Mar 2026', ltp:53427.05, iv:18.45, oi:987654,   oiChange:-1.2,pcr:0.98 },
  { symbol:'RELIANCE',  expiry:'27 Mar 2026', ltp:2943.50,  iv:22.30, oi:456789,   oiChange:3.4, pcr:1.05 },
  { symbol:'TCS',       expiry:'27 Mar 2026', ltp:3812.30,  iv:19.80, oi:234567,   oiChange:1.8, pcr:0.92 },
  { symbol:'INFY',      expiry:'27 Mar 2026', ltp:1423.60,  iv:25.40, oi:345678,   oiChange:4.2, pcr:1.18 },
  { symbol:'HDFCBANK',  expiry:'27 Mar 2026', ltp:1567.85,  iv:21.60, oi:678901,   oiChange:-0.8,pcr:0.87 },
]

const OPTION_CHAIN = [
  { strike:22900, callOI:234567, callOIChg:12345,  callLTP:245.50, callIV:16.2, putOI:123456, putOIChg:-5678, putLTP:85.30,  putIV:15.8 },
  { strike:23000, callOI:345678, callOIChg:23456,  callLTP:168.75, callIV:15.8, putOI:234567, putOIChg:12345, putLTP:118.50, putIV:16.1 },
  { strike:23100, callOI:456789, callOIChg:-12345, callLTP:105.30, callIV:15.4, putOI:345678, putOIChg:23456, putLTP:165.80, putIV:16.5, atm:true },
  { strike:23200, callOI:234567, callOIChg:8901,   callLTP:58.40,  callIV:15.1, putOI:456789, putOIChg:-8901, putLTP:228.60, putIV:17.2 },
  { strike:23300, callOI:123456, callOIChg:4567,   callLTP:28.15,  callIV:14.8, putOI:234567, putOIChg:4567,  putLTP:308.90, putIV:17.8 },
  { strike:23400, callOI:98765,  callOIChg:2345,   callLTP:12.50,  callIV:14.5, putOI:123456, putOIChg:2345,  putLTP:398.40, putIV:18.4 },
]

type Tab = 'upcoming' | 'open' | 'closed' | 'listed' | 'fno' | 'optionchain'

export default function IPOPage() {
  const { openBot } = useAIBotStore()
  const [tab, setTab] = useState<Tab>('open')
  const [savedIPOs, setSavedIPOs] = useState<string[]>([])

  const tabs = [
    { key: 'open',        label: 'Open IPOs' },
    { key: 'upcoming',    label: 'Upcoming' },
    { key: 'closed',      label: 'Closed' },
    { key: 'listed',      label: 'Listed' },
    { key: 'fno',         label: 'F&O Stocks' },
    { key: 'optionchain', label: 'Option Chain' },
  ]

  const filtered = IPOS.filter(i => i.status === tab)

  const toggleSave = (id: string) => setSavedIPOs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const getSubsColor = (sub: number) => sub > 10 ? 'var(--up)' : sub > 3 ? 'var(--warn)' : 'var(--down)'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>IPO & F&O</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Track IPOs, Grey Market Premium and Options Chain</p>
        </div>
        <button onClick={() => openBot('Analyse current IPOs. Which ones are worth applying for? What are the GMP trends and subscription levels?')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
          <Bot size={14} /> AI IPO Analysis
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: tab === t.key ? '2px solid var(--text-primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
            {t.label}
            {t.key === 'open' && <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--up)', color: '#fff', padding: '1px 5px', borderRadius: 8 }}>{IPOS.filter(i => i.status === 'open').length}</span>}
          </button>
        ))}
      </div>

      {/* IPO list */}
      {['open', 'upcoming', 'closed', 'listed'].includes(tab) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No IPOs in this category right now.</div>
          ) : filtered.map(ipo => (
            <div key={ipo.id} className="card card-hover" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{ipo.name}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: ipo.type === 'mainboard' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', color: ipo.type === 'mainboard' ? '#3b82f6' : '#f59e0b', fontWeight: 600 }}>{ipo.type.toUpperCase()}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{ipo.category}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{ipo.exchange}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Price: <strong style={{ color: 'var(--text-primary)' }}>₹{ipo.priceMin}–{ipo.priceMax}</strong></span>
                    <span>Lot: <strong style={{ color: 'var(--text-primary)' }}>{ipo.lotSize} shares</strong></span>
                    <span>Min Investment: <strong style={{ color: 'var(--text-primary)' }}>₹{(ipo.lotSize * ipo.priceMax).toLocaleString('en-IN')}</strong></span>
                    {ipo.status === 'open' && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} /> Open: {ipo.openDate} – {ipo.closeDate}
                    </span>}
                    {ipo.listingDate && <span>Listing: <strong style={{ color: 'var(--text-primary)' }}>{ipo.listingDate}</strong></span>}
                  </div>

                  {/* GMP */}
                  {ipo.gmp !== 0 && (
                    <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 6, background: ipo.gmp > 0 ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${ipo.gmp > 0 ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: ipo.gmp > 0 ? 'var(--up)' : 'var(--down)' }}>
                        GMP: {ipo.gmp > 0 ? '+' : ''}₹{ipo.gmp} ({((ipo.gmp / ipo.priceMax) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}

                  {/* Subscription */}
                  {ipo.total > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {[['Total', ipo.total], ['Retail', ipo.retail], ['QIB', ipo.qib], ['NII', ipo.nii]].map(([label, val]) => (
                        <div key={label as string} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: getSubsColor(val as number) }}>{(val as number).toFixed(1)}x</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Listing gain */}
                  {ipo.listingGain !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Listed at ₹{ipo.listingPrice} — </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: (ipo.listingGain || 0) >= 0 ? 'var(--up)' : 'var(--down)' }}>
                        {(ipo.listingGain || 0) >= 0 ? '+' : ''}{ipo.listingGain?.toFixed(2)}% listing gain
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <button onClick={() => toggleSave(ipo.id)}
                    style={{ padding: '6px 8px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: savedIPOs.includes(ipo.id) ? '#f59e0b' : 'var(--text-muted)', display: 'flex' }}>
                    <Star size={14} fill={savedIPOs.includes(ipo.id) ? '#f59e0b' : 'none'} />
                  </button>
                  <button onClick={() => openBot(`Analyse ${ipo.name} IPO. Price band ₹${ipo.priceMin}-₹${ipo.priceMax}, GMP ${ipo.gmp > 0 ? '+' : ''}₹${ipo.gmp}. ${ipo.total > 0 ? `Subscribed ${ipo.total}x.` : ''} Should I apply? What are the risks?`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}>
                    <Bot size={12} /> Analyse
                  </button>
                  {ipo.status === 'open' && (
                    <a href={`https://www.nseindia.com/market-data/ipo`} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: 'var(--text-primary)', color: 'var(--bg-primary)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                      Apply <ChevronRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* F&O Stocks */}
      {tab === 'fno' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="text-right">LTP</th>
                <th className="text-right">Expiry</th>
                <th className="text-right">IV</th>
                <th className="text-right">OI</th>
                <th className="text-right">OI Change</th>
                <th className="text-right">PCR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {FNO_STOCKS.map(s => (
                <tr key={s.symbol}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.symbol}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>₹{formatPrice(s.ltp)}</td>
                  <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>{s.expiry}</td>
                  <td style={{ textAlign: 'right', fontSize: 12 }}><span style={{ color: s.iv > 20 ? 'var(--warn)' : 'var(--text-secondary)' }}>{s.iv.toFixed(2)}%</span></td>
                  <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{(s.oi / 100000).toFixed(2)}L</td>
                  <td style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: s.oiChange >= 0 ? 'var(--up)' : 'var(--down)' }}>{s.oiChange >= 0 ? '+' : ''}{s.oiChange}%</td>
                  <td style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: s.pcr > 1 ? 'var(--up)' : 'var(--down)' }}>{s.pcr.toFixed(2)}</td>
                  <td>
                    <button onClick={() => openBot(`Analyse F&O data for ${s.symbol}. PCR is ${s.pcr}, IV is ${s.iv}%, OI change is ${s.oiChange}%. What does this indicate about market direction?`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 11, background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      <Bot size={11} /> AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Option Chain */}
      {tab === 'optionchain' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NIFTY 50</span> · Expiry: 27 Mar 2026 · Spot: 23,114.50
            </div>
            <button onClick={() => openBot('Analyse NIFTY option chain data. What are the key support and resistance levels based on max OI? What does PCR indicate?')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
              <Bot size={13} /> Analyse Chain
            </button>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ background: 'rgba(22,163,74,0.08)', textAlign: 'right' }}>OI Change</th>
                  <th style={{ background: 'rgba(22,163,74,0.08)', textAlign: 'right' }}>OI</th>
                  <th style={{ background: 'rgba(22,163,74,0.08)', textAlign: 'right' }}>IV</th>
                  <th style={{ background: 'rgba(22,163,74,0.08)', textAlign: 'right' }}>LTP</th>
                  <th style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>STRIKE</th>
                  <th style={{ background: 'rgba(239,68,68,0.08)' }}>LTP</th>
                  <th style={{ background: 'rgba(239,68,68,0.08)' }}>IV</th>
                  <th style={{ background: 'rgba(239,68,68,0.08)' }}>OI</th>
                  <th style={{ background: 'rgba(239,68,68,0.08)' }}>OI Change</th>
                </tr>
              </thead>
              <tbody>
                {OPTION_CHAIN.map(row => (
                  <tr key={row.strike} style={{ background: row.atm ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                    <td style={{ textAlign: 'right', fontSize: 12, color: row.callOIChg >= 0 ? 'var(--up)' : 'var(--down)', background: 'rgba(22,163,74,0.03)' }}>{row.callOIChg >= 0 ? '+' : ''}{(row.callOIChg/1000).toFixed(1)}K</td>
                    <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(22,163,74,0.03)' }}>{(row.callOI/1000).toFixed(1)}K</td>
                    <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', background: 'rgba(22,163,74,0.03)' }}>{row.callIV}%</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 13, color: 'var(--up)', background: 'rgba(22,163,74,0.03)', fontFamily: 'Space Grotesk, sans-serif' }}>₹{row.callLTP}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 14, color: row.atm ? 'var(--warn)' : 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {row.strike.toLocaleString('en-IN')}
                      {row.atm && <span style={{ fontSize: 8, marginLeft: 4, color: 'var(--warn)', verticalAlign: 'super' }}>ATM</span>}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 13, color: 'var(--down)', background: 'rgba(239,68,68,0.03)', fontFamily: 'Space Grotesk, sans-serif' }}>₹{row.putLTP}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(239,68,68,0.03)' }}>{row.putIV}%</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'rgba(239,68,68,0.03)' }}>{(row.putOI/1000).toFixed(1)}K</td>
                    <td style={{ fontSize: 12, color: row.putOIChg >= 0 ? 'var(--up)' : 'var(--down)', background: 'rgba(239,68,68,0.03)' }}>{row.putOIChg >= 0 ? '+' : ''}{(row.putOIChg/1000).toFixed(1)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
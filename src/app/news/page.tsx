'use client'

import { useState } from 'react'
import { Search, Bot, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Filter, Newspaper, Globe, Building2, BarChart2 } from 'lucide-react'
import { useAIBotStore } from '@/lib/store'

const NEWS = [
  { id:'1',  title:'RBI keeps repo rate unchanged at 6.5%, maintains withdrawal of accommodation stance', summary:'The Reserve Bank of India monetary policy committee voted unanimously to hold the repo rate steady at 6.5% for the ninth consecutive time, citing sticky inflation concerns while maintaining its focus on growth.',  source:'Economic Times', time:'2 hours ago',  sentiment:'neutral',  score:0.5,  category:'economy',  symbols:['SBIN','HDFCBANK','ICICIBANK'], views:12450, image:'' },
  { id:'2',  title:'Reliance Industries Q3 results: Net profit jumps 11% YoY to ₹18,540 crore, beats estimates', summary:"Reliance Industries reported strong third-quarter earnings with net profit rising 11% year-on-year to ₹18,540 crore, driven by robust performance in its retail and digital services segments.",  source:'Moneycontrol',  time:'4 hours ago',  sentiment:'positive', score:0.85, category:'company',  symbols:['RELIANCE'], views:28900, image:'' },
  { id:'3',  title:'TCS bags ₹15,000 crore deal from European banking major, stock hits 52-week high', summary:'Tata Consultancy Services announced a mega deal worth approximately ₹15,000 crore from a leading European banking institution for digital transformation services over 5 years.',  source:'Business Standard',time:'5 hours ago',  sentiment:'positive', score:0.92, category:'company',  symbols:['TCS'], views:19800, image:'' },
  { id:'4',  title:'Nifty 50 hits fresh all-time high at 23,450; Bank Nifty up 2% on strong FII inflows', summary:'Indian equity markets surged to fresh record highs today with Nifty 50 touching 23,450 and Sensex crossing 77,000 for the first time, driven by strong buying from foreign institutional investors.',  source:'NDTV Profit',    time:'6 hours ago',  sentiment:'positive', score:0.88, category:'market',   symbols:['NIFTY50','SENSEX'], views:34200, image:'' },
  { id:'5',  title:'HDFC Bank faces NPA concerns after Q3 miss; analysts cut targets', summary:"HDFC Bank's net interest margin compressed by 10 basis points in Q3, missing analyst estimates. Several brokerages have revised down their price targets amid rising credit costs.",  source:'Mint',          time:'8 hours ago',  sentiment:'negative', score:0.25, category:'company',  symbols:['HDFCBANK'], views:15600, image:'' },
  { id:'6',  title:'IT sector faces headwinds as US recession fears grow; Infosys, Wipro under pressure', summary:"Indian IT stocks came under pressure as fresh US recession fears and slowing discretionary spending weigh on deal pipelines. Infosys and Wipro led declines in the IT index.",  source:'Reuters India',  time:'10 hours ago', sentiment:'negative', score:0.2,  category:'sector',   symbols:['INFY','WIPRO','TCS'], views:22100, image:'' },
  { id:'7',  title:'Adani Group stocks rally 4-8% after SEBI gives clean chit in Hindenburg probe', summary:'Shares of Adani Group companies surged between 4-8% after the Securities and Exchange Board of India concluded its investigation into the Hindenburg Research report, finding no evidence of stock price manipulation.',  source:'Bloomberg Quint', time:'12 hours ago', sentiment:'positive', score:0.78, category:'company',  symbols:['ADANIPORTS','ADANIENT'], views:41500, image:'' },
  { id:'8',  title:'India GDP growth forecast raised to 7.2% for FY26 by IMF; upgrades India outlook', summary:'The International Monetary Fund has raised its GDP growth forecast for India to 7.2% for fiscal year 2026, citing strong domestic consumption and government infrastructure spending.',  source:'Financial Express',time:'14 hours ago', sentiment:'positive', score:0.82, category:'economy',  symbols:[], views:18700, image:'' },
  { id:'9',  title:'Bajaj Finance Q3 profit falls 3% amid rising credit costs and NPA concerns in MSME segment', summary:"Bajaj Finance's quarterly profit fell for the first time in 12 quarters as provisions for bad loans in its micro, small and medium enterprise lending segment increased sharply.",  source:'Economic Times', time:'16 hours ago', sentiment:'negative', score:0.18, category:'company',  symbols:['BAJFINANCE'], views:14300, image:'' },
  { id:'10', title:'FII buying at record high: ₹45,000 crore net inflows in January 2026', summary:'Foreign institutional investors have pumped in a record ₹45,000 crore into Indian equity markets in January 2026, the highest monthly inflow since March 2021, signalling renewed confidence.',  source:'Mint',          time:'1 day ago',   sentiment:'positive', score:0.87, category:'market',   symbols:[], views:29800, image:'' },
  { id:'11', title:'Sun Pharma gets USFDA approval for key generic drug; stock rises 3%', summary:'Sun Pharmaceutical Industries received approval from the US Food and Drug Administration for its generic version of a blockbuster diabetes drug, opening a $400 million annual market opportunity.',  source:'Drug Regulatory', time:'1 day ago',   sentiment:'positive', score:0.83, category:'company',  symbols:['SUNPHARMA'], views:11200, image:'' },
  { id:'12', title:'Crude oil prices spike 4% on Middle East tensions; OMC stocks under pressure', summary:'Brent crude oil prices jumped over 4% to $92 per barrel amid escalating geopolitical tensions in the Middle East, putting pressure on oil marketing companies like HPCL, BPCL and IOC.',  source:'Reuters',       time:'1 day ago',   sentiment:'negative', score:0.3,  category:'global',   symbols:['ONGC','BPCL'], views:16500, image:'' },
]

const CATEGORIES = [
  { key: 'all',     label: 'All News',    icon: Newspaper },
  { key: 'market',  label: 'Market',      icon: BarChart2 },
  { key: 'company', label: 'Company',     icon: Building2 },
  { key: 'economy', label: 'Economy',     icon: Globe },
  { key: 'global',  label: 'Global',      icon: Globe },
]

export default function NewsPage() {
  const { openBot } = useAIBotStore()
  const [category, setCategory] = useState('all')
  const [sentiment, setSentiment] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = NEWS.filter(n => {
    if (category !== 'all' && n.category !== category) return false
    if (sentiment === 'positive' && n.sentiment !== 'positive') return false
    if (sentiment === 'negative' && n.sentiment !== 'negative') return false
    if (sentiment === 'neutral' && n.sentiment !== 'neutral') return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.summary.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sentimentBadge = (s: string, score: number) => {
    const configs = {
      positive: { bg: 'rgba(22,163,74,0.1)',  color: 'var(--up)',   icon: <TrendingUp size={11} />,  label: 'Bullish' },
      negative: { bg: 'rgba(239,68,68,0.1)',  color: 'var(--down)', icon: <TrendingDown size={11} />,label: 'Bearish' },
      neutral:  { bg: 'rgba(245,158,11,0.1)', color: 'var(--warn)', icon: <Minus size={11} />,        label: 'Neutral' },
    }
    const c = configs[s as keyof typeof configs]
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
        {c.icon} {c.label} {(score * 100).toFixed(0)}%
      </span>
    )
  }

  const positiveCount = NEWS.filter(n => n.sentiment === 'positive').length
  const negativeCount = NEWS.filter(n => n.sentiment === 'negative').length
  const overallSentiment = positiveCount > negativeCount ? 'Bullish' : 'Bearish'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Market News</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} stories</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: overallSentiment === 'Bullish' ? 'var(--up)' : 'var(--down)' }}>
              Market Sentiment: {overallSentiment}
            </span>
          </div>
        </div>
        <button onClick={() => openBot('Summarise today\'s top market news. What are the key themes? What should investors watch out for?')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}>
          <Bot size={14} /> News Digest
        </button>
      </div>

      {/* Sentiment bar */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Today's Market Sentiment</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{positiveCount} bullish · {negativeCount} bearish · {NEWS.length - positiveCount - negativeCount} neutral</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-tertiary)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(positiveCount / NEWS.length) * 100}%`, background: 'var(--up)', transition: 'width 0.5s' }} />
          <div style={{ width: `${((NEWS.length - positiveCount - negativeCount) / NEWS.length) * 100}%`, background: 'var(--warn)', transition: 'width 0.5s' }} />
          <div style={{ width: `${(negativeCount / NEWS.length) * 100}%`, background: 'var(--down)', transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 9, padding: 3, border: '1px solid var(--border)' }}>
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setCategory(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: category === key ? 'var(--text-primary)' : 'transparent', color: category === key ? 'var(--bg-primary)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {/* Sentiment filter */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 9, padding: 3, border: '1px solid var(--border)' }}>
          {[['all', 'All'], ['positive', '▲ Bullish'], ['negative', '▼ Bearish'], ['neutral', '— Neutral']].map(([key, label]) => (
            <button key={key} onClick={() => setSentiment(key)}
              style={{ padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: sentiment === key ? 'var(--text-primary)' : 'transparent', color: sentiment === key ? 'var(--bg-primary)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 10px 7px 28px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* News list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(news => (
          <div key={news.id} className="card card-hover" style={{ padding: '16px 18px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === news.id ? null : news.id)}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  {sentimentBadge(news.sentiment, news.score)}
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, background: 'var(--bg-tertiary)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{news.category}</span>
                  {news.symbols.length > 0 && news.symbols.map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 6 }}>{news.title}</h3>

                {expanded === news.id && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{news.summary}</p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{news.source}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {news.time}</span>
                  <span>{news.views.toLocaleString()} views</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <button onClick={e => { e.stopPropagation(); openBot(`Summarise and analyse this news: "${news.title}". How does it impact ${news.symbols.length > 0 ? news.symbols.join(', ') : 'the market'}? What should investors do?`) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <Bot size={11} /> AI Take
                </button>
                <a href="#" onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <ExternalLink size={11} /> Read
                </a>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            No news matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}
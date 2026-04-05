import { NextRequest, NextResponse } from 'next/server'

const ANGEL_API_KEY = 'Ljx312JF'

const SYMBOL_MAP: Record<string, { token: string; exchange: string }> = {
  RELIANCE:   { token: '2885',  exchange: 'NSE' },
  TCS:        { token: '11536', exchange: 'NSE' },
  HDFCBANK:   { token: '1333',  exchange: 'NSE' },
  INFY:       { token: '1594',  exchange: 'NSE' },
  ICICIBANK:  { token: '4963',  exchange: 'NSE' },
  WIPRO:      { token: '3787',  exchange: 'NSE' },
  TATAMOTORS: { token: '3456',  exchange: 'NSE' },
  BAJFINANCE: { token: '317',   exchange: 'NSE' },
  SUNPHARMA:  { token: '3351',  exchange: 'NSE' },
  ONGC:       { token: '2475',  exchange: 'NSE' },
  LTIM:       { token: '17818', exchange: 'NSE' },
  ADANIPORTS: { token: '15083', exchange: 'NSE' },
  AXISBANK:   { token: '5900',  exchange: 'NSE' },
  MARUTI:     { token: '10999', exchange: 'NSE' },
  KOTAKBANK:  { token: '1922',  exchange: 'NSE' },
  HINDUNILVR: { token: '1394',  exchange: 'NSE' },
  SBIN:       { token: '3045',  exchange: 'NSE' },
  BHARTIARTL: { token: '10604', exchange: 'NSE' },
  ITC:        { token: '1660',  exchange: 'NSE' },
  NESTLEIND:  { token: '17963', exchange: 'NSE' },
}

let cachedToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  return null
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol') || 'RELIANCE'
  const interval = req.nextUrl.searchParams.get('interval') || 'ONE_DAY'
  const fromDate = req.nextUrl.searchParams.get('from') || ''
  const toDate = req.nextUrl.searchParams.get('to') || ''

  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated', candles: [] })
  }

  const stockInfo = SYMBOL_MAP[symbol.toUpperCase()]
  if (!stockInfo) {
    return NextResponse.json({ error: 'Symbol not found', candles: [] })
  }

  try {
    const res = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '127.0.0.1',
        'X-ClientPublicIP': '122.177.245.220',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': ANGEL_API_KEY,
      },
      body: JSON.stringify({
        exchange: stockInfo.exchange,
        symboltoken: stockInfo.token,
        interval,
        fromdate: fromDate,
        todate: toDate,
      }),
    })

    const data = await res.json()
    console.log('Chart data:', JSON.stringify(data).slice(0, 200))

    if (!data?.data) {
      return NextResponse.json({ error: 'No data', candles: [] })
    }

    const candles = data.data.map((c: any[]) => ({
      time: Math.floor(new Date(c[0]).getTime() / 1000),
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
      volume: c[5],
    }))

    return NextResponse.json({ candles })
  } catch (err) {
    console.error('Chart error:', err)
    return NextResponse.json({ error: String(err), candles: [] })
  }
}

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (token) {
    cachedToken = token
    tokenExpiry = Date.now() + 3600000
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'No token' }, { status: 400 })
}

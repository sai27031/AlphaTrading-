import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ results: [] })

  const token = req.cookies.get('upstox_token')?.value
  if (!token) return NextResponse.json({ results: [] })

  try {
    const res = await fetch(
      `https://api.upstox.com/v2/market-quote/ltp?instrument_key=NSE_EQ|${encodeURIComponent(q.toUpperCase())}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )
    const data = await res.json()
    return NextResponse.json({ results: data.data ? Object.entries(data.data).map(([key, val]: [string, any]) => ({
      symbol: key.split('|')[1],
      name: key.split('|')[1],
      exchange: key.split('|')[0].replace('_EQ', ''),
      ltp: val.last_price,
      change: val.net_change,
    })) : [] })
  } catch {
    return NextResponse.json({ results: [] })
  }
}

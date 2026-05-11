import { NextRequest, NextResponse } from 'next/server'

const ANGEL_API_KEY = 'Ljx312JF'
const ANGEL_CLIENT_ID = 'T57142456'
const ANGEL_PIN = '2005'

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKEN_FILE = join(process.cwd(), '.token-cache.json')

function saveToken(token: string) {
  try {
    writeFileSync(TOKEN_FILE, JSON.stringify({ token, expiry: Date.now() + 3 * 60 * 60 * 1000 }))
  } catch (e) {}
}

function loadToken(): { token: string | null, expiry: number } {
  try {
    if (existsSync(TOKEN_FILE)) {
      const data = JSON.parse(readFileSync(TOKEN_FILE, 'utf-8'))
      return data
    }
  } catch (e) {}
  return { token: null, expiry: 0 }
}

let cachedToken: string | null = null
let tokenExpiry = 0

// Load token from file on startup
const saved = loadToken()
if (saved.token && Date.now() < saved.expiry) {
  cachedToken = saved.token
  tokenExpiry = saved.expiry
}

const INDEX_TOKENS = {
  'NSE': [
    '99926000', '99926009', '99926037', '99926074', '99919000',
    '3456', '1594', '11536', '772', '3045',
    '5900', '1333', '881', '317', '14977',
  ],
  'BSE': ['999944'],
}

const TOKEN_NAMES: Record<string, string> = {
  '99926000': 'NIFTY 50',
  '99926009': 'NIFTY BANK',
  '99926037': 'NIFTY IT',
  '99926074': 'NIFTY MIDCAP 100',
  '99919000': 'INDIA VIX',
  '999944':   'SENSEX',
}

async function loginWithTOTP(totp: string): Promise<string | null> {
  try {
    const res = await fetch('https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '127.0.0.1',
        'X-ClientPublicIP': '122.177.245.220',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': ANGEL_API_KEY,
      },
      body: JSON.stringify({ clientcode: ANGEL_CLIENT_ID, password: ANGEL_PIN, totp }),
    })
    const data = await res.json()
    if (data?.data?.jwtToken) {
      cachedToken = data.data.jwtToken
tokenExpiry = Date.now() + 3 * 60 * 60 * 1000 // 3 hours
saveToken(cachedToken)
console.log('[Angel One] Login successful')
return cachedToken
    }
    console.error('[Angel One] Login failed:', data)
    return null
  } catch (err) {
    console.error('[Angel One] Login error:', err)
    return null
  }
}

async function fetchQuotes(token: string) {
  const res = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/', {
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
    body: JSON.stringify({ mode: 'FULL', exchangeTokens: INDEX_TOKENS }),
  })

  if (res.status === 401) {
    // Token expired
    cachedToken = null
    tokenExpiry = 0
    return null
  }

  const data = await res.json()
  return data
}

export async function GET(req: NextRequest) {
  const totp = req.nextUrl.searchParams.get('totp')

  // If totp provided, login
  if (totp) {
    const token = await loginWithTOTP(totp)
    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'Login failed. Check TOTP code.' })
    }
  }

  // Check if we have a valid token
  const isTokenValid = cachedToken && Date.now() < tokenExpiry

  if (!isTokenValid && !totp) {
    return NextResponse.json({ authenticated: false, needsTotp: true, indices: [] })
  }

  if (!cachedToken) {
    return NextResponse.json({ authenticated: false, needsTotp: true, indices: [] })
  }

  try {
    const data = await fetchQuotes(cachedToken)

    if (!data) {
      // Token expired, need new TOTP
      return NextResponse.json({ authenticated: false, needsTotp: true, tokenExpired: true, indices: [] })
    }

    if (!data?.data?.fetched || data.data.fetched.length === 0) {
      console.log('[Angel One] No data returned:', JSON.stringify(data).slice(0, 200))
      return NextResponse.json({ authenticated: true, live: false, indices: [], error: 'No market data' })
    }

    const indices = data.data.fetched.map((item: any) => {
  const ltp = parseFloat(item.ltp || 0)
  const prevClose = parseFloat(item.close || 0)
  const change = parseFloat(item.netchange || 0) || (ltp - prevClose)
  const changePct = parseFloat(item.percentchange || 0) || 
    (prevClose > 0 ? ((ltp - prevClose) / prevClose) * 100 : 0)
  
  // Clean up name — remove -EQ suffix
  const rawName = TOKEN_NAMES[item.symboltoken] || item.tradingSymbol || ''
  const cleanName = rawName.replace('-EQ', '').replace('_EQ', '')

  return {
    name: cleanName,
    symbol: item.symboltoken,
    value: ltp,
    change: parseFloat(change.toFixed(2)),
    changePct: parseFloat(changePct.toFixed(2)),
    open: parseFloat(item.open || 0),
    high: parseFloat(item.high || 0),
    low: parseFloat(item.low || 0),
    prevClose,
    volume: parseInt(item.tradedVolume || 0),
    timestamp: Date.now(),
  }
})

    return NextResponse.json({ authenticated: true, live: true, indices })

  } catch (err) {
    console.error('[Market] Error:', err)
    return NextResponse.json({ authenticated: false, error: String(err), indices: [] })
  }
}

// POST to set token directly
export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.token) {
    cachedToken = body.token
    tokenExpiry = Date.now() + 3 * 60 * 60 * 1000
    return NextResponse.json({ success: true })
  }
  if (body.totp) {
    const token = await loginWithTOTP(body.totp)
    return NextResponse.json({ success: !!token, authenticated: !!token })
  }
  return NextResponse.json({ error: 'No token or totp provided' }, { status: 400 })
}
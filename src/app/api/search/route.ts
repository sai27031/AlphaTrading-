import { NextRequest, NextResponse } from 'next/server'

const STOCK_DATABASE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', token: '3456' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', token: '11536' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', token: '772' },
  { symbol: 'INFY', name: 'Infosys', exchange: 'NSE', token: '1594' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE', token: '4963' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', exchange: 'NSE', token: '1394' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', token: '3045' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', exchange: 'NSE', token: '10604' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', exchange: 'NSE', token: '317' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', token: '1922' },
  { symbol: 'WIPRO', name: 'Wipro', exchange: 'NSE', token: '3787' },
  { symbol: 'LT', name: 'Larsen & Toubro', exchange: 'NSE', token: '11483' },
  { symbol: 'AXISBANK', name: 'Axis Bank', exchange: 'NSE', token: '5900' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', exchange: 'NSE', token: '236' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', exchange: 'NSE', token: '10999' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', exchange: 'NSE', token: '3351' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', exchange: 'NSE', token: '3432' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', exchange: 'NSE', token: '11532' },
  { symbol: 'TITAN', name: 'Titan Company', exchange: 'NSE', token: '3506' },
  { symbol: 'NESTLEIND', name: 'Nestle India', exchange: 'NSE', token: '17963' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', exchange: 'NSE', token: '14977' },
  { symbol: 'NTPC', name: 'NTPC', exchange: 'NSE', token: '11630' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas', exchange: 'NSE', token: '2475' },
  { symbol: 'COALINDIA', name: 'Coal India', exchange: 'NSE', token: '20374' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', exchange: 'NSE', token: '7229' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', exchange: 'NSE', token: '15083' },
  { symbol: 'TECHM', name: 'Tech Mahindra', exchange: 'NSE', token: '13538' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', exchange: 'NSE', token: '5258' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', exchange: 'NSE', token: '11723' },
  { symbol: 'TATASTEEL', name: 'Tata Steel', exchange: 'NSE', token: '3499' },
  { symbol: 'GRASIM', name: 'Grasim Industries', exchange: 'NSE', token: '1232' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', exchange: 'NSE', token: '910' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', exchange: 'NSE', token: '16669' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', exchange: 'NSE', token: '1348' },
  { symbol: 'DRREDDY', name: 'Dr Reddys Laboratories', exchange: 'NSE', token: '881' },
  { symbol: 'CIPLA', name: 'Cipla', exchange: 'NSE', token: '694' },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories', exchange: 'NSE', token: '10940' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', exchange: 'NSE', token: '157' },
  { symbol: 'BPCL', name: 'Bharat Petroleum', exchange: 'NSE', token: '526' },
  { symbol: 'IOC', name: 'Indian Oil Corporation', exchange: 'NSE', token: '1624' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', exchange: 'NSE', token: '3432' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', exchange: 'NSE', token: '547' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries', exchange: 'NSE', token: '2664' },
  { symbol: 'HAVELLS', name: 'Havells India', exchange: 'NSE', token: '1340' },
  { symbol: 'BERGEPAINT', name: 'Berger Paints', exchange: 'NSE', token: '404' },
  { symbol: 'MCDOWELL-N', name: 'United Spirits', exchange: 'NSE', token: '11584' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products', exchange: 'NSE', token: '10099' },
  { symbol: 'DABUR', name: 'Dabur India', exchange: 'NSE', token: '772' },
  { symbol: 'MARICO', name: 'Marico', exchange: 'NSE', token: '4067' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive', exchange: 'NSE', token: '718' },
]

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q || q.length < 1) return NextResponse.json({ results: [] })

  const query = q.toUpperCase()
  const results = STOCK_DATABASE.filter(stock =>
    stock.symbol.includes(query) ||
    stock.name.toUpperCase().includes(query)
  ).slice(0, 8)

  return NextResponse.json({ results })
}
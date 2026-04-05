import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Alpha Trading AI, an expert Indian stock market analyst and financial advisor assistant embedded in a professional trading platform.

You have deep expertise in:
- NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) 
- Indian stocks, indices (Nifty 50, Sensex, Bank Nifty, etc.)
- Technical analysis (candlestick patterns, indicators like RSI, MACD, Bollinger Bands, moving averages)
- Fundamental analysis (P/E ratio, EPS, revenue growth, debt ratios)
- IPO analysis and Grey Market Premium (GMP)
- F&O (Futures & Options) trading
- Mutual funds and SIP investments
- Indian economic indicators and RBI policies
- SEBI regulations and compliance
- Sector analysis (IT, Banking, Pharma, Auto, FMCG, etc.)

Your responses should be:
- Concise but comprehensive
- Use Indian financial terminology (lakh, crore, etc.)
- Include specific data points when discussing stocks
- Provide clear buy/sell/hold recommendations when asked
- Always mention risk factors
- Use ₹ for currency
- Format numbers in Indian style (1,00,000 = 1 lakh)

Always end investment advice with a brief risk disclaimer.
Keep responses under 400 words unless asked for detailed analysis.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      return NextResponse.json({
        content: `I need an Anthropic API key to work! Please add your key to .env.local:

ANTHROPIC_API_KEY=your_key_here

Get your free API key at: https://console.anthropic.com

Once added, restart the server and I'll be ready to analyse markets for you! 🚀`
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic error:', data)
      return NextResponse.json({
        content: `API Error: ${data.error?.message || 'Unknown error'}. Please check your API key.`
      })
    }

    const content = data.content?.[0]?.text || 'Sorry, I could not generate a response.'
    return NextResponse.json({ content })

  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({
      content: 'Sorry, I encountered an error. Please try again.'
    })
  }
}
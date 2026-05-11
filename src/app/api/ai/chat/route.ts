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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10)
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq error:', data)
      return NextResponse.json({
        content: `API Error: ${data.error?.message || 'Unknown error'}.`
      })
    }

    const content = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
    return NextResponse.json({ content })

  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({
      content: 'Sorry, I encountered an error. Please try again.'
    })
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect('http://localhost:3000/?error=no_code')

  console.log('=== UPSTOX CALLBACK ===')
  console.log('Code:', code)

  try {
    const tokenRes = await fetch('https://api.upstox.com/v2/login/authorization/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        code,
        client_id: 'd963f3e9-6004-4127-bf2b-f20dfc1a5131',
        client_secret: '71fpssx74y',
        redirect_uri: 'https://dolorimetric-feeless-tonisha.ngrok-free.dev/api/auth/upstox/callback',
        grant_type: 'authorization_code',
      }).toString(),
    })

    const text = await tokenRes.text()
    console.log('Status:', tokenRes.status)
    console.log('Response:', text)

    const data = JSON.parse(text)

    if (!data.access_token) {
      return NextResponse.redirect('http://localhost:3000/?error=no_token')
    }

    console.log('SUCCESS! Token received')

    const response = NextResponse.redirect('http://localhost:3000/?connected=true')
    response.cookies.set('upstox_token', data.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    })
    return response

  } catch (err) {
    console.error('Error:', err)
    return NextResponse.redirect('http://localhost:3000/?error=exception')
  }
}

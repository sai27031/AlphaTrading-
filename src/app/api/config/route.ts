import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    upstoxKey: 'd963f3e9-6004-4127-bf2b-f20dfc1a5131',
    redirectUri: 'https://dolorimetric-feeless-tonisha.ngrok-free.dev/api/auth/upstox/callback',
  })
}

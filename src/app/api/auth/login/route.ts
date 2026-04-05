// ═══════════════════════════════════════════════════════════
// FILE 1: src/app/api/auth/login/route.ts
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'

// Simple user store - replace with Supabase/PostgreSQL in production
const USERS = [
  { id: '1', name: 'Demo User',  email: 'demo@alphatrading.in', password: 'demo123' },
  { id: '2', name: 'Test User',  email: 'test@test.com',        password: 'test123' },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const userData = { id: user.id, name: user.name, email: user.email }

    const response = NextResponse.json({ success: true, user: userData })

    // Set auth cookie
    response.cookies.set('auth_user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
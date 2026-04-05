
import { NextRequest, NextResponse } from 'next/server'

const REGISTERED_USERS: { id: string; name: string; email: string; password: string }[] = [
  { id: '1', name: 'Demo User', email: 'demo@alphatrading.in', password: 'demo123' },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check duplicate
    const existing = REGISTERED_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    )
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered. Please sign in.' },
        { status: 409 }
      )
    }

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    }
    REGISTERED_USERS.push(newUser)

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }

    const response = NextResponse.json({ success: true, user: userData })

    // Set auth cookie
    response.cookies.set('auth_user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
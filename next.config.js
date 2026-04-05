/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['logo.clearbit.com', 'assets.upstox.com'],
  },
  env: {
    UPSTOX_API_KEY: process.env.UPSTOX_API_KEY,
    UPSTOX_API_SECRET: process.env.UPSTOX_API_SECRET,
    UPSTOX_REDIRECT_URI: process.env.UPSTOX_REDIRECT_URI,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
}

module.exports = nextConfig
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Providers } from '@/components/ui/Providers'
import { Sidebar } from '@/components/ui/Sidebar'
import { Header } from '@/components/ui/Header'
import { TickerTape } from '@/components/dashboard/TickerTape'
import { AIBot } from '@/components/ai-bot/AIBot'
import '@/styles/globals.css'

const GeistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const GeistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Alpha Trading — NSE & BSE Market Intelligence',
  description: 'Professional stock market platform for NSE and BSE.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden" style={{ marginLeft: '240px' }}>
              <Header />
              <TickerTape />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </div>
            <AIBot />
          </div>
        </Providers>
      </body>
    </html>
  )
}

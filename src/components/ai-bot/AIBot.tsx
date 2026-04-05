'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, Minimize2, Maximize2, Trash2, TrendingUp, BarChart2, Briefcase, Newspaper } from 'lucide-react'
import { useAIBotStore } from '@/lib/store'
import { ChatMessage } from '@/types'
import { generateId } from '@/lib/utils'

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: 'Market summary', prompt: 'Give me a summary of today\'s Indian stock market performance. What are the key trends?' },
  { icon: BarChart2, label: 'Top opportunities', prompt: 'Which NSE stocks look like good buying opportunities right now based on technicals?' },
  { icon: Briefcase, label: 'Portfolio advice', prompt: 'What sectors should I invest in for the next 6 months given current market conditions in India?' },
  { icon: Newspaper, label: 'Market news', prompt: 'What are the major news events impacting Indian stock markets this week?' },
]

export function AIBot() {
  const { isOpen, messages, isLoading, context, toggleBot, closeBot, addMessage, setLoading, clearMessages } = useAIBotStore()
  const [input, setInput] = useState('')
  const [isMaximized, setIsMaximized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && context && messages.length === 0) {
      handleSend(context)
    }
  }, [isOpen, context])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    setInput('')

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.content || 'Sorry, I could not process your request.',
        timestamp: Date.now(),
      }
      addMessage(assistantMsg)
    } catch (err) {
      addMessage({
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your Anthropic API key in .env.local.',
        timestamp: Date.now(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleBot}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 100,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Bot size={22} />
      </button>
    )
  }

  const width = isMaximized ? '100vw' : 420
  const height = isMaximized ? '100vh' : 600
  const bottom = isMaximized ? 0 : 24
  const right = isMaximized ? 0 : 24
  const borderRadius = isMaximized ? 0 : 16

  return (
    <div
      style={{
        position: 'fixed',
        bottom,
        right,
        width,
        height,
        borderRadius,
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--text-primary)',
        color: 'var(--bg-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={17} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Alpha Trading AI</p>
            <p style={{ fontSize: 10, opacity: 0.6 }}>Powered by Claude · NSE & BSE Expert</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={clearMessages} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            <Trash2 size={14} />
          </button>
          <button onClick={() => setIsMaximized(!isMaximized)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={closeBot} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {messages.length === 0 && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Hi! I'm your Alpha Trading AI 👋</p>
              <p>I can analyse stocks, predict market trends, review your portfolio, explain charts, and answer any market questions. Try asking me:</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleSend(prompt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <Icon size={15} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--text-primary)', color: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                <Bot size={13} />
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--text-primary)', color: 'var(--bg-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bot size={13} />
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--text-muted)',
                  animation: 'pulse 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 12, padding: '8px 12px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about markets, stocks, portfolio..."
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              resize: 'none', fontSize: 13, color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxHeight: 100,
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: input.trim() && !isLoading ? 'var(--text-primary)' : 'var(--border)',
              color: input.trim() && !isLoading ? 'var(--bg-primary)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}
          >
            <Send size={14} />
          </button>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
          AI analysis is for educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
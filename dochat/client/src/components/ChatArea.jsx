import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 14,
      animation: 'fadeUp 0.2s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--sage-bg)',
          border: '1px solid var(--sage-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          flexShrink: 0,
          marginRight: 10,
          marginTop: 2,
        }}>✦</div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '10px 14px',
        borderRadius: isUser ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
        background: isUser ? 'var(--ink)' : 'var(--paper)',
        border: isUser ? 'none' : '1px solid var(--border)',
        color: isUser ? 'var(--cream)' : 'var(--ink)',
        fontSize: 13,
        lineHeight: 1.65,
        fontWeight: 300,
      }}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--sage-bg)', border: '1px solid var(--sage-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
      }}>✦</div>
      <div style={{
        padding: '10px 16px',
        background: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: '12px 12px 12px 3px',
        display: 'flex',
        gap: 5,
        alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'var(--ink-muted)',
            animation: `pulse 1.2s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

export default function ChatArea({ activeDoc }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    setMessages([])
    if (activeDoc) {
      setMessages([{
        role: 'assistant',
        content: `Document loaded — ${activeDoc.totalChunks} chunks indexed. Ask me anything about "${activeDoc.originalName}".`,
      }])
    }
  }, [activeDoc])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const q = input.trim()
    if (!q || !activeDoc || loading) return

    setMessages(prev => [...prev, { role: 'user', content: q }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post('/api/chat', {
        documentId: activeDoc._id,
        question: q,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (!activeDoc) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--ink-muted)',
      }}>
        <div style={{ fontSize: 32 }}>✦</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: 'var(--ink-light)',
          fontWeight: 400,
        }}>Select a document</div>
        <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          or upload a PDF to begin
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Doc header */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--paper)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 14,
          fontWeight: 400,
          color: 'var(--ink)',
        }}>{activeDoc.originalName}</div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--sage)',
          background: 'var(--sage-bg)',
          border: '1px solid var(--sage-border)',
          borderRadius: 20,
          padding: '2px 10px',
        }}>{activeDoc.totalChunks} chunks · Groq Llama 3</div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
      }}>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }
        `}</style>
        {messages.map((m, i) => <Message key={i} msg={m} />)}
        {loading && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end',
        background: 'var(--paper)',
        flexShrink: 0,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about this document…"
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--cream)',
            color: 'var(--ink)',
            fontSize: 13,
            resize: 'none',
            outline: 'none',
            lineHeight: 1.5,
            transition: 'border-color 0.12s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--gold)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            border: 'none',
            background: input.trim() && !loading ? 'var(--ink)' : 'var(--border)',
            color: 'var(--cream)',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.12s',
            flexShrink: 0,
          }}
        >↑</button>
      </div>
    </div>
  )
}

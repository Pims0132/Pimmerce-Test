'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2 } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hoi! Ik ben de assistent van Pimmerce. Hoe kan ik je helpen? 👋' }
  ])
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Er ging iets mis. Probeer het opnieuw.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {open && (
        <div style={{ width: 340, height: 460, background: '#fff', border: '1px solid rgba(10,10,10,.12)', boxShadow: '0 20px 80px rgba(10,10,10,.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(10,10,10,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>Pimmerce</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'none', padding: 4 }}>
              <X size={16} />
            </button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'none' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', fontSize: '13.5px', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif', fontWeight: 300, background: m.role === 'user' ? '#0a0a0a' : '#f8f6f1', color: m.role === 'user' ? '#fff' : '#0a0a0a', border: m.role === 'user' ? 'none' : '1px solid rgba(10,10,10,.08)' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#f8f6f1', width: 'fit-content', border: '1px solid rgba(10,10,10,.08)' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#8a8a8a', animation: `bounce .9s ${i*.2}s infinite`, display: 'inline-block' }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(10,10,10,.08)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }}
              placeholder="Stel een vraag..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: '#0a0a0a', background: 'transparent', fontWeight: 300 }} />
            <button onClick={send} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? '#0a0a0a' : 'rgba(10,10,10,.08)', border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'none' : 'not-allowed', transition: 'background .2s', flexShrink: 0 }}>
              {loading ? <Loader2 size={14} color="#8a8a8a" className="animate-spin" /> : <Send size={14} color={input.trim() ? '#fff' : '#8a8a8a'} />}
            </button>
          </div>
        </div>
      )}
      {/* Toggle */}
      <button onClick={() => setOpen(!open)}
        style={{ width: 52, height: 52, background: '#0a0a0a', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(10,10,10,.2)', transition: 'transform .2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
        {open
          ? <X size={20} color="#fff" />
          : <span style={{ fontSize: '18px' }}>💬</span>}
      </button>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  )
}

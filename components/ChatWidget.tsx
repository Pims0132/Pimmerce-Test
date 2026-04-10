'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hoi! Ik ben de assistent van Pimmerce. Hoe kan ik je helpen? 👋' }
  ])
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Er ging iets mis. Probeer het opnieuw.' }])
    }
    setLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

      {/* Chat venster */}
      {open && (
        <div className="w-[340px] rounded-[24px] overflow-hidden flex flex-col"
          style={{ height: '460px', background: 'rgba(4,15,28,.97)', border: '1px solid rgba(10,255,203,.2)', boxShadow: '0 24px 60px rgba(0,0,0,.6)', backdropFilter: 'blur(24px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 relative"
            style={{ borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(10,255,203,.05)' }}>
            <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'rgba(10,255,203,.15)', border: '1px solid rgba(10,255,203,.3)' }}>
                ⚡
              </div>
              <div>
                <div className="font-display font-bold text-sm" style={{ color: '#e8f0fe' }}>Pimmerce</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0affcb' }} />
                  <span className="text-[10px]" style={{ color: '#6a89aa' }}>Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: '#6a89aa', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Berichten */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: m.role === 'user' ? '#0affcb' : 'rgba(255,255,255,.06)',
                    color: m.role === 'user' ? '#020b14' : '#e8f0fe',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,.06)', borderRadius: '18px 18px 18px 4px' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#0affcb', animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#0affcb', animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#0affcb', animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder="Stel een vraag..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif' }}
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="p-1.5 rounded-xl transition-all"
                style={{ background: input.trim() && !loading ? '#0affcb' : 'rgba(255,255,255,.08)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#6a89aa' }} /> : <Send className="w-3.5 h-3.5" style={{ color: input.trim() ? '#020b14' : '#6a89aa' }} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat knop */}
      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ background: open ? 'rgba(4,15,28,.97)' : '#0affcb', boxShadow: open ? '0 0 0 1px rgba(10,255,203,.3)' : '0 0 28px rgba(10,255,203,.5)', border: open ? '1px solid rgba(10,255,203,.3)' : 'none', cursor: 'pointer' }}>
        {open
          ? <X className="w-5 h-5" style={{ color: '#0affcb' }} />
          : <MessageCircle className="w-6 h-6" style={{ color: '#020b14' }} />
        }
      </button>
    </div>
  )
}

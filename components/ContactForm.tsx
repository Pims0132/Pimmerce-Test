'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(255,255,255,.09)',
  borderRadius: '12px',
  padding: '13px 16px',
  color: '#e8f0fe',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '.09em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,.55)',
  display: 'block',
  marginBottom: '7px',
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ naam: '', email: '', bedrijf: '', dienst: '', bericht: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(10,255,203,.35)'
    e.target.style.boxShadow   = '0 0 0 3px rgba(10,255,203,.06)'
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,.09)'
    e.target.style.boxShadow   = 'none'
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card rounded-[28px] p-10 text-center relative overflow-hidden"
        style={{ borderTop: '2px solid transparent', background: 'rgba(4,15,28,.7)' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
          style={{ background: 'rgba(10,255,203,.1)', border: '2px solid rgba(10,255,203,.3)' }}>
          ✓
        </div>
        <h3 className="font-display font-bold text-[1.3rem] mb-2">Aanvraag verstuurd!</h3>
        <p style={{ color: '#6a89aa', fontSize: '.9rem', lineHeight: 1.6 }}>
          Bedankt voor je bericht. Ik neem binnen 24 uur contact met je op.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-[28px] relative overflow-hidden"
      style={{ padding: '40px', background: 'rgba(4,15,28,.7)' }}>
      {/* teal shimmer */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />

      <h2 className="font-display font-bold text-[1.5rem] tracking-tight mb-1.5">Vertel over je project</h2>
      <p className="font-light mb-7" style={{ color: '#6a89aa', fontSize: '.9rem', lineHeight: 1.6 }}>
        Vul het formulier in en ik neem zo snel mogelijk contact met je op.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">

        {/* Naam + Email */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={labelStyle}>Naam</label>
            <input type="text" value={form.naam} onChange={set('naam')} placeholder="Jouw naam" required
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label style={labelStyle}>E-mail</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jouw@email.com" required
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>

        {/* Bedrijf */}
        <div>
          <label style={labelStyle}>Bedrijf</label>
          <input type="text" value={form.bedrijf} onChange={set('bedrijf')} placeholder="Bedrijfsnaam (optioneel)"
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        {/* Dienst */}
        <div>
          <label style={labelStyle}>Dienst</label>
          <select value={form.dienst} onChange={set('dienst')}
            style={{
              ...inputStyle,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236a89aa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
            onFocus={focusStyle} onBlur={blurStyle}>
            <option value="" disabled>Kies een dienst</option>
            <option value="website">Volledige website</option>
            <option value="ai-marketing">AI Marketing</option>
            <option value="ecommerce">E-commerce optimalisatie</option>
            <option value="anders">Anders / Nog niet zeker</option>
          </select>
        </div>

        {/* Bericht */}
        <div>
          <label style={labelStyle}>Bericht</label>
          <textarea value={form.bericht} onChange={set('bericht')}
            placeholder="Vertel iets over je project, wensen of budget..."
            rows={4}
            style={{ ...inputStyle, resize: 'none', minHeight: '120px' }}
            onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        {/* Error */}
        {status === 'error' && (
          <p style={{ color: '#ff6b6b', fontSize: '.85rem' }}>
            Er ging iets mis. Probeer het opnieuw.
          </p>
        )}

        {/* Submit */}
        <button type="submit" disabled={status === 'loading'}
          className="w-full mt-1.5 rounded-full font-display font-bold text-[15px] tracking-[.02em] transition-all duration-200"
          style={{
            padding: '15px 28px',
            background: status === 'loading' ? 'rgba(10,255,203,.6)' : '#0affcb',
            color: '#020b14',
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 28px rgba(10,255,203,.35)',
          }}
          onMouseEnter={e => { if (status !== 'loading') (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(10,255,203,.45)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(10,255,203,.35)' }}>
          {status === 'loading' ? 'Versturen...' : 'Verstuur aanvraag →'}
        </button>

      </form>
    </div>
  )
}

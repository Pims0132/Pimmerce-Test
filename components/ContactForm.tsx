'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputBase: React.CSSProperties = {
  width: '100%', background: '#fff',
  border: '1px solid rgba(10,10,10,.12)', borderRadius: 0,
  padding: '13px 16px', color: '#0a0a0a',
  fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 300,
  outline: 'none', transition: 'border-color .2s',
}
const labelBase: React.CSSProperties = {
  fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase' as const,
  color: '#8a8a8a', display: 'block', marginBottom: '8px',
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ naam: '', email: '', bedrijf: '', dienst: '', bericht: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#0a0a0a'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(10,10,10,.12)'
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'success') {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(10,10,10,.1)', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, border: '1.5px solid #0a0a0a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 20px' }}>✓</div>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.5rem', color: '#0a0a0a', marginBottom: 8 }}>Aanvraag verstuurd!</h3>
        <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.6, fontWeight: 300 }}>Ik neem binnen 24 uur contact met je op.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(10,10,10,.1)', padding: 'clamp(28px,4vw,44px)' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.6rem', color: '#0a0a0a', marginBottom: 6, letterSpacing: '-.02em' }}>Vertel over je project</h2>
      <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.6, marginBottom: 28, fontWeight: 300 }}>Vul het formulier in en ik neem zo snel mogelijk contact met je op.</p>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={labelBase}>Naam</label>
            <input type="text" value={form.naam} onChange={set('naam')} placeholder="Jouw naam" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelBase}>E-mail</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jouw@email.com" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
          </div>
        </div>
        <div>
          <label style={labelBase}>Bedrijf</label>
          <input type="text" value={form.bedrijf} onChange={set('bedrijf')} placeholder="Bedrijfsnaam (optioneel)" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <label style={labelBase}>Dienst</label>
          <select value={form.dienst} onChange={set('dienst')} style={{ ...inputBase, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8a8a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36, WebkitAppearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
            <option value="" disabled>Kies een dienst</option>
            <option value="website">Volledige website</option>
            <option value="ai-marketing">AI Marketing</option>
            <option value="ecommerce">E-commerce optimalisatie</option>
            <option value="anders">Anders / Nog niet zeker</option>
          </select>
        </div>
        <div>
          <label style={labelBase}>Bericht</label>
          <textarea value={form.bericht} onChange={set('bericht')} placeholder="Vertel iets over je project, wensen of budget..." rows={4} style={{ ...inputBase, resize: 'none', minHeight: '120px' }} onFocus={onFocus} onBlur={onBlur} />
        </div>
        {status === 'error' && <p style={{ color: '#dc2626', fontSize: '.85rem', fontFamily: 'Syne, sans-serif' }}>Er ging iets mis. Probeer het opnieuw.</p>}
        <button type="submit" disabled={status === 'loading'} className="btn-dark"
          style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: status === 'loading' ? .6 : 1, cursor: status === 'loading' ? 'not-allowed' : 'none' }}>
          {status === 'loading' ? 'Versturen...' : 'Verstuur aanvraag →'}
        </button>
      </form>
    </div>
  )
}

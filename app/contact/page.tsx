'use client'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import ThreeBackground from '@/components/ThreeBackground'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

const infoItems = [
  { icon: '📍', label: 'Locatie',     value: 'Tilburg, Nederland' },
  { icon: '✉️', label: 'E-mail',      value: 'info@pimmerce.com' },
  { icon: '⚡', label: 'Reactietijd', value: 'Binnen 24 uur' },
]

const steps = [
  { step: '01', text: 'Binnen 24 uur ontvang je een persoonlijke reactie.' },
  { step: '02', text: 'We plannen een gratis kennismakingsgesprek in.' },
  { step: '03', text: 'Je ontvangt een duidelijk voorstel op maat.' },
]

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <ThreeBackground />
      <Nav />

      {/* ── HERO BLOCK ── */}
      <section className="relative z-10 overflow-hidden"
        style={{ background: '#020b14', padding: 'clamp(120px,16vh,180px) 6vw clamp(60px,8vh,100px)' }}>

        {/* Glow */}
        <div className="absolute pointer-events-none"
          style={{ top: '-200px', left: '-100px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,255,203,.05) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-[1160px] mx-auto">
          <div className="sec-label">Contact</div>

          <h1 className="font-display font-black"
            style={{ fontSize: 'clamp(3.8rem,9vw,9.5rem)', lineHeight: 0.85, letterSpacing: '-.055em', color: '#e8f0fe', maxWidth: '900px' }}>
            <span style={{ display: 'block' }}>Start een</span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,.16)' }}>nieuw</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg,#0affcb 0%,#0a8fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>project.</span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="font-light"
              style={{ color: 'rgba(255,255,255,.38)', fontSize: 'clamp(1rem,1.35vw,1.18rem)', lineHeight: 1.78, maxWidth: '460px' }}>
              Heb je een idee voor een website, AI marketing of e-commerce optimalisatie?
              Vertel over je project en ik neem zo snel mogelijk contact op.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors back-link" style={{ whiteSpace: 'nowrap' }}>
              ← Terug naar homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(10,255,203,.12), transparent)' }} />

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10"
        style={{ background: '#020b14', padding: 'clamp(60px,8vh,100px) 6vw clamp(80px,12vh,140px)' }}>

        <div className="fixed pointer-events-none z-[1]"
          style={{ top: '30%', right: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,143,255,.04) 0%, transparent 65%)' }} />

        <div className="max-w-[1160px] mx-auto grid gap-[80px] items-start"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))' }}>

          {/* LEFT: info */}
          <div>
            <p className="font-display font-bold mb-8"
              style={{ fontSize: 'clamp(1.05rem,1.7vw,1.35rem)', color: 'rgba(255,255,255,.55)', lineHeight: 1.65, maxWidth: '380px' }}>
              Ik werk persoonlijk samen met elke klant. Je praat direct met Pim, niet met een accountmanager.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {infoItems.map(item => (
                <div key={item.label}
                  className="flex items-center gap-4 px-5 py-4 rounded-[18px] glass-card info-item cursor-default">
                  <div className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[18px] flex-shrink-0"
                    style={{ background: 'rgba(10,255,203,.07)', border: '1px solid rgba(10,255,203,.14)' }}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display font-bold text-[10px] tracking-[.12em] uppercase"
                      style={{ color: '#0affcb', opacity: .75 }}>{item.label}</span>
                    <span style={{ fontSize: '.95rem', color: '#e8f0fe' }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Wat kun je verwachten */}
            <div className="rounded-[22px] p-6 glass-card" style={{ borderColor: 'rgba(10,255,203,.1)' }}>
              <div className="sec-label" style={{ marginBottom: '16px', fontSize: '10px' }}>Wat kun je verwachten?</div>
              <div className="flex flex-col gap-5">
                {steps.map(s => (
                  <div key={s.step} className="flex items-start gap-4">
                    <span className="font-display font-black text-[11px] mt-0.5 flex-shrink-0"
                      style={{ color: '#0affcb', opacity: .55 }}>{s.step}</span>
                    <p style={{ color: '#6a89aa', fontSize: '.9rem', lineHeight: 1.65 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <ContactForm />
        </div>
      </main>

      <Footer />
    </>
  )
}

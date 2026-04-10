'use client'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

const infoItems = [
  { label: 'Locatie',     value: 'Tilburg, Nederland' },
  { label: 'E-mail',      value: 'info@pimmerce.com'  },
  { label: 'Reactietijd', value: 'Binnen 24 uur'      },
]

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <Nav />

      {/* Hero */}
      <section style={{ background: '#f8f6f1', padding: 'clamp(120px,16vh,180px) 6vw clamp(60px,8vh,100px)', borderBottom: '1px solid rgba(10,10,10,.08)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="label">Contact</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(3.5rem,9vw,9rem)', lineHeight: .85, letterSpacing: '-.04em', color: '#0a0a0a', marginBottom: 'clamp(28px,4vh,44px)' }}>
            Start een<br /><em style={{ fontStyle: 'italic', color: '#8a8a8a' }}>nieuw</em><br />
            <span style={{ WebkitTextStroke: '1.5px #0a0a0a', WebkitTextFillColor: 'transparent', color: 'transparent' }}>project.</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <p style={{ color: '#8a8a8a', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', lineHeight: 1.8, maxWidth: '420px', fontWeight: 300 }}>
              Heb je een idee voor een website, AI marketing of e-commerce optimalisatie? Vertel over je project.
            </p>
            <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a8a8a', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8a8a8a' }}>
              ← Terug naar homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <main style={{ background: '#fff', padding: 'clamp(60px,8vh,100px) 6vw clamp(80px,12vh,140px)' }}>
        <div className="max-w-[1200px] mx-auto" style={{ display: 'grid', gap: 80, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', alignItems: 'start' }}>

          {/* Left */}
          <div>
            <p style={{ color: '#3a3a3a', fontSize: '1.05rem', lineHeight: 1.85, fontWeight: 300, marginBottom: 40 }}>
              Ik werk persoonlijk samen met elke klant. Je praat direct met Pim, niet met een accountmanager.
            </p>

            {/* Info list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 40, border: '1px solid rgba(10,10,10,.08)' }}>
              {infoItems.map((item, i) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < infoItems.length - 1 ? '1px solid rgba(10,10,10,.06)' : 'none' }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a8a8a' }}>{item.label}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', color: '#0a0a0a', fontWeight: 400 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#0a0a0a', paddingBottom: 12, borderBottom: '1px solid rgba(10,10,10,.08)' }}>
                Wat kun je verwachten?
              </div>
              {[
                { n: '01', t: 'Binnen 24 uur ontvang je een persoonlijke reactie.' },
                { n: '02', t: 'We plannen een gratis kennismakingsgesprek in.' },
                { n: '03', t: 'Je ontvangt een duidelijk voorstel op maat.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.4rem', color: 'rgba(10,10,10,.2)', lineHeight: 1, flexShrink: 0 }}>{s.n}</span>
                  <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{s.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

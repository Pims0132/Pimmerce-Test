'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const stats = [
  { num: '7×',  label: 'Meer online\nzichtbaarheid' },
  { num: '26+', label: 'Uur bespaard\nper maand met AI' },
  { num: '8.4', label: 'Gemiddelde\nklanttevredenheid' },
  { num: 'ISO', label: 'Veilige &\nbetrouwbare aanpak' },
]

export default function Hero() {
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollHintRef.current
    if (!el) return
    const onScroll = () => {
      el.style.opacity = String(Math.max(1 - window.scrollY / 300, 0))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      className="relative z-10 min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#020b14', padding: 'clamp(100px,13vh,150px) 6vw 0' }}
    >
      {/* Subtle teal glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 50% at 10% 90%, rgba(10,255,203,.05) 0%, transparent 65%)',
      }} />

      {/* TOP ROW */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4 mb-[clamp(48px,8vh,96px)]">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
          style={{ background: 'rgba(10,255,203,.06)', border: '1px solid rgba(10,255,203,.18)', color: '#0affcb', fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0affcb', boxShadow: '0 0 8px #0affcb', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          Digital commerce for ambitious brands
        </div>
        <div className="hidden md:flex items-center gap-5 text-[12px]" style={{ color: '#6a89aa', fontFamily: 'Syne, sans-serif', letterSpacing: '.06em' }}>
          <span>Tilburg, Nederland</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.12)', display: 'inline-block' }} />
          <span>AI · Webdesign · E-commerce</span>
        </div>
      </div>

      {/* GIANT TITLE */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h1 className="font-display font-black"
          style={{ fontSize: 'clamp(4rem,11.5vw,11rem)', lineHeight: 0.85, letterSpacing: '-.06em', color: '#e8f0fe' }}>
          <span style={{ display: 'block' }}>Digitale</span>
          <span style={{ display: 'block' }}>groei voor</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(90deg,#0affcb 0%,#0a8fff 55%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>ambitieuze</span>
          <span style={{ display: 'block', color: 'rgba(255,255,255,.15)' }}>merken.</span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-10">
          <p className="font-light" style={{ color: 'rgba(255,255,255,.42)', fontSize: 'clamp(1rem,1.35vw,1.18rem)', lineHeight: 1.78, maxWidth: '430px' }}>
            Websites, AI&nbsp;marketing en e-commerce strategie die
            niet alleen mooi ogen maar ook echt resultaat opleveren.
          </p>
          <div className="flex gap-3 flex-wrap flex-shrink-0">
            <Link href="/contact" className="btn-glow">Start een project →</Link>
            <Link href="#over-mij"  className="btn-glass">Ontdek Pimmerce</Link>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="relative z-10 mt-[clamp(48px,7vh,80px)]"
        style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 'clamp(28px,4vh,44px)', paddingBottom: 'clamp(36px,6vh,64px)' }}>
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
          {stats.map(s => (
            <div key={s.num}>
              <div className="font-display font-black" style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', lineHeight: 1, color: '#e8f0fe', letterSpacing: '-.04em' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '11.5px', color: '#6a89aa', lineHeight: 1.45, marginTop: '6px', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'pre-line' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="absolute flex items-center gap-2.5 z-10"
        style={{ bottom: 28, right: '6vw', color: 'rgba(255,255,255,.2)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', transition: 'opacity .3s' }}>
        Scroll
        <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg,transparent,#0affcb)', animation: 'slideline 2.2s ease infinite' }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideline {
          0%  { transform:scaleX(0); transform-origin:left  }
          50% { transform:scaleX(1); transform-origin:left  }
          51% { transform:scaleX(1); transform-origin:right }
          100%{ transform:scaleX(0); transform-origin:right }
        }
        @media(max-width:640px){ h1 { letter-spacing:-.04em !important; } }
      `}</style>
    </section>
  )
}

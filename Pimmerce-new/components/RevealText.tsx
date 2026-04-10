'use client'
import { useEffect, useRef } from 'react'

const TEXT = `Pimmerce combineert creativiteit met technologie om digitale ervaringen te bouwen die premium aanvoelen en gericht zijn op conversie, zichtbaarheid en groei.`

const CLIENTS = ['ALKU', 'Boerke Mutsaers', 'AI-Laaf', 'Tilburg Ventures']

export default function RevealText() {
  const sectionRef = useRef<HTMLElement>(null)
  const orbRef     = useRef<HTMLDivElement>(null)
  const wordsRef   = useRef<HTMLDivElement>(null)
  const clientsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Build word spans
    const wc = wordsRef.current
    if (wc) {
      wc.innerHTML = TEXT.trim().split(/\s+/)
        .map(w => `<span style="color:rgba(255,255,255,.07);transition:color .3s ease">${w} </span>`)
        .join('')
    }

    const onScroll = () => {
      const sec = sectionRef.current
      const orb = orbRef.current
      const wc2 = wordsRef.current
      const cl  = clientsRef.current
      if (!sec || !orb || !wc2) return

      const rect       = sec.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled   = Math.max(-rect.top, 0)
      const prog       = Math.min(scrolled / scrollable, 1)

      // Orb: starts tiny (48px), grows to cover screen
      const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.6
      const size   = 48 + prog * maxDim
      orb.style.width  = `${size}px`
      orb.style.height = `${size}px`
      orb.style.opacity = String(Math.min(prog * 5, 1))

      // Words: reveal in middle portion of scroll
      const wordProg = Math.min(Math.max((prog - 0.25) / 0.75, 0), 1)
      const spans = wc2.querySelectorAll<HTMLSpanElement>('span')
      const n = Math.floor(wordProg * spans.length)
      spans.forEach((s, i) => {
        s.style.color = i < n ? '#e8f0fe' : 'rgba(255,255,255,.07)'
      })

      // Clients: fade in near the end
      if (cl) cl.style.opacity = String(Math.min(Math.max((prog - 0.82) / 0.18, 0), 1))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} id="over-ons" className="relative z-10"
      style={{ height: '240vh', background: '#000' }}>

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Growing orb */}
        <div ref={orbRef} className="absolute rounded-full pointer-events-none"
          style={{
            width: '48px',
            height: '48px',
            background: 'radial-gradient(circle, rgba(10,255,203,.16) 0%, rgba(10,255,203,.04) 45%, transparent 70%)',
            boxShadow: '0 0 120px 60px rgba(10,255,203,.06)',
            opacity: 0,
            transition: 'width .04s linear, height .04s linear',
          }} />

        {/* Reveal text */}
        <div className="relative z-10 px-[8vw] max-w-[980px] w-full">
          <div ref={wordsRef} className="font-display font-bold"
            style={{ fontSize: 'clamp(1.7rem,3.5vw,3rem)', lineHeight: 1.38, letterSpacing: '-.03em' }} />
        </div>

        {/* Clients strip */}
        <div ref={clientsRef} className="absolute bottom-16 left-0 right-0 px-[8vw] z-10"
          style={{ opacity: 0, transition: 'opacity .5s ease' }}>
          <div className="flex flex-wrap gap-x-10 gap-y-3 items-center">
            <span style={{ fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#6a89aa', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
              Onze klanten
            </span>
            {CLIENTS.map(c => (
              <span key={c} style={{ fontSize: '13px', color: 'rgba(255,255,255,.3)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

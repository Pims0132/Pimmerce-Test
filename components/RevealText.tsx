'use client'
import { useEffect, useRef } from 'react'

const WORDS = `Pimmerce combineert creativiteit met technologie om digitale ervaringen te bouwen die premium aanvoelen en gericht zijn op conversie, zichtbaarheid en groei.`.split(' ')

const MARQUEE_ITEMS = ['Webdesign', 'AI Marketing', 'E-commerce', 'Branding', 'Tilburg', 'Resultaat', 'Strategie', 'Groei']

export default function RevealText() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef   = useRef<HTMLDivElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wc = wordsRef.current
    if (wc) {
      wc.innerHTML = WORDS.map(w =>
        `<span style="opacity:.12;transition:opacity .4s ease">${w} </span>`
      ).join('')
    }

    const onScroll = () => {
      const sec = sectionRef.current
      const bar = barRef.current
      if (!sec || !wc) return
      const rect = sec.getBoundingClientRect()
      const prog = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1)

      const spans = wc.querySelectorAll<HTMLSpanElement>('span')
      const n = Math.floor(prog * spans.length)
      spans.forEach((s, i) => { s.style.opacity = i < n ? '1' : '.12' })

      if (bar) bar.style.transform = `scaleX(${prog})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Marquee strip */}
      <div style={{ background: '#0a0a0a', padding: '14px 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', padding: '0 32px' }}>
              {item} <span style={{ color: 'rgba(255,255,255,.15)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Word reveal section */}
      <section ref={sectionRef} style={{ height: '200vh', background: '#f8f6f1', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', padding: '0 6vw' }}>

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(10,10,10,.06)' }}>
            <div ref={barRef} style={{ height: '100%', background: '#0a0a0a', transform: 'scaleX(0)', transformOrigin: 'left' }} />
          </div>

          <div className="max-w-[980px] w-full">
            <span className="label" style={{ marginBottom: '32px', display: 'flex' }}>Over Pimmerce</span>
            <div ref={wordsRef}
              style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', lineHeight: 1.4, letterSpacing: '-.02em', color: '#0a0a0a' }} />
          </div>
        </div>
      </section>
    </>
  )
}

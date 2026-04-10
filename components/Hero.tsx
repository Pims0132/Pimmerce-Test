'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Hero() {
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const lineRef     = useRef<HTMLDivElement>(null)

  const stats = [
    { val: '7',   suffix: '×',  label: 'Meer zichtbaarheid' },
    { val: '26',  suffix: '+',  label: 'Uur AI bespaard/mnd' },
    { val: '8.4', suffix: '',   label: 'Klanttevredenheid' },
    { val: '100', suffix: '%',  label: 'Persoonlijk contact' },
  ]

  useEffect(() => {
    // Animated number counters on scroll
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLSpanElement
        const target = parseFloat(el.dataset.val || '0')
        const isFloat = el.dataset.val?.includes('.') ?? false
        let start = 0
        const step = target / 40
        const tick = () => {
          start = Math.min(start + step, target)
          el.textContent = isFloat ? start.toFixed(1) : Math.floor(start).toString()
          if (start < target) requestAnimationFrame(tick)
        }
        tick()
        obs.unobserve(el)
      })
    }, { threshold: .5 })

    counterRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    // Parallax scroll on line
    const onScroll = () => {
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${Math.min(1, window.scrollY / 600)})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#f8f6f1', paddingTop: 'clamp(110px,15vh,160px)', paddingBottom: 0, paddingLeft: '6vw', paddingRight: '6vw' }}>

      {/* Top row */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-[clamp(32px,5vh,64px)]">
        <span className="label" style={{ marginBottom: 0 }}>
          Digital commerce · Tilburg
        </span>
        <div className="hidden md:flex items-center gap-2 text-[11px]"
          style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a8a8a' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0a0a0a', display: 'inline-block' }} />
          Beschikbaar voor nieuwe projecten
        </div>
      </div>

      {/* Giant title */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 900,
          fontSize: 'clamp(3.8rem,10vw,10rem)',
          lineHeight: .88,
          letterSpacing: '-.04em',
          color: '#0a0a0a',
          marginBottom: 'clamp(32px,4vh,56px)',
        }}>
          Digitale<br />
          <em style={{ fontStyle: 'italic', color: '#3a3a3a' }}>groei</em> voor<br />
          ambitieuze<br />
          <span style={{
            WebkitTextStroke: '1.5px #0a0a0a',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}>merken.</span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p style={{ color: '#8a8a8a', fontSize: 'clamp(.95rem,1.3vw,1.1rem)', lineHeight: 1.8, maxWidth: '400px', fontWeight: 300 }}>
            Websites, AI&nbsp;marketing en e-commerce strategie die
            niet alleen mooi ogen maar ook echt resultaat opleveren.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/contact" className="btn-dark">Start een project →</Link>
            <Link href="#over-mij" className="btn-outline">Ontdek Pimmerce</Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid rgba(10,10,10,.1)', marginTop: 'clamp(40px,6vh,80px)', paddingTop: 'clamp(24px,3.5vh,40px)', paddingBottom: 'clamp(32px,5vh,56px)' }}>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
          {stats.map((s, i) => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(1.8rem,2.8vw,2.6rem)', lineHeight: 1, color: '#0a0a0a', letterSpacing: '-.03em' }}>
                <span ref={el => { counterRefs.current[i] = el }} data-val={s.val}>0</span>{s.suffix}
              </div>
              <div style={{ fontSize: '11px', color: '#8a8a8a', marginTop: '5px', fontFamily: 'Syne, sans-serif', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanding progress line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(10,10,10,.06)' }}>
        <div ref={lineRef} style={{ height: '100%', background: '#0a0a0a', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .1s linear' }} />
      </div>
    </section>
  )
}

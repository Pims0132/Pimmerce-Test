'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const services = [
  { icon: '🌐', title: 'Volledige website', desc: 'Een complete professionele website met premium design, sterke structuur en een conversiegerichte opbouw. Perfect voor bedrijven die een moderne en krachtige online uitstraling willen.' },
  { icon: '🤖', title: 'AI Marketing', desc: 'Slimme inzet van AI voor content, campagnes en marketing workflows. Ideaal voor bedrijven die sneller willen groeien en consistenter zichtbaar willen zijn online.' },
  { icon: '🛒', title: 'E-commerce optimalisatie', desc: 'Optimalisatie van webshops met focus op gebruiksvriendelijkheid, conversie en klantvertrouwen. Gericht op meer verkopen en een betere online winkelervaring.' },
]

export default function Services() {
  const headRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') })
    }, { threshold: .1 })
    if (headRef.current) obs.observe(headRef.current)
    cardRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <section id="diensten" className="relative z-10 overflow-hidden" style={{ padding: '120px 6vw', background: '#040f1c' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(10,255,203,.03),transparent 70%)' }} />

      <div ref={headRef} className="fade-up max-w-[1160px] mx-auto mb-12">
        <div className="sec-label">Diensten</div>
        <h2 className="font-display font-black mb-3.5"
          style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)', lineHeight: .96, letterSpacing: '-.05em' }}>
          Wat wij<br />aanbieden.
        </h2>
        <p className="font-light max-w-[620px]" style={{ color: '#6a89aa', lineHeight: 1.7 }}>
          Van complete websites tot AI marketing en e-commerce optimalisatie. Pimmerce levert digitale oplossingen die modern ogen en gericht zijn op resultaat.
        </p>
      </div>

      <div className="max-w-[1160px] mx-auto grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))' }}>
        {services.map((s, i) => (
          <div key={s.title}
            ref={el => { cardRefs.current[i] = el }}
            className="fade-up glass-card rounded-[26px] p-7 relative overflow-hidden transition-all duration-300 group"
            style={{ transitionDelay: `${i * .1}s` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,255,203,.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.09)' }}>

            {/* teal shimmer on hover */}
            <div className="absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />

            <div className="flex items-center justify-center w-12 h-12 rounded-[14px] text-xl mb-5"
              style={{ background: 'rgba(10,255,203,.08)', border: '1px solid rgba(10,255,203,.15)' }}>
              {s.icon}
            </div>
            <h3 className="font-display font-bold text-[1.25rem] tracking-tight mb-3">{s.title}</h3>
            <p className="font-light text-[.93rem] leading-relaxed mb-6" style={{ color: '#6a89aa' }}>{s.desc}</p>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12.5px] font-display font-semibold tracking-[.04em] transition-all duration-200"
              style={{ background: 'rgba(10,255,203,.08)', border: '1px solid rgba(10,255,203,.18)', color: '#0affcb' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,255,203,.16)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,255,203,.08)' }}>
              Meer informatie →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

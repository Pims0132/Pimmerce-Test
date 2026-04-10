'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const services = [
  {
    num: '01', icon: '↗', title: 'Volledige website',
    desc: 'Een complete professionele website met premium design, sterke structuur en een conversiegerichte opbouw. Perfect voor bedrijven die een moderne en krachtige online uitstraling willen.',
    tags: ['Design', 'Development', 'SEO'],
  },
  {
    num: '02', icon: '◎', title: 'AI Marketing',
    desc: 'Slimme inzet van AI voor content, campagnes en marketing workflows. Ideaal voor bedrijven die sneller willen groeien en consistenter zichtbaar willen zijn online.',
    tags: ['Content', 'Automatisering', 'Strategie'],
  },
  {
    num: '03', icon: '⬡', title: 'E-commerce optimalisatie',
    desc: 'Optimalisatie van webshops met focus op gebruiksvriendelijkheid, conversie en klantvertrouwen. Gericht op meer verkopen en een betere online winkelervaring.',
    tags: ['UX', 'Conversie', 'Shopify'],
  },
]

export default function Services() {
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('show') })
    }, { threshold: .08 })
    refs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <section id="diensten" style={{ background: '#0a0a0a', padding: 'clamp(80px,12vh,140px) 6vw' }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div ref={el => { refs.current[0] = el }} className="fu"
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 40, marginBottom: 56 }}>
          <div>
            <span className="label" style={{ color: 'rgba(255,255,255,.35)' }}>
              <span style={{ background: 'rgba(255,255,255,.35)', width: 24, height: 1, display: 'inline-block', marginRight: 8 }} />
              Diensten
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2.4rem,4.5vw,4.5rem)', lineHeight: .9, letterSpacing: '-.04em', color: '#fff', margin: 0 }}>
              Wat wij<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.4)' }}>aanbieden.</em>
            </h2>
          </div>
          <Link href="/contact" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#fff' }}>
            Vraag een offerte aan →
          </Link>
        </div>

        {/* Services list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {services.map((s, i) => (
            <div key={s.num}
              ref={el => { refs.current[i + 1] = el }}
              className="fu"
              style={{ transitionDelay: `${i * .1}s`, borderBottom: '1px solid rgba(255,255,255,.08)', padding: 'clamp(28px,4vh,44px) 0', display: 'grid', gap: 24, alignItems: 'center', gridTemplateColumns: '80px 1fr auto', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '16px'; (e.currentTarget as HTMLElement).style.transition = 'padding .3s ease' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '0'; }}>

              {/* Number */}
              <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '3rem', color: 'rgba(255,255,255,.15)', lineHeight: 1, fontWeight: 400 }}>
                {s.num}
              </span>

              {/* Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(1.3rem,2.2vw,1.8rem)', color: '#fff', letterSpacing: '-.02em', margin: 0 }}>
                    {s.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {s.tags.map(t => (
                      <span key={t} style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', border: '1px solid rgba(255,255,255,.12)', padding: '3px 8px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem', lineHeight: 1.75, fontWeight: 300, maxWidth: '580px', margin: 0 }}>
                  {s.desc}
                </p>
              </div>

              {/* Arrow */}
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,.2)', transition: 'color .2s, transform .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'rotate(-45deg)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.2)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                ↗
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

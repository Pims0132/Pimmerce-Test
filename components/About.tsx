'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const tags = ['Webdesign', 'AI Marketing', 'E-commerce', 'Branding', 'Tilburg']

export default function About() {
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('show') })
    }, { threshold: .1 })
    refs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <section id="over-mij" style={{ background: '#ffffff', padding: 'clamp(80px,12vh,140px) 6vw' }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div ref={el => { refs.current[0] = el }} className="fu mb-[clamp(48px,8vh,80px)]"
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid rgba(10,10,10,.08)', paddingBottom: 32 }}>
          <div>
            <span className="label">Over mij</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2.8rem,5vw,5rem)', lineHeight: .9, letterSpacing: '-.04em', color: '#0a0a0a', margin: 0 }}>
              De mens<br /><em style={{ fontStyle: 'italic', color: '#8a8a8a' }}>achter</em><br />Pimmerce.
            </h2>
          </div>
          <p style={{ color: '#8a8a8a', fontSize: '1rem', lineHeight: 1.75, maxWidth: '360px', fontWeight: 300 }}>
            Ik ben Pim, een digitale ondernemer uit Tilburg met een passie voor moderne technologie, creatief design en slimme online strategie.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', alignItems: 'start' }}>

          {/* Left: photo */}
          <div ref={el => { refs.current[1] = el }} className="fu" style={{ transitionDelay: '.1s' }}>
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f0ede6' }}>
              <Image src="/images/Pim-pimmerce.jpg" alt="Pim — Pimmerce" fill className="object-cover object-top"
                style={{ transition: 'transform .6s ease' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
              />
              {/* Overlay tag */}
              <div style={{ position: 'absolute', bottom: 20, left: 20, background: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#0a0a0a' }}>
                  Beschikbaar
                </span>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div ref={el => { refs.current[2] = el }} className="fu" style={{ transitionDelay: '.2s', display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <p style={{ color: '#3a3a3a', lineHeight: 1.85, fontSize: '1.05rem', fontWeight: 300, marginBottom: 16 }}>
                Met Pimmerce combineer ik webdesign, AI en e-commerce om oplossingen te bouwen die er niet alleen goed uitzien, maar ook echt werken.
              </p>
              <p style={{ color: '#8a8a8a', lineHeight: 1.85, fontSize: '1rem', fontWeight: 300 }}>
                Van de eerste schets tot de lancering: ik begeleid het hele traject persoonlijk. Geen grote bureaus, geen accountmanagers — gewoon direct contact met iemand die écht begrijpt wat je nodig hebt.
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '6px 14px', border: '1px solid rgba(10,10,10,.15)', fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0a0a0a' }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(10,10,10,.08)', border: '1px solid rgba(10,10,10,.08)' }}>
              {[
                { num: '100%', lbl: 'Persoonlijk contact' },
                { num: '3+',   lbl: 'Projecten afgerond'  },
                { num: 'AI',   lbl: 'Marketing voorloper'  },
              ].map(s => (
                <div key={s.num} style={{ background: '#fff', padding: '20px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.8rem', color: '#0a0a0a', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: '10px', color: '#8a8a8a', marginTop: 5, fontFamily: 'Syne, sans-serif', letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.lbl}</div>
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn-dark" style={{ alignSelf: 'flex-start' }}>
              Kom in contact →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

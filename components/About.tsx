'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const tags = ['Webdesign', 'AI Marketing', 'E-commerce', 'Branding', 'Tilburg']
const stats = [
  { num: '100%', lbl: 'Persoonlijk contact, altijd direct met Pim' },
  { num: '3+',   lbl: 'Afgeronde projecten in de regio' },
  { num: 'AI',   lbl: 'Voorloper in AI-marketing & content' },
]

export default function About() {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') })
    }, { threshold: .12 })
    if (leftRef.current)  obs.observe(leftRef.current)
    if (rightRef.current) obs.observe(rightRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="over-mij" className="relative z-10 overflow-hidden"
      style={{ padding: '130px 6vw', background: '#040f1c' }}>

      {/* Blobs */}
      <div className="absolute pointer-events-none" style={{ top: '-200px', right: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,255,203,.055),transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-150px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,143,255,.05),transparent 65%)' }} />

      <div className="max-w-[1160px] mx-auto grid gap-[72px] items-center relative z-10"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))' }}>

        {/* Left */}
        <div ref={leftRef} className="fade-up">
          <div className="sec-label">Over mij</div>
          <h2 className="font-display font-black mb-7"
            style={{ fontSize: 'clamp(2.8rem,4.8vw,4.6rem)', lineHeight: .9, letterSpacing: '-.05em' }}>
            Pim.<br />
            <span style={{ color: 'rgba(255,255,255,.22)' }}>De man</span><br />
            <span style={{ color: 'rgba(255,255,255,.22)' }}>achter</span> Pimmerce.
          </h2>
          <p className="font-light mb-4" style={{ color: '#6a89aa', lineHeight: 1.8, maxWidth: '460px' }}>
            Ik ben Pim, een digitale ondernemer uit Tilburg met een passie voor moderne technologie,
            creatief design en slimme online strategie. Ik geloof dat elk bedrijf een sterke digitale aanwezigheid verdient.
          </p>
          <p className="font-light mb-0" style={{ color: '#6a89aa', lineHeight: 1.8, maxWidth: '460px' }}>
            Met Pimmerce combineer ik webdesign, AI en e-commerce om oplossingen te bouwen die er niet alleen
            goed uitzien, maar ook echt werken. Van de eerste schets tot de lancering: ik begeleid het hele traject persoonlijk.
          </p>
          <div className="flex flex-wrap gap-2 my-6">
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <Link href="/contact" className="btn-glow">Kom in contact →</Link>
        </div>

        {/* Right */}
        <div ref={rightRef} className="fade-up flex flex-col gap-4" style={{ transitionDelay: '.15s' }}>
          {/* Photo */}
          <div className="relative rounded-[28px] overflow-hidden glass-card"
            style={{ aspectRatio: '4/3.2', transition: 'border-color .3s, transform .3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,255,203,.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.09)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
            {/* teal shimmer */}
            <div className="absolute top-0 left-0 right-0 z-10" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />
            <Image
              src="/images/Pim-pimmerce.jpg"
              alt="Pim — Pimmerce"
              fill
              className="object-cover object-top"
              style={{ filter: 'saturate(1.05) contrast(1.04)' }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(s => (
              <div key={s.num} className="glass-card rounded-[20px] p-5 text-center transition-all duration-300 cursor-default"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,255,203,.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.09)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <div className="font-display font-black mb-1.5"
                  style={{ fontSize: '2rem', letterSpacing: '-.04em', lineHeight: 1, background: 'linear-gradient(135deg,#fff,#0affcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.num}
                </div>
                <div style={{ color: '#6a89aa', fontSize: '.78rem', lineHeight: 1.45 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const projects = [
  {
    num: '01', title: 'ALKU', cat: 'WordPress · SEO',
    img: 'https://alku.nl/cdn-cgi/image/quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2024/02/kozijnen-showroom-tilburg-alku.jpg',
    desc: 'Pagina\'s aangevuld en verbeterd binnen de bestaande WordPress site. Focus op structuur, sterke content en betere informatiearchitectuur voor bezoekers.',
  },
  {
    num: '02', title: 'Boerke Mutsaers', cat: 'Website · Social Media',
    img: 'https://petities.nl/system/uploads/33630/listing/Boerke_Mutsaers.png?1746513077',
    desc: 'Volledige website gebouwd en online marketing verzorgd via Instagram en Facebook voor meer zichtbaarheid en reserveringen.',
  },
  {
    num: '03', title: 'AI-Laaf', cat: 'AI · Branding · Content',
    img: 'https://i0.wp.com/ailaaf.nl/wp-content/uploads/2025/11/C0CB7D3D-4616-442C-98D5-2235FCAC172F.png?fit=1024%2C1024&ssl=1',
    desc: 'AI ingezet voor muziek, branding en digitale content. Volledige visuele stijl en online aanwezigheid rondom carnaval en Tilburg.',
  },
]

export default function Projects() {
  const headRef   = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const cardRefs  = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('show') })
    }, { threshold: .08 })
    if (headRef.current) obs.observe(headRef.current)
    cardRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    let down = false, sx = 0, sl = 0
    const onDown = (e: MouseEvent) => { down = true; sx = e.pageX - el.offsetLeft; sl = el.scrollLeft }
    const onUp   = () => { down = false }
    const onMove = (e: MouseEvent) => { if (!down) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.1 }
    el.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    el.addEventListener('mousemove', onMove)
    return () => { el.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp); el.removeEventListener('mousemove', onMove) }
  }, [])

  return (
    <section id="projecten" style={{ background: '#f8f6f1', padding: 'clamp(80px,12vh,140px) 0 clamp(60px,8vh,100px)' }}>

      {/* Header */}
      <div ref={headRef} className="fu px-[6vw] max-w-[1200px] mx-auto mb-12"
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <span className="label">Projecten</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2.4rem,4.5vw,4.5rem)', lineHeight: .9, letterSpacing: '-.04em', color: '#0a0a0a', margin: 0 }}>
            Werk waar<br /><em style={{ fontStyle: 'italic', color: '#8a8a8a' }}>ik trots</em><br />op ben.
          </h2>
        </div>
        <p style={{ color: '#8a8a8a', fontSize: '.95rem', lineHeight: 1.75, maxWidth: '300px', fontWeight: 300 }}>
          Een selectie van projecten waarbij Pimmerce heeft geholpen met websites, marketing en digitale groei.
        </p>
      </div>

      {/* Horizontal scroll */}
      <div ref={sliderRef}
        style={{ overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', padding: '0 6vw 8px', scrollbarWidth: 'none', cursor: 'grab' }}>
        <div style={{ display: 'flex', gap: 20, width: 'max-content' }}>
          {projects.map((p, i) => (
            <article key={p.num}
              ref={el => { cardRefs.current[i] = el }}
              className="fu card"
              style={{ width: 'min(480px,74vw)', minWidth: 'min(480px,74vw)', scrollSnapAlign: 'start', transitionDelay: `${i * .12}s`, overflow: 'hidden' }}>

              {/* Image */}
              <div style={{ height: 260, overflow: 'hidden', background: '#f0ede6', position: 'relative' }}>
                <Image src={p.img} alt={p.title} fill className="object-cover"
                  style={{ transition: 'transform .6s ease' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
                />
                {/* Number overlay */}
                <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '4rem', lineHeight: 1, color: 'rgba(255,255,255,.25)', letterSpacing: '-.04em' }}>
                  {p.num}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.4rem', color: '#0a0a0a', letterSpacing: '-.02em' }}>{p.title}</h3>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a8a8a', borderLeft: '1px solid rgba(10,10,10,.1)', paddingLeft: 12 }}>{p.cat}</span>
                </div>
                <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.7, fontWeight: 300 }}>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

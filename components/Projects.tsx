'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const projects = [
  {
    num: '01', title: 'ALKU',
    img: 'https://alku.nl/cdn-cgi/image/quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2024/02/kozijnen-showroom-tilburg-alku.jpg',
    desc: 'Voor ALKU heb ik pagina\'s aangevuld en verbeterd binnen hun bestaande website. De focus lag op secties vullen binnen WordPress, structuur en sterke informatie voor bezoekers.',
  },
  {
    num: '02', title: 'Boerke Mutsaers',
    img: 'https://petities.nl/system/uploads/33630/listing/Boerke_Mutsaers.png?1746513077',
    desc: 'Voor Boerke Mutsaers heb ik de volledige website gebouwd. Daarnaast verzorgde ik online marketing via Instagram en Facebook om meer zichtbaarheid en reserveringen te genereren.',
  },
  {
    num: '03', title: 'AI-Laaf',
    img: 'https://i0.wp.com/ailaaf.nl/wp-content/uploads/2025/11/C0CB7D3D-4616-442C-98D5-2235FCAC172F.png?fit=1024%2C1024&ssl=1',
    desc: 'AI-LAAF is een creatief AI-project waarbij ik kunstmatige intelligentie inzet voor muziek, branding en digitale content. De volledige visuele stijl, AI-muziek en online aanwezigheid rondom carnaval en Tilburg.',
  },
]

export default function Projects() {
  const headRef   = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') })
    }, { threshold: .1 })
    if (headRef.current) obs.observe(headRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    let down = false, sx = 0, sl = 0

    const onDown = (e: MouseEvent) => {
      down = true
      el.style.cursor = 'grabbing'
      sx = e.pageX - el.offsetLeft
      sl = el.scrollLeft
    }
    const onUp = () => {
      down = false
      el.style.cursor = 'grab'
    }
    const onMove = (e: MouseEvent) => {
      if (!down) return
      e.preventDefault()
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.1
    }

    el.addEventListener('mousedown', onDown)
    el.addEventListener('mouseleave', onUp)
    el.addEventListener('mouseup', onUp)
    el.addEventListener('mousemove', onMove)

    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mouseleave', onUp)
      el.removeEventListener('mouseup', onUp)
      el.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section id="projecten" className="relative z-10 overflow-hidden" style={{ padding: '120px 0 60px', background: '#020b14' }}>
      <div ref={headRef} className="fade-up px-[6vw] max-w-[1160px] mx-auto mb-10">
        <div className="sec-label">Projecten</div>
        <h2 className="font-display font-black mb-3.5"
          style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)', lineHeight: .96, letterSpacing: '-.05em' }}>
          Werk waar ik<br />trots op ben.
        </h2>
        <p className="font-light" style={{ color: '#6a89aa', fontSize: '1rem', lineHeight: 1.7 }}>
          Een selectie van projecten waarbij Pimmerce heeft geholpen met websites, content, online marketing en digitale groei.
        </p>
      </div>

      <div ref={sliderRef}
        className="overflow-x-auto overflow-y-hidden select-none"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', padding: '0 6vw 20px', scrollbarWidth: 'none', cursor: 'grab' }}>
        <div className="flex gap-5" style={{ width: 'max-content' }}>
          {projects.map(p => (
            <article key={p.num}
              className="glass-card rounded-[28px] overflow-hidden transition-all duration-300 group"
              style={{ width: 'min(500px,76vw)', minWidth: 'min(500px,76vw)', scrollSnapAlign: 'start' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-8px)'
                el.style.borderColor = 'rgba(10,255,203,.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.borderColor = 'rgba(255,255,255,.09)'
              }}>
              <div className="relative overflow-hidden" style={{ height: '260px', background: '#071628' }}>
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ filter: 'saturate(.88) brightness(.93)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(2,11,20,.7),rgba(2,11,20,.08))' }} />
              </div>
              <div className="p-6">
                <div className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[10px] mb-3.5 font-display font-bold text-[11px] tracking-[.06em]"
                  style={{ background: 'rgba(10,255,203,.08)', border: '1px solid rgba(10,255,203,.16)', color: '#0affcb' }}>
                  {p.num}
                </div>
                <h3 className="font-display font-bold text-[1.3rem] tracking-tight mb-2.5">{p.title}</h3>
                <p className="font-light text-[.94rem] leading-relaxed" style={{ color: '#6a89aa' }}>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

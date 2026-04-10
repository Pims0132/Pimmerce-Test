'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/#over-mij',  label: 'Over mij'  },
  { href: '/#projecten', label: 'Projecten' },
  { href: '/#diensten',  label: 'Diensten'  },
  { href: '/kennisbank', label: 'Kennisbank' },
]

export default function Nav() {
  const path    = usePathname()
  const [open,  setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-[500]"
      style={{
        background: scrolled ? 'rgba(248,246,241,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,10,10,.08)' : '1px solid transparent',
        transition: 'background .35s, border-color .35s, backdrop-filter .35s',
      }}>
      <div className="max-w-[1200px] mx-auto px-[6vw] h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.35rem', color: '#0a0a0a', letterSpacing: '-.02em' }}>
            Pimmerce
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`nav-link ${path === l.href ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/contact" className="btn-dark hidden md:inline-flex" style={{ padding: '10px 20px', fontSize: '11px' }}>
          Start een project
        </Link>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)}
          className="flex md:hidden flex-col gap-[5px] p-2"
          style={{ background: 'none', border: 'none', cursor: 'none' }}>
          <span style={{ width: 22, height: 1.5, background: '#0a0a0a', display: 'block', transition: 'transform .25s', transform: open ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
          <span style={{ width: 22, height: 1.5, background: '#0a0a0a', display: 'block', transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
          <span style={{ width: 22, height: 1.5, background: '#0a0a0a', display: 'block', transition: 'transform .25s', transform: open ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#f8f6f1', borderTop: '1px solid rgba(10,10,10,.08)', padding: '20px 6vw 28px' }}>
          <div className="flex flex-col gap-4">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#0a0a0a', textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-dark" style={{ marginTop: 8, textAlign: 'center', justifyContent: 'center' }}>
              Start een project
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

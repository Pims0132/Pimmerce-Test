'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#f8f6f1', borderTop: '1px solid rgba(10,10,10,.08)', padding: 'clamp(48px,8vh,80px) 6vw clamp(32px,5vh,48px)' }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 56, paddingBottom: 48, borderBottom: '1px solid rgba(10,10,10,.08)' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '2rem', color: '#0a0a0a', letterSpacing: '-.03em', marginBottom: 12 }}>
              Pimmerce
            </div>
            <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.7, maxWidth: '280px', fontWeight: 300 }}>
              Digitale groei voor ambitieuze merken. Webdesign, AI marketing en e-commerce vanuit Tilburg.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#0a0a0a', marginBottom: 16 }}>Menu</div>
              {[
                { href: '/#over-mij', label: 'Over mij' },
                { href: '/#projecten', label: 'Projecten' },
                { href: '/#diensten', label: 'Diensten' },
                { href: '/kennisbank', label: 'Kennisbank' },
                { href: '/contact', label: 'Contact' },
              ].map(l => (
                <div key={l.href} style={{ marginBottom: 10 }}>
                  <Link href={l.href} className="underline-hover"
                    style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', color: '#8a8a8a', textDecoration: 'none', fontWeight: 300 }}>
                    {l.label}
                  </Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#0a0a0a', marginBottom: 16 }}>Contact</div>
              <div style={{ marginBottom: 10 }}>
                <a href="mailto:info@pimmerce.com" className="underline-hover"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', color: '#8a8a8a', textDecoration: 'none', fontWeight: 300 }}>
                  info@pimmerce.com
                </a>
              </div>
              <div style={{ color: '#8a8a8a', fontSize: '.9rem', fontWeight: 300 }}>Tilburg, Nederland</div>
              <div style={{ marginTop: 20 }}>
                <Link href="/dashboard"
                  style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(10,10,10,.2)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,10,10,.2)' }}>
                  ⚡ Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', color: '#8a8a8a', letterSpacing: '.08em' }}>
            © 2025 Pimmerce — Tilburg
          </span>
          <Link href="/contact" className="btn-dark" style={{ padding: '10px 20px', fontSize: '11px' }}>
            Contact opnemen →
          </Link>
        </div>
      </div>
    </footer>
  )
}

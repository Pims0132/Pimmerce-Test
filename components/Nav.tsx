'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/#over-mij',   label: 'Over mij'   },
  { href: '/#projecten',  label: 'Projecten'  },
  { href: '/#diensten',   label: 'Diensten'   },
  { href: '/kennisbank',  label: 'Kennisbank' },
  { href: '/contact',     label: 'Contact'    },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[min(1200px,96%)] z-[500]">
      <nav
        className="flex items-center justify-between px-5 py-3 rounded-[20px]"
        style={{
          background: 'rgba(4,15,28,.65)',
          border: '1px solid rgba(255,255,255,.09)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          boxShadow: '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05)',
        }}
      >
        <Link href="/" className="font-display font-black text-[1.1rem] tracking-tight"
          style={{ background: 'linear-gradient(130deg,#fff 30%,#0affcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Pimmerce
        </Link>

        <div className="hidden md:flex gap-1 items-center">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3.5 py-2 rounded-full text-[13.5px] transition-all duration-200"
              style={{ color: path === l.href ? '#e8f0fe' : '#6a89aa' }}
              onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.05)'; (e.currentTarget as HTMLElement).style.color = '#e8f0fe' }}
              onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = path === l.href ? '#e8f0fe' : '#6a89aa' }}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="hidden md:inline-flex"
          style={{ padding: '10px 18px', borderRadius: '999px', background: '#0affcb', color: '#020b14', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13.5px', boxShadow: '0 0 22px rgba(10,255,203,.35)', transition: 'box-shadow .2s, transform .2s', textDecoration: 'none' }}
          onMouseEnter={e => { ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 38px rgba(10,255,203,.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(10,255,203,.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
          Start een project
        </Link>

        <button onClick={() => setOpen(!open)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#e8f0fe', cursor: 'pointer' }}>
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-2 rounded-[20px] overflow-hidden"
          style={{ background: 'rgba(4,15,28,.95)', border: '1px solid rgba(255,255,255,.09)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}>
          <div className="flex flex-col p-3 gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-display font-medium transition-all"
                style={{ color: path === l.href ? '#0affcb' : '#6a89aa', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.05)'; (e.currentTarget as HTMLElement).style.color = '#e8f0fe' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = path === l.href ? '#0affcb' : '#6a89aa' }}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)}
              className="mt-2 py-3 rounded-full font-display font-bold text-sm text-center"
              style={{ background: '#0affcb', color: '#020b14', boxShadow: '0 0 20px rgba(10,255,203,.3)', textDecoration: 'none' }}>
              Start een project
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

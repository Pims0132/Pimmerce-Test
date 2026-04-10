import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 px-[6vw] py-12"
      style={{ background: '#020b14', borderTop: '1px solid rgba(255,255,255,.09)' }}>
      <div className="max-w-[1160px] mx-auto flex items-center justify-between flex-wrap gap-5">

        <div className="font-display font-black text-[1.1rem]"
          style={{ background: 'linear-gradient(130deg,#fff 30%,#0affcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Pimmerce
        </div>

        <div className="flex items-center gap-6">
          <div style={{ color: '#6a89aa', fontSize: '.85rem' }}>© 2025 Pimmerce — Tilburg</div>
          <Link href="/dashboard" className="footer-dashboard-link">
            ⚡ Dashboard
          </Link>
        </div>

        <Link href="/contact" className="footer-cta">
          Contact opnemen
        </Link>
      </div>

      <style>{`
        .footer-dashboard-link {
          font-family: Syne, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,.15);
          text-decoration: none;
          transition: color .2s;
        }
        .footer-dashboard-link:hover { color: rgba(10,255,203,.5); }
        .footer-cta {
          padding: 10px 18px;
          border-radius: 999px;
          background: #0affcb;
          color: #020b14;
          font-family: Syne, sans-serif;
          font-weight: 700;
          font-size: 13.5px;
          text-decoration: none;
          box-shadow: 0 0 22px rgba(10,255,203,.35);
          transition: box-shadow .2s;
        }
        .footer-cta:hover { box-shadow: 0 0 38px rgba(10,255,203,.5); }
      `}</style>
    </footer>
  )
}

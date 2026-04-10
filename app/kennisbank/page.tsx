import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kennisbank — Pimmerce',
  description: 'Tips en artikelen over webdesign, AI marketing en e-commerce van Pimmerce.',
}

export const dynamic = 'force-dynamic'

interface Blog { id: number; titel: string; slug: string; beschrijving: string | null; categorie: string | null; aangemaakt: string }

async function getBlogs(): Promise<Blog[]> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase.from('blogs').select('id,titel,slug,beschrijving,categorie,aangemaakt').eq('gepubliceerd', true).order('aangemaakt', { ascending: false })
  return (data as Blog[]) || []
}

const catColors: Record<string, string> = {
  'Webdesign': '#0a0a0a', 'AI Marketing': '#3a3a3a',
  'E-commerce': '#5a5a5a', 'Algemeen': '#8a8a8a',
}

export default async function KennisbankPage() {
  const blogs = await getBlogs()

  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ background: '#f8f6f1', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(10,10,10,.08)', padding: 'clamp(120px,16vh,180px) 6vw clamp(48px,6vh,80px)' }}>
          <div className="max-w-[1200px] mx-auto">
            <span className="label">Kennisbank</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2.8rem,6vw,6rem)', lineHeight: .88, letterSpacing: '-.04em', color: '#0a0a0a' }}>
              Tips & artikelen<br />
              <em style={{ fontStyle: 'italic', color: '#8a8a8a' }}>over digitale groei.</em>
            </h1>
          </div>
        </div>

        {/* Blog list */}
        <div className="max-w-[1200px] mx-auto" style={{ padding: 'clamp(48px,6vh,80px) 6vw clamp(80px,12vh,140px)' }}>
          {blogs.length === 0 ? (
            <p style={{ color: '#8a8a8a', fontWeight: 300 }}>Nog geen artikelen gepubliceerd.</p>
          ) : (
            <div className="blog-list" style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(10,10,10,.06)', border: '1px solid rgba(10,10,10,.06)' }}>
              {blogs.map(b => (
                <Link key={b.id} href={`/kennisbank/${b.slug}`} className="blog-row" style={{ textDecoration: 'none', display: 'block', background: '#fff', padding: 'clamp(24px,3.5vw,36px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      {b.categorie && (
                        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: catColors[b.categorie] || '#8a8a8a', display: 'block', marginBottom: 8 }}>
                          {b.categorie}
                        </span>
                      )}
                      <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: '#0a0a0a', letterSpacing: '-.02em', marginBottom: 8 }}>
                        {b.titel}
                      </h2>
                      {b.beschrijving && (
                        <p style={{ color: '#8a8a8a', fontSize: '.9rem', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
                          {b.beschrijving}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: '1.2rem', color: '#0a0a0a', transition: 'transform .2s' }}>→</span>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', color: '#8a8a8a', letterSpacing: '.05em' }}>
                        {new Date(b.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .blog-row { transition: background .2s; }
        .blog-row:hover { background: #f8f6f1 !important; }
        .nav-link-footer { transition: color .2s; color: #8a8a8a; }
        .nav-link-footer:hover { color: #0a0a0a; }
      `}</style>

      <Footer />
    </>
  )
}

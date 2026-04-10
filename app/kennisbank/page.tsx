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

export const revalidate = 60

interface Blog {
  id: number
  titel: string
  slug: string
  beschrijving: string | null
  categorie: string | null
  aangemaakt: string
}

async function getBlogs(): Promise<Blog[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('blogs')
    .select('id, titel, slug, beschrijving, categorie, aangemaakt')
    .eq('gepubliceerd', true)
    .order('aangemaakt', { ascending: false })
  return (data as Blog[]) || []
}

const categorieKleuren: Record<string, string> = {
  'Webdesign':   'rgba(10,255,203,.1)',
  'AI Marketing': 'rgba(160,100,255,.1)',
  'E-commerce':  'rgba(10,143,255,.1)',
  'Algemeen':    'rgba(255,160,50,.1)',
}
const categorieTextKleuren: Record<string, string> = {
  'Webdesign':   '#0affcb',
  'AI Marketing': '#a064ff',
  'E-commerce':  '#0a8fff',
  'Algemeen':    '#ffa032',
}

export default async function KennisbankPage() {
  const blogs = await getBlogs()

  return (
    <>
      <Cursor />
      <Nav />
      <main className="relative z-10 min-h-screen" style={{ background: '#020b14' }}>

        {/* Blobs */}
        <div className="fixed pointer-events-none z-0" style={{ top: '-200px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,255,203,.05),transparent 65%)' }} />
        <div className="fixed pointer-events-none z-0" style={{ bottom: '-200px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,143,255,.04),transparent 65%)' }} />

        <div className="max-w-[1160px] mx-auto px-6 py-32">

          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 font-display font-bold text-[11px] tracking-[.12em] uppercase"
              style={{ background: 'rgba(10,255,203,.06)', border: '1px solid rgba(10,255,203,.16)', color: '#0affcb' }}>
              Kennisbank
            </div>
            <h1 className="font-display font-black mb-4"
              style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', lineHeight: .9, letterSpacing: '-.05em', color: '#e8f0fe' }}>
              Tips & artikelen<br />
              <span style={{ color: 'rgba(255,255,255,.22)' }}>over digitale groei.</span>
            </h1>
            <p className="font-light max-w-[560px]" style={{ color: '#6a89aa', lineHeight: 1.75, fontSize: '1.05rem' }}>
              Praktische artikelen over webdesign, AI marketing en e-commerce. Geschreven door Pim vanuit eigen ervaring.
            </p>
          </div>

          {/* Geen blogs */}
          {blogs.length === 0 && (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)' }}>
              <p className="font-display font-bold text-lg mb-2" style={{ color: '#e8f0fe' }}>Binnenkort artikelen</p>
              <p style={{ color: '#6a89aa', fontSize: '.9rem' }}>De eerste artikelen worden binnenkort gepubliceerd.</p>
            </div>
          )}

          {/* Blog grid */}
          {blogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map(blog => (
                <Link key={blog.id} href={`/kennisbank/${blog.slug}`}
                  className="group rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', textDecoration: 'none' }}
                  onMouseEnter={undefined}>
                  {/* Gradient top */}
                  <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#0affcb,#0a8fff)' }} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Categorie */}
                    {blog.categorie && (
                      <span className="inline-flex self-start px-2.5 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-wide mb-4"
                        style={{
                          background: categorieKleuren[blog.categorie] || 'rgba(255,255,255,.06)',
                          color: categorieTextKleuren[blog.categorie] || '#6a89aa',
                          border: `1px solid ${categorieTextKleuren[blog.categorie] || '#6a89aa'}33`,
                        }}>
                        {blog.categorie}
                      </span>
                    )}

                    <h2 className="font-display font-bold mb-3 leading-snug"
                      style={{ fontSize: '1.15rem', color: '#e8f0fe', letterSpacing: '-.02em' }}>
                      {blog.titel}
                    </h2>

                    {blog.beschrijving && (
                      <p className="font-light text-sm leading-relaxed flex-1 mb-4"
                        style={{ color: '#6a89aa' }}>
                        {blog.beschrijving.length > 120 ? blog.beschrijving.slice(0, 120) + '...' : blog.beschrijving}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <span className="text-xs" style={{ color: '#6a89aa' }}>
                        {new Date(blog.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-xs font-display font-semibold transition-colors" style={{ color: '#0affcb' }}>
                        Lees meer →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

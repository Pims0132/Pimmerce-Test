import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import type { Metadata } from 'next'

export const revalidate = 60

interface Blog {
  id: number
  titel: string
  slug: string
  beschrijving: string | null
  inhoud: string | null
  categorie: string | null
  aangemaakt: string
  bijgewerkt: string
}

function parseMarkdown(text: string): string {
  return text
    .replace(/^###\s*(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s*(.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^-\s*(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n(?!<)/g, '<br/>')
    .replace(/<\/(h[23]|ul)><br\/>/g, '</$1>')
}

async function getBlog(slug: string): Promise<Blog | null> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('gepubliceerd', true)
    .single()
  return data as Blog | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return { title: 'Niet gevonden — Pimmerce' }
  return {
    title: `${blog.titel} — Pimmerce`,
    description: blog.beschrijving || undefined,
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  const categorieKleuren: Record<string, string> = {
    'Webdesign': '#0affcb', 'AI Marketing': '#a064ff',
    'E-commerce': '#0a8fff', 'Algemeen': '#ffa032',
  }

  return (
    <>
      <Cursor />
      <Nav />
      <main className="relative z-10 min-h-screen" style={{ background: '#020b14' }}>

        <div className="fixed pointer-events-none z-0" style={{ top: '-200px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,255,203,.05),transparent 65%)' }} />

        <div className="max-w-[760px] mx-auto px-6 py-32">

          <Link href="/kennisbank"
            className="inline-flex items-center gap-2 mb-10 text-sm font-display font-semibold transition-colors"
            style={{ color: '#6a89aa', textDecoration: 'none' }}>
            ← Terug naar kennisbank
          </Link>

          {blog.categorie && (
            <div className="mb-5">
              <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-wide"
                style={{ background: `${categorieKleuren[blog.categorie] || '#6a89aa'}18`, color: categorieKleuren[blog.categorie] || '#6a89aa', border: `1px solid ${categorieKleuren[blog.categorie] || '#6a89aa'}33` }}>
                {blog.categorie}
              </span>
            </div>
          )}

          <h1 className="font-display font-black mb-5"
            style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1, letterSpacing: '-.04em', color: '#e8f0fe' }}>
            {blog.titel}
          </h1>

          <div className="flex items-center gap-4 mb-10 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm"
              style={{ background: 'rgba(10,255,203,.1)', color: '#0affcb', border: '1px solid rgba(10,255,203,.2)' }}>
              P
            </div>
            <div>
              <div className="text-sm font-display font-semibold" style={{ color: '#e8f0fe' }}>Pim — Pimmerce</div>
              <div className="text-xs" style={{ color: '#6a89aa' }}>
                {new Date(blog.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {blog.beschrijving && (
            <p className="font-light text-lg leading-relaxed mb-8"
              style={{ color: '#a8b8d0', lineHeight: 1.8 }}>
              {blog.beschrijving}
            </p>
          )}

          {blog.inhoud && (
            <div className="blog-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.inhoud) }}
            />
          )}

          <div className="mt-16 pt-8 flex items-center justify-between flex-wrap gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <Link href="/kennisbank"
              className="text-sm font-display font-semibold"
              style={{ color: '#6a89aa', textDecoration: 'none' }}>
              ← Alle artikelen
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-sm"
              style={{ background: '#0affcb', color: '#020b14', boxShadow: '0 0 24px rgba(10,255,203,.3)', textDecoration: 'none' }}>
              Neem contact op →
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .blog-content { color: #8a9ab0; font-size: 1rem; line-height: 1.9; font-weight: 300; }
        .blog-content h2 { font-family: Syne, sans-serif; font-weight: 800; font-size: 1.5rem; color: #e8f0fe; margin: 2.5rem 0 1rem; letter-spacing: -.03em; }
        .blog-content h3 { font-family: Syne, sans-serif; font-weight: 700; font-size: 1.2rem; color: #e8f0fe; margin: 2rem 0 .75rem; }
        .blog-content strong { color: #e8f0fe; font-weight: 600; }
        .blog-content em { color: #a8b8d0; font-style: italic; }
        .blog-content a { color: #0affcb; text-decoration: underline; }
        .blog-content ul { padding-left: 1.5rem; margin: 1rem 0; }
        .blog-content li { margin-bottom: .5rem; list-style: disc; }
        .blog-content br { display: block; content: ''; margin-top: .4rem; }
      `}</style>
    </>
  )
}

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Blog { id: number; titel: string; slug: string; beschrijving: string | null; inhoud: string | null; categorie: string | null; aangemaakt: string; bijgewerkt: string }

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
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await supabase.from('blogs').select('*').eq('slug', slug).eq('gepubliceerd', true).single()
  return data as Blog | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return { title: 'Niet gevonden — Pimmerce' }
  return { title: `${blog.titel} — Pimmerce`, description: blog.beschrijving || undefined }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ background: '#fff', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: '#f8f6f1', borderBottom: '1px solid rgba(10,10,10,.08)', padding: 'clamp(120px,16vh,180px) 6vw clamp(48px,6vh,80px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Link href="/kennisbank" style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#8a8a8a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, transition: 'color .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8a8a8a' }}>
              ← Kennisbank
            </Link>
            {blog.categorie && (
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#8a8a8a', marginBottom: 16 }}>
                {blog.categorie}
              </div>
            )}
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3.8rem)', lineHeight: .95, letterSpacing: '-.04em', color: '#0a0a0a', marginBottom: 20 }}>
              {blog.titel}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 20, borderTop: '1px solid rgba(10,10,10,.08)' }}>
              <div style={{ width: 32, height: 32, background: '#0a0a0a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '14px', color: '#fff' }}>P</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '.05em' }}>Pim — Pimmerce</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8a8a8a', fontWeight: 300 }}>
                  {new Date(blog.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vh,80px) 6vw clamp(80px,10vh,120px)' }}>
          {blog.beschrijving && (
            <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#3a3a3a', lineHeight: 1.7, marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(10,10,10,.08)' }}>
              {blog.beschrijving}
            </p>
          )}
          {blog.inhoud && (
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontSize: '1rem', lineHeight: 1.85, color: '#3a3a3a' }}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.inhoud) }} />
          )}
          <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(10,10,10,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <Link href="/kennisbank" style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#8a8a8a', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8a8a8a' }}>
              ← Terug naar kennisbank
            </Link>
            <Link href="/contact" className="btn-dark" style={{ padding: '10px 20px', fontSize: '11px' }}>
              Start een project →
            </Link>
          </div>
        </div>
      </main>
      <style>{`
        .blog-content h2, div h2 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.6rem; color: #0a0a0a; margin: 2.5rem 0 1rem; letter-spacing: -.03em; }
        .blog-content h3, div h3 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.2rem; color: #0a0a0a; margin: 2rem 0 .8rem; }
        .blog-content ul, div ul { padding-left: 1.4rem; margin: 1rem 0; }
        .blog-content li, div li { color: #3a3a3a; line-height: 1.8; margin-bottom: .4rem; }
        .blog-content strong, div strong { color: #0a0a0a; font-weight: 600; }
        .blog-content em, div em { color: #3a3a3a; font-style: italic; }
      `}</style>
      <Footer />
    </>
  )
}

'use client'
import { useState, useEffect, useRef } from 'react'
import Cursor from '@/components/Cursor'
import { checkPassword, logout as serverLogout, isAuthenticated, getContacten, startUur, stopUur, getUren, verwijderUur, getBlogs, saveBlog, verwijderBlog, getSeoScans, verwijderSeoScan } from './actions'
import { Eye, EyeOff, Clock, Mail, Building2, RefreshCw, Play, Square, Trash2, Timer, BookOpen, Plus, Pencil, Globe, Search, TrendingUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface Aanvraag {
  id: number
  naam: string
  email: string
  bedrijf: string | null
  dienst: string | null
  bericht: string | null
  aangemaakt: string
}

interface UurEntry {
  id: number
  project: string
  start_tijd: number
  eind_tijd: number | null
  notitie: string | null
}

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]           = useState('')
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState(false)
  const [shake, setShake]     = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const ok = await checkPassword(pw)
    setLoading(false)
    if (ok) { onLogin() } else {
      setError(true); setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#020b14' }}>
      <div className="fixed pointer-events-none" style={{ top: '-200px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,255,203,.06),transparent 65%)' }} />
      <div className="fixed pointer-events-none" style={{ bottom: '-200px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(10,143,255,.05),transparent 65%)' }} />

      <div className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(10,255,203,.1)', border: '1px solid rgba(10,255,203,.2)' }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight"
            style={{ background: 'linear-gradient(130deg,#fff 30%,#0affcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Pimmerce
          </h1>
          <p style={{ color: '#6a89aa', fontSize: '.9rem', marginTop: '4px' }}>Dashboard toegang</p>
        </div>

        <div className="rounded-[24px] p-8 relative overflow-hidden"
          style={{ background: 'rgba(4,15,28,.8)', border: '1px solid rgba(255,255,255,.09)', backdropFilter: 'blur(24px)' }}>
          <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Wachtwoord</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={pw}
                  onChange={e => { setPw(e.target.value); setError(false) }}
                  placeholder="••••••••••••" autoFocus
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${error ? 'rgba(255,80,80,.5)' : 'rgba(255,255,255,.09)'}`, color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif' }}
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6a89aa' }}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="mt-2 text-xs" style={{ color: 'rgba(255,100,100,.9)' }}>Verkeerd wachtwoord.</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full font-display font-bold text-sm tracking-wide"
              style={{ background: loading ? 'rgba(10,255,203,.6)' : '#0affcb', color: '#020b14', boxShadow: '0 0 28px rgba(10,255,203,.35)', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Controleren...' : 'Inloggen →'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,.2)' }}>Pimmerce — Alleen voor intern gebruik</p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
        .animate-shake{animation:shake .5s ease}
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const PROJECTEN = ['ALKU', 'Pimmerce']

function formatDuur(ms: number): string {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function formatTijd(ts: number): string {
  return new Date(ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

function formatDatum(ts: number): string {
  return new Date(ts).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

function totaalMs(entries: UurEntry[], project?: string): number {
  return entries
    .filter(e => {
      const heeftEind = e.eind_tijd != null && Number(e.eind_tijd) > 0
      const matchProject = !project || e.project === project
      return heeftEind && matchProject
    })
    .reduce((acc, e) => acc + (Number(e.eind_tijd) - Number(e.start_tijd)), 0)
}

function msNaarUurMin(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}u ${m}m`
}

/* ══════════════════════════════════════════
   TIJDREGISTRATIE TAB
══════════════════════════════════════════ */
function TijdTab() {
  const [entries, setEntries]   = useState<UurEntry[]>([])
  const [actief, setActief]     = useState<UurEntry | null>(null)
  const [ticker, setTicker]     = useState(0)
  const [project, setProject]   = useState('ALKU')
  const [notitie, setNotitie]   = useState('')
  const [filter, setFilter]     = useState('Alles')
  const [laden, setLaden]       = useState(true)
  const [bezig, setBezig]       = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  async function laadUren() {
    setLaden(true)
    const data = await getUren()
    const lijst = data as UurEntry[]
    const actieveSessie = lijst.find(e => e.eind_tijd == null || e.eind_tijd === 0) || null
    setActief(actieveSessie)
    setEntries(lijst.filter(e => e.eind_tijd != null && e.eind_tijd > 0))
    setLaden(false)
  }

  useEffect(() => { laadUren() }, [])

  // Live ticker voor actieve sessie
  useEffect(() => {
    if (actief) {
      intervalRef.current = setInterval(() => setTicker(t => t + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [actief])

  async function inklokken() {
    if (actief || bezig) return
    setBezig(true)
    const now = Date.now()
    const data = await startUur(project, notitie, now)
    if (data) {
      setActief(data as UurEntry)
      setNotitie('')
    }
    setBezig(false)
  }

  async function uitklokken() {
    if (!actief || bezig) return
    setBezig(true)
    const now = Date.now()
    await stopUur(actief.id, now)
    setEntries(prev => [{ ...actief, eind_tijd: now }, ...prev])
    setActief(null)
    setBezig(false)
  }

  async function verwijder(id: number) {
    await verwijderUur(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const lopendMs  = actief ? Date.now() - actief.start_tijd : 0
  const gefilterd = filter === 'Alles' ? entries : entries.filter(e => e.project === filter)

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-black text-xl" style={{ color: '#e8f0fe' }}>Tijdregistratie</h2>

      {/* Totalen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="font-display font-black text-lg mb-0.5" style={{ color: '#0affcb' }}>{msNaarUurMin(totaalMs(entries))}</div>
          <div className="text-xs font-display font-semibold tracking-wider uppercase" style={{ color: '#6a89aa' }}>Totaal</div>
        </div>
        {PROJECTEN.map(p => (
          <div key={p} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="font-display font-black text-lg mb-0.5" style={{ color: p === 'ALKU' ? '#0a8fff' : '#0affcb' }}>{msNaarUurMin(totaalMs(entries, p))}</div>
            <div className="text-xs font-display font-semibold tracking-wider uppercase" style={{ color: '#6a89aa' }}>{p}</div>
          </div>
        ))}
      </div>

      {/* Actieve timer */}
      {actief && (
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'rgba(10,255,203,.05)', border: '1px solid rgba(10,255,203,.2)' }}>
          <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: 'linear-gradient(90deg,transparent,#0affcb,transparent)' }} />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0affcb' }} />
                <span className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: '#0affcb' }}>Bezig</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-display font-semibold"
                  style={{ background: 'rgba(10,255,203,.1)', color: '#0affcb', border: '1px solid rgba(10,255,203,.2)' }}>
                  {actief.project}
                </span>
              </div>
              <div className="font-display font-black text-3xl tracking-tight" style={{ color: '#e8f0fe' }}>
                {formatDuur(lopendMs)}
              </div>
              {actief.notitie && <p className="text-xs mt-1" style={{ color: '#6a89aa' }}>{actief.notitie}</p>}
              <p className="text-xs mt-0.5" style={{ color: '#6a89aa' }}>Gestart om {formatTijd(actief.start_tijd)}</p>
            </div>
            <button onClick={uitklokken} disabled={bezig}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm transition-all"
              style={{ background: 'rgba(255,80,80,.1)', border: '1px solid rgba(255,80,80,.25)', color: 'rgba(255,100,100,.9)', cursor: bezig ? 'not-allowed' : 'pointer' }}>
              <Square className="w-4 h-4" /> {bezig ? 'Opslaan...' : 'Uitklokken'}
            </button>
          </div>
        </div>
      )}

      {/* Inklokken */}
      {!actief && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <h3 className="font-display font-bold text-sm mb-4" style={{ color: '#e8f0fe' }}>Inklokken</h3>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {PROJECTEN.map(p => (
                <button key={p} onClick={() => setProject(p)}
                  className="py-2.5 rounded-xl font-display font-bold text-sm transition-all"
                  style={{
                    background: project === p ? 'rgba(10,255,203,.1)' : 'rgba(255,255,255,.03)',
                    border: `1px solid ${project === p ? 'rgba(10,255,203,.3)' : 'rgba(255,255,255,.07)'}`,
                    color: project === p ? '#0affcb' : '#6a89aa',
                    cursor: 'pointer',
                  }}>
                  {p}
                </button>
              ))}
            </div>
            <input type="text" value={notitie} onChange={e => setNotitie(e.target.value)}
              placeholder="Notitie (optioneel)"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
              onKeyDown={e => { if (e.key === 'Enter') inklokken() }}
            />
            <button onClick={inklokken} disabled={bezig}
              className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-bold text-sm transition-all"
              style={{ background: bezig ? 'rgba(10,255,203,.6)' : '#0affcb', color: '#020b14', boxShadow: '0 0 24px rgba(10,255,203,.3)', cursor: bezig ? 'not-allowed' : 'pointer' }}>
              <Play className="w-4 h-4" /> {bezig ? 'Starten...' : `Inklokken — ${project}`}
            </button>
          </div>
        </div>
      )}

      {/* Geschiedenis */}
      {!laden && entries.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
            <h3 className="font-display font-bold text-sm" style={{ color: '#e8f0fe' }}>Geschiedenis</h3>
            <div className="flex gap-1">
              {['Alles', ...PROJECTEN].map(p => (
                <button key={p} onClick={() => setFilter(p)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-display font-bold transition-all"
                  style={{ background: filter === p ? 'rgba(10,255,203,.1)' : 'transparent', color: filter === p ? '#0affcb' : '#6a89aa', border: `1px solid ${filter === p ? 'rgba(10,255,203,.2)' : 'transparent'}`, cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
            {gefilterd.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-display font-bold"
                      style={{ background: e.project === 'ALKU' ? 'rgba(10,143,255,.1)' : 'rgba(10,255,203,.1)', color: e.project === 'ALKU' ? '#0a8fff' : '#0affcb', border: `1px solid ${e.project === 'ALKU' ? 'rgba(10,143,255,.2)' : 'rgba(10,255,203,.2)'}` }}>
                      {e.project}
                    </span>
                    <span className="text-xs font-display font-bold" style={{ color: '#e8f0fe' }}>
                      {e.eind_tijd ? formatDuur(e.eind_tijd - e.start_tijd) : '—'}
                    </span>
                  </div>
                  <div className="text-[11px]" style={{ color: '#6a89aa' }}>
                    {formatDatum(e.start_tijd)} · {formatTijd(e.start_tijd)} → {e.eind_tijd ? formatTijd(e.eind_tijd) : 'bezig'}
                    {e.notitie && ` · ${e.notitie}`}
                  </div>
                </div>
                <button onClick={() => verwijder(e.id)}
                  className="p-1.5 rounded-lg transition-all shrink-0"
                  style={{ color: 'rgba(255,80,80,.4)', cursor: 'pointer', background: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {laden && (
        <div className="text-center py-8">
          <div className="w-6 h-6 rounded-full border-2 mx-auto animate-spin" style={{ borderColor: '#0affcb', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!laden && entries.length === 0 && !actief && (
        <div className="text-center py-8" style={{ color: '#6a89aa' }}>
          <Timer className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nog geen uren geregistreerd.</p>
        </div>
      )}
    </div>
  )
}


/* ══════════════════════════════════════════
   BLOGS TAB
══════════════════════════════════════════ */
interface Blog {
  id: number
  titel: string
  slug: string
  beschrijving: string | null
  inhoud: string | null
  categorie: string | null
  gepubliceerd: boolean
  aangemaakt: string
}

const LEEG_BLOG = { titel: '', slug: '', beschrijving: '', inhoud: '', categorie: 'Webdesign', gepubliceerd: false }
const CATEGORIEEN = ['Webdesign', 'AI Marketing', 'E-commerce', 'Algemeen']

function slugify(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function BlogsTab() {
  const [blogs, setBlogs]       = useState<Blog[]>([])
  const [laden, setLaden]       = useState(true)
  const [editBlog, setEditBlog] = useState<typeof LEEG_BLOG & { id?: number } | null>(null)
  const [opslaan, setOpslaan]   = useState(false)

  async function laad() {
    setLaden(true)
    const data = await getBlogs()
    setBlogs(data as Blog[])
    setLaden(false)
  }

  useEffect(() => { laad() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!editBlog) return
    setOpslaan(true)
    await saveBlog(editBlog as Parameters<typeof saveBlog>[0])
    await laad()
    setEditBlog(null)
    setOpslaan(false)
  }

  async function verwijder(id: number) {
    if (!confirm('Blog verwijderen?')) return
    await verwijderBlog(id)
    await laad()
  }

  if (editBlog !== null) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditBlog(null)} className="text-sm font-display font-semibold" style={{ color: '#6a89aa', background: 'none', border: 'none', cursor: 'pointer' }}>← Terug</button>
          <h2 className="font-display font-black text-xl" style={{ color: '#e8f0fe' }}>{editBlog.id ? 'Blog bewerken' : 'Nieuw artikel'}</h2>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {/* Titel */}
          <div>
            <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Titel</label>
            <input type="text" value={editBlog.titel} required
              onChange={e => setEditBlog(prev => ({ ...prev!, titel: e.target.value, slug: prev!.id ? prev!.slug : slugify(e.target.value) }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>URL slug</label>
            <input type="text" value={editBlog.slug} required
              onChange={e => setEditBlog(prev => ({ ...prev!, slug: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#0affcb', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
            />
            <p className="text-xs mt-1" style={{ color: '#6a89aa' }}>pimmerce.com/kennisbank/{editBlog.slug || '...'}</p>
          </div>

          {/* Categorie + Gepubliceerd */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Categorie</label>
              <select value={editBlog.categorie}
                onChange={e => setEditBlog(prev => ({ ...prev!, categorie: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}>
                {CATEGORIEEN.map(c => <option key={c} value={c} style={{ background: '#040f1c' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Status</label>
              <button type="button"
                onClick={() => setEditBlog(prev => ({ ...prev!, gepubliceerd: !prev!.gepubliceerd }))}
                className="w-full rounded-xl px-4 py-3 text-sm font-display font-bold transition-all"
                style={{ background: editBlog.gepubliceerd ? 'rgba(10,255,203,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${editBlog.gepubliceerd ? 'rgba(10,255,203,.3)' : 'rgba(255,255,255,.09)'}`, color: editBlog.gepubliceerd ? '#0affcb' : '#6a89aa', cursor: 'pointer' }}>
                {editBlog.gepubliceerd ? '✓ Gepubliceerd' : 'Concept'}
              </button>
            </div>
          </div>

          {/* Beschrijving */}
          <div>
            <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Beschrijving (kort)</label>
            <textarea value={editBlog.beschrijving} rows={2}
              onChange={e => setEditBlog(prev => ({ ...prev!, beschrijving: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
            />
          </div>

          {/* Inhoud */}
          <div>
            <label className="block mb-1.5 font-display font-bold text-[11px] tracking-[.1em] uppercase" style={{ color: 'rgba(255,255,255,.5)' }}>Inhoud</label>
            <p className="text-xs mb-2" style={{ color: '#6a89aa' }}>Je kunt ## gebruiken voor kopjes en **tekst** voor vet.</p>
            <textarea value={editBlog.inhoud || ''} rows={14}
              onChange={e => setEditBlog(prev => ({ ...prev!, inhoud: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif', minHeight: '280px' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
            />
          </div>

          {/* Knoppen */}
          <div className="flex gap-3">
            <button type="submit" disabled={opslaan}
              className="flex-1 py-3 rounded-full font-display font-bold text-sm transition-all"
              style={{ background: opslaan ? 'rgba(10,255,203,.6)' : '#0affcb', color: '#020b14', boxShadow: '0 0 24px rgba(10,255,203,.3)', cursor: opslaan ? 'not-allowed' : 'pointer' }}>
              {opslaan ? 'Opslaan...' : 'Opslaan'}
            </button>
            <button type="button" onClick={() => setEditBlog(null)}
              className="px-6 py-3 rounded-full font-display font-bold text-sm"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#6a89aa', cursor: 'pointer' }}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-xl" style={{ color: '#e8f0fe' }}>Blogs</h2>
        <button onClick={() => setEditBlog({ ...LEEG_BLOG })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-sm transition-all"
          style={{ background: '#0affcb', color: '#020b14', boxShadow: '0 0 20px rgba(10,255,203,.3)', cursor: 'pointer', border: 'none' }}>
          <Plus className="w-4 h-4" /> Nieuw artikel
        </button>
      </div>

      {laden && (
        <div className="text-center py-10">
          <div className="w-6 h-6 rounded-full border-2 mx-auto animate-spin" style={{ borderColor: '#0affcb', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!laden && blogs.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6a89aa' }} />
          <p className="font-display font-semibold" style={{ color: '#e8f0fe' }}>Nog geen artikelen</p>
          <p className="text-sm mt-1" style={{ color: '#6a89aa' }}>Klik op "Nieuw artikel" om te beginnen.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {blogs.map(blog => (
          <div key={blog.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,255,203,.2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.07)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-display font-bold text-sm truncate" style={{ color: '#e8f0fe' }}>{blog.titel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-display font-bold shrink-0"
                  style={{ background: blog.gepubliceerd ? 'rgba(10,255,203,.1)' : 'rgba(255,255,255,.05)', color: blog.gepubliceerd ? '#0affcb' : '#6a89aa', border: `1px solid ${blog.gepubliceerd ? 'rgba(10,255,203,.2)' : 'rgba(255,255,255,.08)'}` }}>
                  {blog.gepubliceerd ? 'Gepubliceerd' : 'Concept'}
                </span>
              </div>
              <div className="text-xs" style={{ color: '#6a89aa' }}>
                {blog.categorie} · {new Date(blog.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={`/kennisbank/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all" style={{ color: '#6a89aa', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0affcb'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,255,203,.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6a89aa'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <Globe className="w-4 h-4" />
              </a>
              <button onClick={() => setEditBlog({ id: blog.id, titel: blog.titel, slug: blog.slug, beschrijving: blog.beschrijving || '', inhoud: blog.inhoud || '', categorie: blog.categorie || 'Webdesign', gepubliceerd: blog.gepubliceerd })}
                className="p-2 rounded-lg transition-all" style={{ color: '#6a89aa', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a8fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,143,255,.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6a89aa'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => verwijder(blog.id)}
                className="p-2 rounded-lg transition-all" style={{ color: 'rgba(255,80,80,.5)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════
   SEO TAB
══════════════════════════════════════════ */
interface SeoCheck {
  naam: string
  status: 'goed' | 'waarschuwing' | 'fout'
  waarde: string
  advies: string
  punten: number
  maxPunten: number
}

interface SeoScan {
  id: number
  url: string
  score: number
  title: string | null
  description: string | null
  checks: SeoCheck[]
  aangemaakt: string
}

function SeoTab() {
  const [scans, setScans]         = useState<SeoScan[]>([])
  const [url, setUrl]             = useState('https://pimmerce.com')
  const [laden, setLaden]         = useState(true)
  const [scanning, setScanning]   = useState(false)
  const [huidig, setHuidig]       = useState<SeoScan | null>(null)
  const [fout, setFout]           = useState('')

  async function laad() {
    setLaden(true)
    const data = await getSeoScans()
    const lijst = data as SeoScan[]
    setScans(lijst)
    if (lijst.length > 0) setHuidig(lijst[0])
    setLaden(false)
  }

  useEffect(() => { laad() }, [])

  async function scan() {
    if (!url || scanning) return
    setScanning(true)
    setFout('')
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.error) { setFout(data.error); setScanning(false); return }
      await laad()
    } catch {
      setFout('Kan pagina niet scannen.')
    }
    setScanning(false)
  }

  async function verwijder(id: number) {
    await verwijderSeoScan(id)
    const nieuw = scans.filter(s => s.id !== id)
    setScans(nieuw)
    if (huidig?.id === id) setHuidig(nieuw[0] || null)
  }

  function scoreKleur(score: number): string {
    if (score >= 80) return '#0affcb'
    if (score >= 50) return '#ffa032'
    return '#ff5050'
  }

  function exportPdf() {
    if (!huidig) return
    const datum = new Date(huidig.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    const checks = huidig.checks || []
    const goedChecks = checks.filter(c => c.status === 'goed').length
    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>SEO Rapport — ${huidig.url}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
  .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 3px solid #0affcb; margin-bottom: 32px; }
  .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #020b14; }
  .logo span { color: #0affcb; }
  .meta { text-align: right; font-size: 12px; color: #666; }
  .meta strong { display: block; font-size: 14px; color: #020b14; margin-bottom: 2px; }
  .score-section { display: flex; align-items: center; gap: 32px; background: #f8f9ff; border-radius: 16px; padding: 28px; margin-bottom: 32px; border-left: 6px solid ${scoreKleur(huidig.score)}; }
  .score-circle { text-align: center; }
  .score-num { font-size: 72px; font-weight: 900; line-height: 1; color: ${scoreKleur(huidig.score)}; }
  .score-label { font-size: 13px; color: #666; margin-top: 4px; }
  .score-info h2 { font-size: 20px; font-weight: 700; color: #020b14; margin-bottom: 8px; }
  .score-info p { font-size: 14px; color: #555; line-height: 1.6; }
  .score-info .url { font-size: 13px; color: #0affcb; font-weight: 600; margin-top: 6px; }
  .stats { display: flex; gap: 16px; margin-top: 12px; }
  .stat { background: #fff; border-radius: 8px; padding: 10px 16px; border: 1px solid #eee; font-size: 13px; }
  .stat strong { display: block; font-size: 18px; font-weight: 700; }
  h3.sectie { font-size: 16px; font-weight: 700; color: #020b14; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #f0f0f0; }
  .check { display: flex; gap: 14px; padding: 14px; border-radius: 10px; margin-bottom: 10px; border: 1px solid #eee; background: #fafafa; }
  .check.goed { border-left: 4px solid #0affcb; }
  .check.waarschuwing { border-left: 4px solid #ffa032; }
  .check.fout { border-left: 4px solid #ff5050; }
  .check-icon { font-size: 18px; margin-top: 1px; }
  .check-naam { font-weight: 700; font-size: 14px; color: #1a1a2e; margin-bottom: 2px; }
  .check-waarde { font-size: 12px; color: #666; margin-bottom: 4px; }
  .check-advies { font-size: 12px; color: #444; background: #fff; border-radius: 6px; padding: 8px 10px; border: 1px solid #eee; }
  .check-score { font-size: 12px; font-weight: 700; color: #666; white-space: nowrap; margin-top: 2px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
  .footer-logo { font-weight: 900; font-size: 16px; color: #020b14; }
  .footer-logo span { color: #0affcb; }
  .footer-text { font-size: 11px; color: #999; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Pimm<span>erce</span></div>
    <div class="meta">
      <strong>SEO Rapport</strong>
      ${datum}
    </div>
  </div>

  <div class="score-section">
    <div class="score-circle">
      <div class="score-num">${huidig.score}</div>
      <div class="score-label">/ 100</div>
    </div>
    <div class="score-info">
      <h2>${huidig.score >= 80 ? '✅ Goede SEO score' : huidig.score >= 50 ? '⚠️ SEO kan beter' : '❌ SEO verbetering nodig'}</h2>
      <p>${huidig.score >= 80 ? 'Je pagina is goed geoptimaliseerd voor zoekmachines.' : huidig.score >= 50 ? 'Er zijn een aantal verbeterpunten die je SEO kunnen versterken.' : 'Er zijn significante verbeterpunten om je vindbaarheid te verhogen.'}</p>
      <div class="url">${huidig.url}</div>
      <div class="stats">
        <div class="stat"><strong style="color:#0affcb">${goedChecks}</strong>Goed</div>
        <div class="stat"><strong style="color:#ffa032">${checks.filter(c => c.status === 'waarschuwing').length}</strong>Waarschuwing</div>
        <div class="stat"><strong style="color:#ff5050">${checks.filter(c => c.status === 'fout').length}</strong>Fout</div>
      </div>
    </div>
  </div>

  <h3 class="sectie">Gedetailleerde analyse</h3>

  ${checks.map(c => `
  <div class="check ${c.status}">
    <div class="check-icon">${c.status === 'goed' ? '✅' : c.status === 'waarschuwing' ? '⚠️' : '❌'}</div>
    <div style="flex:1">
      <div class="check-naam">${c.naam}</div>
      <div class="check-waarde">${c.waarde}</div>
      ${c.status !== 'goed' ? `<div class="check-advies">💡 ${c.advies}</div>` : ''}
    </div>
    <div class="check-score">${c.punten}/${c.maxPunten}</div>
  </div>`).join('')}

  <div class="footer">
    <div class="footer-logo">Pimm<span>erce</span></div>
    <div class="footer-text">Gegenereerd door Pimmerce Dashboard · pimmerce.com</div>
  </div>
</body>
</html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.print() }, 500)
  }

  function statusIcon(status: string) {
    if (status === 'goed') return <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#0affcb' }} />
    if (status === 'waarschuwing') return <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#ffa032' }} />
    return <XCircle className="w-4 h-4 shrink-0" style={{ color: '#ff5050' }} />
  }

  // Grafiek data — laatste 10 scans omgekeerd
  const grafiekData = [...scans].reverse().slice(-10)

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display font-black text-xl" style={{ color: '#e8f0fe' }}>SEO Checker</h2>

      {/* Scanner */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
        <h3 className="font-display font-bold text-sm mb-3" style={{ color: '#e8f0fe' }}>Pagina scannen</h3>
        <div className="flex gap-3 flex-wrap">
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://pimmerce.com"
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', color: '#e8f0fe', fontFamily: 'DM Sans, sans-serif', minWidth: '200px' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(10,255,203,.35)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)' }}
            onKeyDown={e => { if (e.key === 'Enter') scan() }}
          />
          <button onClick={scan} disabled={scanning}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm transition-all"
            style={{ background: scanning ? 'rgba(10,255,203,.6)' : '#0affcb', color: '#020b14', cursor: scanning ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(10,255,203,.3)' }}>
            <Search className="w-4 h-4" />
            {scanning ? 'Scannen...' : 'Scan'}
          </button>
        </div>
        {fout && <p className="mt-2 text-sm" style={{ color: '#ff5050' }}>{fout}</p>}
      </div>

      {laden && (
        <div className="text-center py-10">
          <div className="w-6 h-6 rounded-full border-2 mx-auto animate-spin" style={{ borderColor: '#0affcb', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!laden && scans.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6a89aa' }} />
          <p className="font-display font-semibold" style={{ color: '#e8f0fe' }}>Nog geen scans</p>
          <p className="text-sm mt-1" style={{ color: '#6a89aa' }}>Scan een pagina om je SEO te analyseren.</p>
        </div>
      )}

      {!laden && scans.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Scan geschiedenis */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-sm" style={{ color: '#6a89aa' }}>Geschiedenis</h3>
            {scans.map(scan => (
              <div key={scan.id}
                className="p-4 rounded-2xl cursor-pointer transition-all"
                onClick={() => setHuidig(scan)}
                style={{ background: huidig?.id === scan.id ? 'rgba(10,255,203,.06)' : 'rgba(255,255,255,.03)', border: `1px solid ${huidig?.id === scan.id ? 'rgba(10,255,203,.2)' : 'rgba(255,255,255,.07)'}` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display font-bold text-xs truncate max-w-[140px]" style={{ color: '#e8f0fe' }}>
                    {scan.url.replace('https://', '').replace('http://', '')}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-display font-black text-sm" style={{ color: scoreKleur(scan.score) }}>{scan.score}</span>
                    <button onClick={e => { e.stopPropagation(); verwijder(scan.id) }}
                      className="p-1 rounded-lg transition-all"
                      style={{ color: 'rgba(255,80,80,.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,.4)' }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-[10px]" style={{ color: '#6a89aa' }}>
                  {new Date(scan.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Rapport */}
          {huidig && (
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Score cirkel */}
              <div className="rounded-2xl p-6 text-center relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,.03)', border: `2px solid ${scoreKleur(huidig.score)}33` }}>
                <button onClick={exportPdf}
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all"
                  style={{ background: 'rgba(10,255,203,.1)', border: '1px solid rgba(10,255,203,.2)', color: '#0affcb', cursor: 'pointer' }}>
                  📄 Export PDF
                </button>
                <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: `linear-gradient(90deg,transparent,${scoreKleur(huidig.score)},transparent)` }} />
                <div className="font-display font-black mb-1" style={{ fontSize: '4rem', lineHeight: 1, color: scoreKleur(huidig.score) }}>
                  {huidig.score}
                </div>
                <div className="font-display font-bold text-sm mb-1" style={{ color: '#e8f0fe' }}>
                  {huidig.score >= 80 ? '🟢 Goed' : huidig.score >= 50 ? '🟠 Kan beter' : '🔴 Verbetering nodig'}
                </div>
                <div className="text-xs" style={{ color: '#6a89aa' }}>{huidig.url}</div>
              </div>

              {/* Grafiek */}
              {grafiekData.length > 1 && (
                <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4" style={{ color: '#0affcb' }} />
                    <h3 className="font-display font-bold text-sm" style={{ color: '#e8f0fe' }}>Score progressie</h3>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {grafiekData.map((s, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-[9px] font-display font-bold" style={{ color: scoreKleur(s.score) }}>{s.score}</div>
                        <div className="w-full rounded-t-lg transition-all"
                          style={{ height: `${(s.score / 100) * 72}px`, background: s.id === huidig.id ? scoreKleur(s.score) : `${scoreKleur(s.score)}60`, minHeight: '4px' }} />
                        <div className="text-[8px]" style={{ color: '#6a89aa' }}>
                          {new Date(s.aangemaakt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checks */}
              <div className="flex flex-col gap-2">
                {huidig.checks?.map((check, i) => (
                  <div key={i} className="rounded-xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    {statusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-display font-bold text-sm" style={{ color: '#e8f0fe' }}>{check.naam}</span>
                        <span className="text-xs font-display font-semibold shrink-0" style={{ color: scoreKleur((check.punten / check.maxPunten) * 100) }}>
                          {check.punten}/{check.maxPunten}
                        </span>
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#6a89aa' }}>{check.waarde}</div>
                      {check.status !== 'goed' && (
                        <div className="text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,.03)', color: '#a8b8d0' }}>
                          💡 {check.advies}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   AANVRAGEN TAB
══════════════════════════════════════════ */
function AanvragenTab() {
  const [aanvragen, setAanvragen] = useState<Aanvraag[]>([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState<Aanvraag | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load(showRefresh = false) {
    if (showRefresh) setRefreshing(true); else setLoading(true)
    const data = await getContacten()
    setAanvragen(data as Aanvraag[])
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  function formatAanvraagDatum(d: string) {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const dienstLabel: Record<string, string> = {
    website: 'Volledige website', 'ai-marketing': 'AI Marketing',
    ecommerce: 'E-commerce', anders: 'Anders',
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-xl" style={{ color: '#e8f0fe' }}>Aanvragen</h2>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-display font-semibold"
          style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#6a89aa', cursor: refreshing ? 'not-allowed' : 'pointer' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Vernieuwen
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Totaal',       value: aanvragen.length,                                          color: '#0affcb' },
          { label: 'Website',      value: aanvragen.filter(a => a.dienst === 'website').length,      color: '#0a8fff' },
          { label: 'AI Marketing', value: aanvragen.filter(a => a.dienst === 'ai-marketing').length, color: '#a064ff' },
          { label: 'E-commerce',   value: aanvragen.filter(a => a.dienst === 'ecommerce').length,    color: '#ffa032' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="font-display font-black text-2xl mb-1" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
            <div className="text-xs font-display font-semibold tracking-wider uppercase" style={{ color: '#6a89aa' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
            <h3 className="font-display font-bold text-sm" style={{ color: '#e8f0fe' }}>Alle aanvragen</h3>
          </div>
          {loading && (
            <div className="p-8 text-center">
              <div className="w-6 h-6 rounded-full border-2 mx-auto mb-3 animate-spin" style={{ borderColor: '#0affcb', borderTopColor: 'transparent' }} />
            </div>
          )}
          {!loading && aanvragen.length === 0 && (
            <div className="p-8 text-center">
              <Mail className="w-10 h-10 mx-auto mb-3" style={{ color: '#6a89aa', opacity: .4 }} />
              <p className="text-sm font-display font-semibold" style={{ color: '#e8f0fe' }}>Nog geen aanvragen</p>
            </div>
          )}
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
            {aanvragen.map(a => (
              <button key={a.id} onClick={() => setSelected(a)}
                className="w-full flex items-center gap-3 p-4 text-left transition-all"
                style={{ background: selected?.id === a.id ? 'rgba(10,255,203,.06)' : 'transparent', borderLeft: selected?.id === a.id ? '2px solid #0affcb' : '2px solid transparent', cursor: 'pointer' }}
                onMouseEnter={e => { if (selected?.id !== a.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)' }}
                onMouseLeave={e => { if (selected?.id !== a.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-display font-black text-sm"
                  style={{ background: 'rgba(10,255,203,.1)', color: '#0affcb', border: '1px solid rgba(10,255,203,.15)' }}>
                  {a.naam[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm truncate" style={{ color: '#e8f0fe' }}>{a.naam}</div>
                  <div className="text-xs truncate" style={{ color: '#6a89aa' }}>{a.email}</div>
                </div>
                <div className="text-[10px] shrink-0" style={{ color: '#6a89aa' }}>
                  {formatAanvraagDatum(a.aangemaakt).split(',')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
              <Mail className="w-10 h-10 mb-3" style={{ color: '#6a89aa', opacity: .3 }} />
              <p className="text-sm font-display font-semibold" style={{ color: '#6a89aa' }}>Selecteer een aanvraag</p>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-display font-black text-lg" style={{ color: '#e8f0fe' }}>{selected.naam}</h3>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#6a89aa' }}>
                    <Clock className="w-3 h-3" />{formatAanvraagDatum(selected.aangemaakt)}
                  </p>
                </div>
                {selected.dienst && (
                  <span className="text-[10px] px-2 py-1 rounded-full font-display font-bold uppercase shrink-0"
                    style={{ background: 'rgba(10,255,203,.1)', color: '#0affcb', border: '1px solid rgba(10,255,203,.2)' }}>
                    {dienstLabel[selected.dienst] || selected.dienst}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <Mail className="w-4 h-4 shrink-0" style={{ color: '#0affcb' }} />
                  <div>
                    <div className="text-[10px] font-display font-bold uppercase tracking-wider mb-0.5" style={{ color: '#6a89aa' }}>E-mail</div>
                    <a href={`mailto:${selected.email}`} className="text-sm" style={{ color: '#e8f0fe', textDecoration: 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0affcb' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#e8f0fe' }}>
                      {selected.email}
                    </a>
                  </div>
                </div>
                {selected.bedrijf && (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <Building2 className="w-4 h-4 shrink-0" style={{ color: '#0affcb' }} />
                    <div>
                      <div className="text-[10px] font-display font-bold uppercase tracking-wider mb-0.5" style={{ color: '#6a89aa' }}>Bedrijf</div>
                      <div className="text-sm" style={{ color: '#e8f0fe' }}>{selected.bedrijf}</div>
                    </div>
                  </div>
                )}
                {selected.bericht && (
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div className="text-[10px] font-display font-bold uppercase tracking-wider mb-2" style={{ color: '#6a89aa' }}>Bericht</div>
                    <p className="text-sm leading-relaxed" style={{ color: '#e8f0fe' }}>{selected.bericht}</p>
                  </div>
                )}
                <a href={`mailto:${selected.email}?subject=Re: Jouw aanvraag bij Pimmerce`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full font-display font-bold text-sm mt-2"
                  style={{ background: '#0affcb', color: '#020b14', boxShadow: '0 0 24px rgba(10,255,203,.3)', textDecoration: 'none' }}>
                  <Mail className="w-4 h-4" /> Beantwoorden
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
type Tab = 'aanvragen' | 'tijd' | 'blogs' | 'seo'

function Dashboard({ onLogout }: { onLogout: () => Promise<void> }) {
  const [tab, setTab] = useState<Tab>('aanvragen')

  return (
    <div className="min-h-screen" style={{ background: '#020b14' }}>
      <div className="sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ background: 'rgba(2,11,20,.9)', borderBottom: '1px solid rgba(255,255,255,.07)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(10,255,203,.1)', border: '1px solid rgba(10,255,203,.2)' }}>
            <span className="text-sm">⚡</span>
          </div>
          <span className="font-display font-black text-sm"
            style={{ background: 'linear-gradient(130deg,#fff 30%,#0affcb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Pimmerce
          </span>
          <div className="flex gap-1 ml-2">
            {([['aanvragen', 'Aanvragen'], ['tijd', 'Uren'], ['blogs', 'Blogs'], ['seo', 'SEO']] as [Tab, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className="px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all"
                style={{ background: tab === id ? 'rgba(10,255,203,.1)' : 'transparent', color: tab === id ? '#0affcb' : '#6a89aa', border: `1px solid ${tab === id ? 'rgba(10,255,203,.2)' : 'transparent'}`, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onLogout}
          className="px-3 py-2 rounded-xl text-xs font-display font-semibold"
          style={{ background: 'rgba(255,80,80,.08)', border: '1px solid rgba(255,80,80,.15)', color: 'rgba(255,80,80,.8)', cursor: 'pointer' }}>
          Uitloggen
        </button>
      </div>

      <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
        {tab === 'aanvragen' && <AanvragenTab />}
        {tab === 'tijd'      && <TijdTab />}
        {tab === 'blogs'     && <BlogsTab />}
        {tab === 'seo'       && <SeoTab />}
        <p className="text-center mt-8 text-xs" style={{ color: 'rgba(255,255,255,.1)' }}>
          Pimmerce Dashboard · {new Date().getFullYear()}
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .animate-spin{animation:spin 1s linear infinite}`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    isAuthenticated().then(ok => setAuthed(ok))
  }, [])

  function login() { setAuthed(true) }

  async function doLogout() {
    await serverLogout()
    setAuthed(false)
  }

  // Toon niks tijdens laden — geen HTML lekken
  if (authed === null) return (
    <div style={{ background: '#020b14', minHeight: '100vh' }} />
  )

  // Niet ingelogd — alleen loginscherm, geen dashboard HTML
  if (!authed) return (
    <div style={{ background: '#020b14', minHeight: '100vh' }}>
      <Cursor />
      <LoginScreen onLogin={login} />
    </div>
  )

  // Ingelogd — volledig dashboard
  return (
    <div style={{ background: '#020b14', minHeight: '100vh' }}>
      <Cursor />
      <Dashboard onLogout={doLogout} />
    </div>
  )
}

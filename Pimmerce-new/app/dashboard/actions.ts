'use server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

function supabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Genereer een veilige token op basis van het wachtwoord + een geheime salt
function generateToken(): string {
  const salt = process.env.DASHBOARD_PASSWORD! + 'pimmerce_salt_2026'
  return crypto.createHash('sha256').update(salt).digest('hex')
}

export async function checkPassword(pw: string): Promise<boolean> {
  const ok = pw === process.env.DASHBOARD_PASSWORD
  if (ok) {
    const cookieStore = await cookies()
    cookieStore.set('pm_token', generateToken(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 uur
      path: '/',
    })
  }
  return ok
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('pm_token')
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('pm_token')?.value
  if (!token) return false
  return token === generateToken()
}

export async function requireAuth() {
  const ok = await isAuthenticated()
  if (!ok) redirect('/dashboard')
}

export async function getContacten() {
  await requireAuth()
  const { data, error } = await supabase()
    .from('contacten')
    .select('*')
    .order('aangemaakt', { ascending: false })
    .limit(50)
  if (error) return []
  return data
}

export async function startUur(project: string, notitie: string, start_tijd: number) {
  await requireAuth()
  const { data, error } = await supabase()
    .from('uren')
    .insert([{ project, notitie, start_tijd }])
    .select()
    .single()
  if (error) return null
  return data
}

export async function stopUur(id: number, eind_tijd: number) {
  await requireAuth()
  const { error } = await supabase()
    .from('uren')
    .update({ eind_tijd })
    .eq('id', id)
  return !error
}

export async function getUren() {
  await requireAuth()
  const { data, error } = await supabase()
    .from('uren')
    .select('*')
    .order('start_tijd', { ascending: false })
  if (error) return []
  return data
}

export async function verwijderUur(id: number) {
  await requireAuth()
  const { error } = await supabase()
    .from('uren')
    .delete()
    .eq('id', id)
  return !error
}

// ── BLOG FUNCTIES ──────────────────────────────

export async function getBlogs() {
  const { data, error } = await supabase()
    .from('blogs')
    .select('*')
    .order('aangemaakt', { ascending: false })
  if (error) return []
  return data
}

export async function saveBlog(blog: {
  id?: number
  titel: string
  slug: string
  beschrijving: string
  inhoud: string
  categorie: string
  gepubliceerd: boolean
}) {
  await requireAuth()
  if (blog.id) {
    const { error } = await supabase()
      .from('blogs')
      .update({ ...blog, bijgewerkt: new Date().toISOString() })
      .eq('id', blog.id)
    return !error
  } else {
    const { error } = await supabase()
      .from('blogs')
      .insert([{ ...blog, bijgewerkt: new Date().toISOString() }])
    return !error
  }
}

export async function verwijderBlog(id: number) {
  await requireAuth()
  const { error } = await supabase()
    .from('blogs')
    .delete()
    .eq('id', id)
  return !error
}

// ── SEO FUNCTIES ──────────────────────────────

export async function getSeoScans() {
  await requireAuth()
  const { data, error } = await supabase()
    .from('seo_scans')
    .select('*')
    .order('aangemaakt', { ascending: false })
    .limit(50)
  if (error) return []
  return data
}

export async function verwijderSeoScan(id: number) {
  await requireAuth()
  const { error } = await supabase()
    .from('seo_scans')
    .delete()
    .eq('id', id)
  return !error
}

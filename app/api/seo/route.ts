import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function supabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface Check {
  naam: string
  status: 'goed' | 'waarschuwing' | 'fout'
  waarde: string
  advies: string
  punten: number
  maxPunten: number
}

export async function POST(req: NextRequest) {
  try {
    // Auth check — alleen ingelogde gebruiker mag scannen
    const cookieStore = req.cookies
    const token = cookieStore.get('pm_token')?.value
    const verwacht = require('crypto')
      .createHash('sha256')
      .update((process.env.DASHBOARD_PASSWORD || '') + 'pimmerce_salt_2026')
      .digest('hex')

    if (!token || token !== verwacht) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL verplicht' }, { status: 400 })

    const cleanUrl = url.startsWith('http') ? url : `https://${url}`

    const response = await fetch(cleanUrl, {
      headers: { 'User-Agent': 'PimmerceSeoBot/1.0' },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Pagina niet bereikbaar (${response.status})` }, { status: 400 })
    }

    const html = await response.text()
    const checks: Check[] = []

    // ── Title ──────────────────────────────────────
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    if (!title) {
      checks.push({ naam: 'Title tag', status: 'fout', waarde: 'Ontbreekt', advies: 'Voeg een <title> toe aan je pagina. Dit is het belangrijkste SEO element.', punten: 0, maxPunten: 15 })
    } else if (title.length < 30) {
      checks.push({ naam: 'Title tag', status: 'waarschuwing', waarde: `"${title}" (${title.length} tekens)`, advies: 'Je title is te kort. Maak hem 50-60 tekens voor optimale weergave in Google.', punten: 8, maxPunten: 15 })
    } else if (title.length > 60) {
      checks.push({ naam: 'Title tag', status: 'waarschuwing', waarde: `"${title.slice(0,50)}..." (${title.length} tekens)`, advies: 'Je title is te lang. Google knipt alles boven 60 tekens af.', punten: 8, maxPunten: 15 })
    } else {
      checks.push({ naam: 'Title tag', status: 'goed', waarde: `"${title}" (${title.length} tekens)`, advies: 'Prima! Je title heeft de juiste lengte.', punten: 15, maxPunten: 15 })
    }

    // ── Meta description ───────────────────────────
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
    const desc = descMatch ? descMatch[1].trim() : ''
    if (!desc) {
      checks.push({ naam: 'Meta description', status: 'fout', waarde: 'Ontbreekt', advies: 'Voeg een meta description toe. Dit is de tekst die Google toont in zoekresultaten.', punten: 0, maxPunten: 15 })
    } else if (desc.length < 100) {
      checks.push({ naam: 'Meta description', status: 'waarschuwing', waarde: `${desc.length} tekens`, advies: 'Je description is te kort. Maak hem 150-160 tekens voor meer klikken uit Google.', punten: 8, maxPunten: 15 })
    } else if (desc.length > 160) {
      checks.push({ naam: 'Meta description', status: 'waarschuwing', waarde: `${desc.length} tekens`, advies: 'Je description is te lang. Google knipt alles boven 160 tekens af.', punten: 8, maxPunten: 15 })
    } else {
      checks.push({ naam: 'Meta description', status: 'goed', waarde: `${desc.length} tekens`, advies: 'Prima! Je description heeft de juiste lengte.', punten: 15, maxPunten: 15 })
    }

    // ── H1 ────────────────────────────────────────
    const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || []
    const h1Count = h1Matches.length
    if (h1Count === 0) {
      checks.push({ naam: 'H1 kop', status: 'fout', waarde: 'Geen H1 gevonden', advies: 'Voeg een <h1> toe aan elke pagina. Dit is de hoofdkop die Google gebruikt om de pagina te begrijpen.', punten: 0, maxPunten: 10 })
    } else if (h1Count > 1) {
      checks.push({ naam: 'H1 kop', status: 'waarschuwing', waarde: `${h1Count} H1 koppen gevonden`, advies: 'Je hebt meerdere H1 koppen. Gebruik slechts één H1 per pagina.', punten: 5, maxPunten: 10 })
    } else {
      checks.push({ naam: 'H1 kop', status: 'goed', waarde: '1 H1 kop gevonden', advies: 'Perfect! Je pagina heeft precies één H1 kop.', punten: 10, maxPunten: 10 })
    }

    // ── Alt teksten ───────────────────────────────
    const allImgs = (html.match(/<img[^>]+>/gi) || []).length
    const imgsWithAlt = (html.match(/<img[^>]+alt=["'][^"']+["'][^>]*>/gi) || []).length
    if (allImgs === 0) {
      checks.push({ naam: 'Alt teksten', status: 'goed', waarde: 'Geen afbeeldingen', advies: 'Geen afbeeldingen gevonden op deze pagina.', punten: 10, maxPunten: 10 })
    } else if (imgsWithAlt < allImgs) {
      const missing = allImgs - imgsWithAlt
      checks.push({ naam: 'Alt teksten', status: 'waarschuwing', waarde: `${imgsWithAlt}/${allImgs} afbeeldingen hebben alt tekst`, advies: `${missing} afbeelding(en) missen een alt tekst. Alt teksten helpen Google afbeeldingen te begrijpen.`, punten: Math.round((imgsWithAlt / allImgs) * 10), maxPunten: 10 })
    } else {
      checks.push({ naam: 'Alt teksten', status: 'goed', waarde: `Alle ${allImgs} afbeeldingen hebben alt tekst`, advies: 'Prima! Al je afbeeldingen hebben een alt tekst.', punten: 10, maxPunten: 10 })
    }

    // ── Open Graph ────────────────────────────────
    const hasOgTitle = /<meta[^>]*property=["']og:title["']/i.test(html)
    const hasOgDesc  = /<meta[^>]*property=["']og:description["']/i.test(html)
    const hasOgImage = /<meta[^>]*property=["']og:image["']/i.test(html)
    const ogScore = [hasOgTitle, hasOgDesc, hasOgImage].filter(Boolean).length
    if (ogScore === 3) {
      checks.push({ naam: 'Open Graph', status: 'goed', waarde: 'Title, description en image aanwezig', advies: 'Uitstekend! Je pagina is geoptimaliseerd voor delen op sociale media.', punten: 10, maxPunten: 10 })
    } else if (ogScore > 0) {
      checks.push({ naam: 'Open Graph', status: 'waarschuwing', waarde: `${ogScore}/3 OG tags aanwezig`, advies: `Voeg ${!hasOgTitle ? 'og:title, ' : ''}${!hasOgDesc ? 'og:description, ' : ''}${!hasOgImage ? 'og:image' : ''} toe voor betere weergave op sociale media.`, punten: Math.round((ogScore / 3) * 10), maxPunten: 10 })
    } else {
      checks.push({ naam: 'Open Graph', status: 'fout', waarde: 'Geen OG tags gevonden', advies: 'Voeg Open Graph meta tags toe voor een mooie weergave als je de link deelt op social media.', punten: 0, maxPunten: 10 })
    }

    // ── HTTPS ─────────────────────────────────────
    const isHttps = cleanUrl.startsWith('https')
    checks.push({
      naam: 'HTTPS',
      status: isHttps ? 'goed' : 'fout',
      waarde: isHttps ? 'Actief' : 'Niet actief',
      advies: isHttps ? 'Je site gebruikt HTTPS. Google geeft voorkeur aan beveiligde sites.' : 'Zet HTTPS aan. Google geeft voorkeur aan beveiligde sites en browsers tonen een waarschuwing.',
      punten: isHttps ? 10 : 0,
      maxPunten: 10
    })

    // ── Canonical ─────────────────────────────────
    const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html)
    checks.push({
      naam: 'Canonical tag', status: hasCanonical ? 'goed' : 'waarschuwing',
      waarde: hasCanonical ? 'Aanwezig' : 'Ontbreekt',
      advies: hasCanonical ? 'Goed! Je canonical tag voorkomt duplicate content problemen.' : 'Voeg een canonical tag toe om duplicate content problemen te voorkomen.',
      punten: hasCanonical ? 10 : 5, maxPunten: 10
    })

    // ── Robots meta ───────────────────────────────
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)
    const robots = robotsMatch ? robotsMatch[1] : ''
    const isIndexable = !robots || (!robots.includes('noindex') && !robots.includes('nofollow'))
    checks.push({
      naam: 'Robots meta', status: isIndexable ? 'goed' : 'fout',
      waarde: robots || 'index, follow (standaard)',
      advies: isIndexable ? 'Je pagina is vindbaar voor zoekmachines.' : 'Je pagina staat ingesteld als niet-indexeerbaar. Google kan hem niet vinden.',
      punten: isIndexable ? 10 : 0, maxPunten: 10
    })

    // ── Score berekenen ───────────────────────────
    const totaalPunten = checks.reduce((acc, c) => acc + c.punten, 0)
    const maxPunten    = checks.reduce((acc, c) => acc + c.maxPunten, 0)
    const score        = Math.round((totaalPunten / maxPunten) * 100)

    // ── Opslaan in Supabase ───────────────────────
    await supabase()
      .from('seo_scans')
      .insert([{ url: cleanUrl, score, title, description: desc, checks }])

    return NextResponse.json({ score, title, description: desc, checks, url: cleanUrl })

  } catch (err) {
    console.error('SEO scan error:', err)
    return NextResponse.json({ error: 'Kan pagina niet scannen.' }, { status: 500 })
  }
}

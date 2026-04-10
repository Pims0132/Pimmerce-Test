import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { naam, email } = await req.json()
    if (!naam || !email) {
      return NextResponse.json({ error: 'Naam en email zijn verplicht' }, { status: 400 })
    }
    // Test omgeving: APIs uitgeschakeld
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}

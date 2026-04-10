import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Niet beschikbaar in testomgeving' }, { status: 503 })
}

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function generateToken(): string {
  const salt = process.env.DASHBOARD_PASSWORD! + 'pimmerce_salt_2026'
  return crypto.createHash('sha256').update(salt).digest('hex')
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('pm_token')?.value

  // Geen geldige token → terug naar dashboard (loginscherm)
  if (!token || token !== generateToken()) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [], // Laat leeg totdat je subroutes hebt
}

import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pimmerce — AI, Webdesign & E-commerce Tilburg',
  description: 'Pimmerce bouwt professionele websites, AI marketing en e-commerce oplossingen voor bedrijven in Tilburg en omgeving. Persoonlijk contact, moderne technologie en resultaatgericht.',
  keywords: 'webdesign Tilburg, website laten maken Tilburg, AI marketing, e-commerce optimalisatie, digitaal bureau Tilburg',
  authors: [{ name: 'Pim — Pimmerce' }],
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'Pimmerce — AI, Webdesign & E-commerce Tilburg',
    description: 'Wij helpen bedrijven groeien met websites, AI marketing en e-commerce strategie die echt resultaat opleveren.',
    url: 'https://www.pimmerce.com',
    siteName: 'Pimmerce',
    locale: 'nl_NL',
    images: [{ url: 'https://www.pimmerce.com/images/Pim-pimmerce.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pimmerce — AI, Webdesign & E-commerce Tilburg',
    description: 'Wij helpen bedrijven groeien met websites, AI marketing en e-commerce strategie die echt resultaat opleveren.',
    images: ['https://www.pimmerce.com/images/Pim-pimmerce.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

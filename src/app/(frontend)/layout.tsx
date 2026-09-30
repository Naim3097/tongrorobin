import type { Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'
import React from 'react'

import './site.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0E0D0C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" className={`${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}

import './globals.css'
import type { Metadata } from 'next'
import { jetbrainsMono, jersey } from './fonts'

export const metadata: Metadata = {
  title: 'Flappy Caster',
  description: 'Play and become the best Flappy in the whole Warpcast',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${jetbrainsMono.variable} ${jersey.variable}`}>
      <head>
        <link rel="preload" href="/fonts/JetBrainsMono-Thin.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Jersey10-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}

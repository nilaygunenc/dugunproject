import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Özel Anlar — Düğününüzün ortak hafızası',
  description: 'Davetlileriniz QR kodla fotoğraf, video ve mesaj paylaşsın; düğününüzün tüm anıları tek bir özel galeride buluşsun.',
  openGraph: {
    title: 'Özel anlar. Bir arada.',
    description: 'Özel anlarınızın fotoğraf ve videolarını tek bir dijital arşivde buluşturun.',
    images: [{ url: '/hero-editorial-no-text.png', width: 1536, height: 1024, alt: 'Özel anlar. Bir arada.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Özel anlar. Bir arada.',
    description: 'Özel anlarınızın fotoğraf ve videolarını tek bir dijital arşivde buluşturun.',
    images: ['/hero-editorial-no-text.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  )
}

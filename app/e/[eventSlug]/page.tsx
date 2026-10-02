'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import heroEditorial from '../../../public/hero-editorial-no-text.png'
import { motion } from 'framer-motion'
import UploadFormNew from '@/components/UploadFormNew'
import GalleryNew from '@/components/GalleryNew'
import { getTheme, generateThemeCSS, type EventType } from '@/lib/themes'

export default function GuestEventPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventSlug = params.eventSlug as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload')

  // Etkinlik bilgilerini yükle
  useEffect(() => {
    fetchEvent()
  }, [eventSlug])

  const fetchEvent = async () => {
    try {
      // Mock data (gerçek uygulamada API'den gelecek)
      setTimeout(() => {
        setEvent({
          id: 1,
          event_name: 'Ayşe & Mehmet',
          event_type: 'wedding', // Bu dinamik olarak gelecek
          event_date: '2026-06-15',
          slug: eventSlug,
          welcome_title: 'Düğünümüze Hoş Geldiniz! 💍',
          welcome_subtitle: 'Bu özel günü bizimle paylaştığınız için teşekkür ederiz. Anılarınızı bizimle paylaşın!',
          upload_instructions: 'Fotoğraf ve videolarınızı yükleyerek bu özel günün bir parçası olun.',
          thank_you_message: 'Paylaşımlarınız için teşekkürler! ❤️'
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Etkinlik yüklenemedi:', error)
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    setActiveTab('gallery')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-sage-50 to-peach-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-peach-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-earth-700 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-sage-50 to-peach-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Etkinlik Bulunamadı
          </h1>
          <p className="text-earth-600">
            Bu etkinlik mevcut değil veya kaldırılmış olabilir.
          </p>
        </div>
      </div>
    )
  }

  // Temayı al
  const theme = getTheme(event.event_type as EventType)
  const themeCSS = generateThemeCSS(theme)

  if (searchParams.get('view') === 'slideshow') {
    return (
      <main className="slideshow-experience">
        <Image src={heroEditorial} alt="Düğün anılarından canlı gösterim" fill priority sizes="100vw" />
        <div className="slideshow-shade" />
        <header><span className="slideshow-live"><i /> CANLI</span><span>ÖZEL ANLAR / {event.event_name}</span></header>
        <section>
          <p>DAVETLİLERİN GÖZÜNDEN</p>
          <h1>Bir gece.<br />Binlerce anı.</h1>
          <blockquote>“İyi ki bu geceyi bizimle paylaştınız.”</blockquote>
          <span className="slideshow-author">— AYŞE & MEHMET</span>
        </section>
        <aside><div className="slideshow-qr">QR</div><p>ANINI PAYLAŞ<br /><b>/e/{eventSlug}</b></p></aside>
        <footer><span>YENİ FOTOĞRAFLAR OTOMATİK OLARAK GÖRÜNÜR</span><span>01 / 24</span></footer>
      </main>
    )
  }

  return (
    <div 
      className={`guest-experience min-h-screen bg-gradient-to-br ${theme.gradients.hero}`}
      style={{ ['--theme-vars' as any]: themeCSS } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Event Icon */}
            <div className="text-6xl mb-3">{theme.icon}</div>
            
            <h1 
              className={`text-3xl md:text-4xl ${theme.fonts.heading} font-bold mb-2`}
              style={{ color: theme.colors.text }}
            >
              {event.event_name}
            </h1>
            
            <p style={{ color: theme.colors.textLight }} className="text-lg">
              {new Date(event.event_date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Welcome Message */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white/90 backdrop-blur-sm ${theme.borderRadius} ${theme.shadows.card} p-8 text-center border-2`}
          style={{ borderColor: theme.colors.accent }}
        >
          <h2 
            className={`text-2xl md:text-3xl ${theme.fonts.heading} font-bold mb-4`}
            style={{ color: theme.colors.text }}
          >
            {event.welcome_title}
          </h2>
          <p 
            className="text-lg"
            style={{ color: theme.colors.textLight }}
          >
            {event.welcome_subtitle}
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center mb-8"
        >
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-8 py-3 ${theme.borderRadius} font-semibold transition-all ${theme.shadows.button} ${
              activeTab === 'upload'
                ? `bg-gradient-to-r ${theme.gradients.button} text-white`
                : 'bg-white border-2'
            }`}
            style={activeTab !== 'upload' ? { 
              borderColor: theme.colors.accent,
              color: theme.colors.text 
            } : {}}
          >
            📸 Fotoğraf Yükle
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-8 py-3 ${theme.borderRadius} font-semibold transition-all ${theme.shadows.button} ${
              activeTab === 'gallery'
                ? `bg-gradient-to-r ${theme.gradients.button} text-white`
                : 'bg-white border-2'
            }`}
            style={activeTab !== 'gallery' ? { 
              borderColor: theme.colors.accent,
              color: theme.colors.text 
            } : {}}
          >
            🎨 Galeri
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'upload' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' ? (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/50 ${theme.borderRadius} p-6 mb-6 text-center border-2`}
                style={{ borderColor: theme.colors.accent }}
              >
                <h2 
                  className={`text-2xl ${theme.fonts.heading} font-bold mb-2`}
                  style={{ color: theme.colors.text }}
                >
                  ✨ {event.upload_instructions}
                </h2>
              </motion.div>
              
              <UploadFormNew 
                eventId={event.id} 
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          ) : (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 
                  className={`text-3xl ${theme.fonts.heading} font-bold mb-2`}
                  style={{ color: theme.colors.text }}
                >
                  🎨 Etkinlik Galerisi
                </h2>
                <p style={{ color: theme.colors.textLight }}>
                  Tüm misafirlerin paylaştığı anılar
                </p>
              </motion.div>
              
              <GalleryNew eventId={event.id} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8" style={{ backgroundColor: theme.colors.text }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className={`w-8 h-8 ${theme.borderRadius} flex items-center justify-center`}
              style={{ background: `linear-gradient(to br, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-white">Özel Anlar</span>
          </div>
          <p className="text-white/70 text-sm">
            {event.thank_you_message}
          </p>
          <p className="text-white/50 text-xs mt-4">
            &copy; 2026 - Tüm hakları saklıdır
          </p>
        </div>
      </footer>
    </div>
  )
}

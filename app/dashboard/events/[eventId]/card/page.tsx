'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function EventCardPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Mock data (gerçek uygulamada API'den gelecek)
  useEffect(() => {
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setEvent({
        id: eventId,
        event_name: 'Ayşe & Mehmet Düğünü',
        event_type: 'Düğün',
        event_date: '2026-06-15',
        slug: 'ayse-mehmet-dugunu-2026'
      })
      setLoading(false)
    }, 500)
  }, [eventId])

  // Misafir linki
  const guestUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/e/${event?.slug || eventId}`
    : ''

  // Link kopyala
  const copyLink = () => {
    navigator.clipboard.writeText(guestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // WhatsApp paylaş
  const shareWhatsApp = () => {
    const message = `🎉 ${event?.event_name} etkinliğine davetlisiniz!\n\nFotoğraf ve videolarınızı paylaşmak için:\n${guestUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  // QR Kod indir
  const downloadQR = () => {
    alert('QR kod indirme özelliği yakında eklenecek!')
  }

  if (loading) {
    return (
      <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-sage-50 to-peach-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-peach-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-earth-700 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-sage-50 to-peach-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-earth-700 mb-4">Etkinlik bulunamadı</p>
          <Link href="/dashboard" className="text-peach-600 hover:underline">
            Dashboard'a Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-sage-50 to-peach-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-sage-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-peach-400 to-sage-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-earth-800">Özel Anlar</span>
            </Link>
            <Link href="/dashboard" className="text-earth-700 hover:text-peach-600 transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Etkinliğiniz Başarıyla Oluşturuldu!
          </h2>
          <p className="text-green-700">
            Artık misafirlerinizle paylaşabilirsiniz
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Event Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-earth-800 mb-4">
              📱 Dijital Etkinlik Kartınız
            </h3>
            
            {/* Card */}
            <div className="editorial-card-preview bg-gradient-to-br from-peach-100 to-sage-100 rounded-3xl shadow-2xl p-8 border-2 border-sage-200">
              {/* Event Icon */}
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">
                  {event.event_type === 'Düğün' && '💍'}
                  {event.event_type === 'Doğum Günü' && '🎂'}
                  {event.event_type === 'Nişan' && '💎'}
                  {event.event_type === 'Kına' && '🎨'}
                  {event.event_type === 'Sünnet' && '🎉'}
                </div>
                <h2 className="text-3xl font-serif font-bold text-earth-800 mb-2">
                  {event.event_name}
                </h2>
                <p className="text-lg text-earth-600">
                  {new Date(event.event_date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm text-gray-600">QR Kod</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white/80 rounded-2xl p-4 text-center">
                <p className="text-sm text-earth-700 font-medium">
                  📸 Fotoğraf ve videolarınızı paylaşmak için QR kodu okutun
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Share Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-earth-800">
              🚀 Paylaşım Seçenekleri
            </h3>

            {/* Link Share */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sage-100">
              <h4 className="font-bold text-earth-800 mb-3 flex items-center gap-2">
                🔗 Etkinlik Linki
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guestUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-sage-50 border-2 border-sage-200 rounded-xl text-earth-700 text-sm"
                />
                <button
                  onClick={copyLink}
                  className="px-6 py-3 bg-gradient-to-r from-peach-400 to-sage-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

            {/* WhatsApp Share */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sage-100">
              <h4 className="font-bold text-earth-800 mb-3 flex items-center gap-2">
                💬 WhatsApp ile Paylaş
              </h4>
              <p className="text-sm text-earth-600 mb-4">
                Misafirlerinize WhatsApp üzerinden davetiye gönderin
              </p>
              <button
                onClick={shareWhatsApp}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp'ta Paylaş
              </button>
            </div>

            {/* QR Code Download */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sage-100">
              <h4 className="font-bold text-earth-800 mb-3 flex items-center gap-2">
                📥 QR Kod İndir
              </h4>
              <p className="text-sm text-earth-600 mb-4">
                QR kodu indirip davetiyelerinize ekleyebilirsiniz
              </p>
              <button
                onClick={downloadQR}
                className="w-full py-3 bg-earth-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                QR Kodu İndir (PNG)
              </button>
            </div>

            {/* Preview Link */}
            <div className="bg-gradient-to-r from-peach-400 to-sage-400 rounded-2xl shadow-xl p-6 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                👀 Misafir Görünümü
              </h4>
              <p className="text-sm text-white/90 mb-4">
                Misafirlerinizin göreceği sayfayı önizleyin
              </p>
              <Link
                href={`/e/${event.slug || eventId}`}
                target="_blank"
                className="block w-full py-3 bg-white text-earth-700 rounded-xl font-semibold text-center hover:shadow-lg transition-all"
              >
                Önizlemeyi Aç →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/dashboard/events"
            className="px-8 py-4 bg-white text-earth-700 rounded-xl font-semibold border-2 border-sage-200 hover:shadow-lg transition-all text-center"
          >
            📋 Tüm Etkinliklerim
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-peach-400 to-sage-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
          >
            ➕ Yeni Etkinlik Oluştur
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

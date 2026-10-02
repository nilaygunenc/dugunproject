'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

const packageThemes: { [key: string]: { gradient: string; emoji: string; name: string } } = {
  'dugun': { gradient: 'from-earth-800 to-sage-700', emoji: '💍', name: 'Düğün' },
  'dogum-gunu': { gradient: 'from-earth-800 to-sage-700', emoji: '🎂', name: 'Doğum Günü' },
  'nisan': { gradient: 'from-earth-800 to-sage-700', emoji: '💐', name: 'Nişan' },
  'kina': { gradient: 'from-earth-800 to-sage-700', emoji: '🌺', name: 'Kına' },
  'sunnet': { gradient: 'from-earth-800 to-sage-700', emoji: '🎈', name: 'Sünnet' },
  'diger': { gradient: 'from-earth-800 to-sage-700', emoji: '🎉', name: 'Diğer' }
}

function CreateEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageType = searchParams.get('type') || 'diger'
  const theme = packageThemes[packageType] || packageThemes['diger']

  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [eventUrl, setEventUrl] = useState('')
  const [eventSlug, setEventSlug] = useState('')
  const [eventId, setEventId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    welcomeTitle: '',
    welcomeSubtitle: '',
    uploadInstructions: 'Lütfen fotoğraf ve videolarınızı yükleyin!',
    thankYouMessage: 'Anılarınızı bizimle paylaştığınız için teşekkür ederiz! ❤️'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          eventName: formData.eventName,
          eventType: theme.name,
          eventDate: formData.eventDate,
          packageType: packageType,
          welcomeTitle: formData.welcomeTitle || formData.eventName,
          welcomeSubtitle: formData.welcomeSubtitle,
          uploadInstructions: formData.uploadInstructions,
          thankYouMessage: formData.thankYouMessage
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Etkinlik oluşturulamadı')
      }

      const fullUrl = `${window.location.origin}${data.data.url}`
      setEventUrl(fullUrl)
      setEventSlug(data.data.slug)
      setEventId(data.data.id)
      setShowQR(true)

    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `${formData.eventName}-qr-kod.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const shareWhatsApp = () => {
    const text = `${formData.welcomeTitle || formData.eventName} etkinliğine davetlisiniz! Fotoğraf ve videolarınızı buradan paylaşabilirsiniz: ${eventUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(eventUrl)
    alert('Link kopyalandı!')
  }

  if (showQR) {
    return (
      <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-white to-sage-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-sage-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-peach-400 to-sage-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-2xl font-bold text-earth-800">Özel Anlar</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-sage-100"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{theme.emoji}</div>
              <h1 className="text-4xl font-bold text-earth-800 mb-2">
                🎉 Etkinlik Oluşturuldu!
              </h1>
              <p className="text-xl text-earth-600">
                QR kodunuzu misafirlerinizle paylaşın
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-sage-50 to-peach-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-earth-800 mb-4 text-lg">📋 Etkinlik Bilgileri</h3>
                  <div className="space-y-3 text-earth-700">
                    <p><strong>Etkinlik:</strong> {formData.eventName}</p>
                    <p><strong>Tür:</strong> {theme.name}</p>
                    <p><strong>Tarih:</strong> {new Date(formData.eventDate).toLocaleDateString('tr-TR')}</p>
                    <p><strong>Başlık:</strong> {formData.welcomeTitle || formData.eventName}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={copyLink}
                    className="w-full py-3 bg-earth-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    📋 Linki Kopyala
                  </button>
                  <button
                    onClick={shareWhatsApp}
                    className="w-full py-3 bg-sage-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp'ta Paylaş
                  </button>
                  <button
                    onClick={downloadQR}
                    className="w-full py-3 bg-peach-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    📥 QR Kodu İndir
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-sage-200">
                  <QRCodeSVG
                    id="qr-code"
                    value={eventUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-earth-600 mt-4 text-center max-w-xs">
                  Misafirleriniz bu QR kodu okutarak etkinlik sayfanıza ulaşabilir
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>🔗 Etkinlik Linki:</strong>
                <br />
                <a href={eventUrl} target="_blank" className="text-blue-600 hover:underline break-all">
                  {eventUrl}
                </a>
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href={`/dashboard/events/${eventId}/edit`}
                className="flex-1 py-3 bg-gradient-to-r from-peach-400 to-sage-400 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all"
              >
                ✏️ Etkinliği Düzenle
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 py-3 border-2 border-sage-300 text-earth-700 rounded-xl font-semibold text-center hover:border-peach-400 transition-all"
              >
                🏠 Dashboard'a Dön
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-white to-sage-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-peach-400 to-sage-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-earth-800">Özel Anlar</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className={`inline-block p-6 bg-gradient-to-br ${theme.gradient} rounded-3xl mb-4`}>
              <span className="text-6xl">{theme.emoji}</span>
            </div>
            <h1 className="text-4xl font-bold text-earth-800 mb-2">
              {theme.name} Etkinliği Oluştur
            </h1>
            <p className="text-xl text-earth-600">
              Etkinliğinizi özelleştirin ve misafirlerinizle paylaşın
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-sage-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Etkinlik Adı *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  placeholder="Örn: Ahmet ve Ayşe'nin Düğünü"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Etkinlik Tarihi *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Karşılama Başlığı
                </label>
                <input
                  type="text"
                  value={formData.welcomeTitle}
                  onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  placeholder="Örn: Düğünümüze Hoşgeldiniz!"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Karşılama Mesajı
                </label>
                <textarea
                  value={formData.welcomeSubtitle}
                  onChange={(e) => setFormData({ ...formData, welcomeSubtitle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  rows={3}
                  placeholder="Örn: Anılarımızı bizimle paylaşın, bu özel günü birlikte ölümsüzleştirelim!"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Yükleme Talimatları
                </label>
                <textarea
                  value={formData.uploadInstructions}
                  onChange={(e) => setFormData({ ...formData, uploadInstructions: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  rows={2}
                  placeholder="Misafirlerinize yükleme talimatları"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 mb-2">
                  Teşekkür Mesajı
                </label>
                <textarea
                  value={formData.thankYouMessage}
                  onChange={(e) => setFormData({ ...formData, thankYouMessage: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                  rows={2}
                  placeholder="Yükleme sonrası gösterilecek teşekkür mesajı"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-peach-400 to-sage-400 text-white rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Oluşturuluyor...
                    </span>
                  ) : (
                    '🎉 Etkinliği Oluştur ve QR Kod Al'
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-4 border-2 border-sage-300 text-earth-700 rounded-xl font-semibold hover:border-peach-400 transition-all"
                >
                  İptal
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={
      <div className="admin-subpage min-h-screen bg-gradient-to-br from-cream via-white to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-peach-400 mx-auto mb-4"></div>
          <p className="text-earth-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <CreateEventForm />
    </Suspense>
  )
}

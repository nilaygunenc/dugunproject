'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getTheme, THEMES, type EventType } from '@/lib/themes'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: 'wedding' as EventType,
    event_date: '',
    welcome_title: '',
    welcome_subtitle: '',
    upload_instructions: '',
    thank_you_message: '',
  })

  // Mock data yükleme
  useEffect(() => {
    setTimeout(() => {
      setFormData({
        event_name: 'Ayşe & Mehmet',
        event_type: 'wedding',
        event_date: '2026-06-15',
        welcome_title: 'Düğünümüze Hoş Geldiniz! 💍',
        welcome_subtitle: 'Bu özel günü bizimle paylaştığınız için teşekkür ederiz.',
        upload_instructions: 'Fotoğraf ve videolarınızı yükleyerek bu özel günün bir parçası olun.',
        thank_you_message: 'Paylaşımlarınız için teşekkürler! ❤️',
      })
      setLoading(false)
    }, 500)
  }, [eventId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Değişiklikler kaydedildi! ✅')
      router.push(`/dashboard/events/${eventId}/card`)
    } catch (error) {
      alert('Kaydetme hatası!')
    } finally {
      setSaving(false)
    }
  }

  // Seçili temayı al
  const theme = getTheme(formData.event_type)

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-earth-800 mb-2">
            ⚙️ Etkinlik Ayarları
          </h1>
          <p className="text-earth-600">
            Misafirlerinizin göreceği içeriği özelleştirin
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Etkinlik Adı */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sage-100">
                <h3 className="text-xl font-bold text-earth-800 mb-4">
                  📝 Temel Bilgiler
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Etkinlik Adı
                    </label>
                    <input
                      type="text"
                      value={formData.event_name}
                      onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                      placeholder="Örn: Ayşe & Mehmet"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Etkinlik Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Etkinlik Türü (Tema)
                    </label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value as EventType })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                    >
                      {Object.values(THEMES).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.icon} {t.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-earth-500 mt-1">
                      Tema, misafir sayfasının renklerini ve stilini belirler
                    </p>
                  </div>
                </div>
              </div>

              {/* Özelleştirilebilir Metinler */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sage-100">
                <h3 className="text-xl font-bold text-earth-800 mb-4">
                  ✍️ Özel Mesajlar
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Hoş Geldiniz Başlığı
                    </label>
                    <input
                      type="text"
                      value={formData.welcome_title}
                      onChange={(e) => setFormData({ ...formData, welcome_title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                      placeholder="Örn: Düğünümüze Hoş Geldiniz!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Hoş Geldiniz Alt Yazısı
                    </label>
                    <textarea
                      value={formData.welcome_subtitle}
                      onChange={(e) => setFormData({ ...formData, welcome_subtitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all resize-none"
                      rows={3}
                      placeholder="Örn: Bu özel günü bizimle paylaştığınız için teşekkür ederiz."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Yükleme Talimatları
                    </label>
                    <textarea
                      value={formData.upload_instructions}
                      onChange={(e) => setFormData({ ...formData, upload_instructions: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all resize-none"
                      rows={2}
                      placeholder="Örn: Fotoğraflarınızı yükleyerek anıları paylaşın"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Teşekkür Mesajı
                    </label>
                    <input
                      type="text"
                      value={formData.thank_you_message}
                      onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-sage-300 rounded-xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all"
                      placeholder="Örn: Paylaşımlarınız için teşekkürler!"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-gradient-to-r from-peach-400 to-sage-400 text-white rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? '💾 Kaydediliyor...' : '✅ Değişiklikleri Kaydet'}
                </button>
                <Link
                  href={`/dashboard/events/${eventId}/card`}
                  className="px-8 py-4 bg-white text-earth-700 rounded-xl font-semibold border-2 border-sage-200 hover:shadow-lg transition-all text-center"
                >
                  İptal
                </Link>
              </div>
            </form>
          </motion.div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-24"
          >
            <h3 className="text-xl font-bold text-earth-800 mb-4">
              👀 Canlı Önizleme
            </h3>
            
            {/* Preview Card */}
            <div 
              className={`bg-gradient-to-br ${theme.gradients.hero} ${theme.borderRadius} ${theme.shadows.card} p-8 border-2`}
              style={{ borderColor: theme.colors.accent }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{theme.icon}</div>
                <h2 
                  className={`text-3xl ${theme.fonts.heading} font-bold mb-2`}
                  style={{ color: theme.colors.text }}
                >
                  {formData.event_name || 'Etkinlik Adı'}
                </h2>
                <p style={{ color: theme.colors.textLight }}>
                  {formData.event_date 
                    ? new Date(formData.event_date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Tarih seçilmedi'
                  }
                </p>
              </div>

              {/* Welcome Message */}
              <div 
                className={`bg-white/90 ${theme.borderRadius} p-6 mb-6`}
              >
                <h3 
                  className={`text-xl ${theme.fonts.heading} font-bold mb-2`}
                  style={{ color: theme.colors.text }}
                >
                  {formData.welcome_title || 'Hoş Geldiniz Başlığı'}
                </h3>
                <p style={{ color: theme.colors.textLight }}>
                  {formData.welcome_subtitle || 'Hoş geldiniz alt yazısı buraya gelecek...'}
                </p>
              </div>

              {/* Upload Instructions */}
              <div 
                className={`bg-white/70 ${theme.borderRadius} p-4 mb-6 text-center`}
              >
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {formData.upload_instructions || 'Yükleme talimatları...'}
                </p>
              </div>

              {/* Theme Info */}
              <div className="text-center">
                <p className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>
                  Seçili Tema: {theme.name}
                </p>
                <div className="flex gap-2 justify-center">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                </div>
              </div>
            </div>

            {/* Preview Link */}
            <Link
              href={`/e/test-preview`}
              target="_blank"
              className="block mt-4 px-6 py-3 bg-white text-earth-700 rounded-xl font-semibold text-center border-2 border-sage-200 hover:shadow-lg transition-all"
            >
              🔍 Tam Ekran Önizleme
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

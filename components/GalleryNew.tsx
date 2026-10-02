'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MediaPost } from '@/lib/models'

interface GalleryProps {
  eventId?: number
}

export default function GalleryNew({ eventId = 1 }: GalleryProps) {
  const [media, setMedia] = useState<MediaPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<MediaPost | null>(null)

  // Medyaları yükle
  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/upload?eventId=${eventId}`)
      const data = await response.json()
      
      if (data.success) {
        setMedia(data.data)
      }
    } catch (error) {
      console.error('Medya yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
    
    // Her 10 saniyede bir yenile (real-time benzeri)
    const interval = setInterval(fetchMedia, 10000)
    return () => clearInterval(interval)
  }, [eventId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-peach-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-2xl font-serif text-earth-700 mb-2">
          Henüz fotoğraf yok
        </h3>
        <p className="text-earth-500">
          İlk fotoğrafı paylaşan siz olun!
        </p>
      </motion.div>
    )
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {media.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setSelectedImage(item)}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-sage-100 hover:border-peach-300 transition-all hover:shadow-2xl">
              {/* Fotoğraf */}
              <div className="relative overflow-hidden">
                <img
                  src={item.media_url}
                  alt={`${item.guest_name} tarafından paylaşıldı`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Bilgiler */}
              <div className="p-4 space-y-2">
                {/* İsim */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-peach-400 to-sage-400 flex items-center justify-center text-white font-bold text-sm">
                    {item.guest_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-earth-800">
                    {item.guest_name}
                  </span>
                </div>

                {/* Mesaj */}
                {item.message && (
                  <p className="text-sm text-earth-600 italic line-clamp-3">
                    "{item.message}"
                  </p>
                )}

                {/* Tarih */}
                <p className="text-xs text-earth-400">
                  {new Date(item.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Fotoğraf */}
              <div className="relative">
                <img
                  src={selectedImage.media_url}
                  alt={`${selectedImage.guest_name} tarafından paylaşıldı`}
                  className="w-full h-auto"
                />
                
                {/* Kapat Butonu */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-earth-800 hover:bg-white transition-all shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Detaylar */}
              <div className="p-6 space-y-4">
                {/* İsim */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-peach-400 to-sage-400 flex items-center justify-center text-white font-bold text-lg">
                    {selectedImage.guest_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-earth-800">
                      {selectedImage.guest_name}
                    </h3>
                    <p className="text-sm text-earth-500">
                      {new Date(selectedImage.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Mesaj */}
                {selectedImage.message && (
                  <div className="bg-sage-50 rounded-2xl p-4 border-l-4 border-peach-400">
                    <p className="text-earth-700 italic">
                      "{selectedImage.message}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

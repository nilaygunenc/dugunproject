'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { compressImage, formatFileSize } from '@/lib/imageCompression'

interface UploadFormProps {
  eventId?: number
  onUploadSuccess?: () => void
}

export default function UploadFormNew({ eventId = 1, onUploadSuccess }: UploadFormProps) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setOriginalSize(file.size)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !name.trim()) {
      alert('Lütfen isminizi ve bir fotoğraf seçin')
      return
    }

    setCompressing(true)
    setProgress(0)

    try {
      // 1. Sıkıştır
      setProgress(20)
      const compressedFile = await compressImage(selectedFile, (prog) => {
        setProgress(20 + (prog * 0.3)) // 20-50%
      })
      setCompressedSize(compressedFile.size)
      
      setCompressing(false)
      setUploading(true)
      
      // 2. FormData oluştur
      setProgress(60)
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('eventId', eventId.toString())
      formData.append('guestName', name.trim())
      if (message.trim()) {
        formData.append('message', message.trim())
      }

      // 3. API'ye gönder
      setProgress(80)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Yükleme başarısız')
      }

      setProgress(100)
      
      // Form'u temizle
      setTimeout(() => {
        setName('')
        setMessage('')
        setSelectedFile(null)
        setPreviewUrl(null)
        setOriginalSize(0)
        setCompressedSize(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setProgress(0)
        
        // Callback
        onUploadSuccess?.()
      }, 1500)
      
      alert('Fotoğraf başarıyla yüklendi! 🎉')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setUploading(false)
      setCompressing(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto bg-gradient-to-br from-white/90 to-sage-50/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-sage-200"
    >
      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-3xl font-serif text-earth-800 mb-2">
          ✨ Anınızı Paylaşın
        </h2>
        <p className="text-sm text-earth-600">
          Güzel anılarınızı bizimle paylaşın
        </p>
      </motion.div>

      {/* İsim Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="name" className="block text-sm font-semibold text-earth-700 mb-2">
          İsminiz ✨
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-sage-300 rounded-2xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all bg-white/70 text-earth-800 font-medium placeholder:text-earth-400"
          placeholder="Adınız Soyadınız"
          required
          disabled={uploading || compressing}
        />
      </motion.div>

      {/* Mesaj Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="message" className="block text-sm font-semibold text-earth-700 mb-2">
          Mesajınız 💌 <span className="text-earth-500 font-normal">(İsteğe bağlı)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          className="w-full px-4 py-3 border-2 border-sage-300 rounded-2xl focus:ring-2 focus:ring-peach-400 focus:border-peach-400 transition-all bg-white/70 resize-none text-earth-800 placeholder:text-earth-400"
          placeholder="Güzel dileklerinizi paylaşın..."
          rows={3}
          disabled={uploading || compressing}
        />
        <p className="text-xs text-earth-500 mt-1">
          {200 - message.length} karakter kaldı
        </p>
      </motion.div>

      {/* Dosya Seçimi */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-semibold text-earth-700 mb-2">
          Fotoğraf Seçin 📸
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full text-sm text-earth-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-peach-200 file:to-sage-200 file:text-earth-700 hover:file:from-peach-300 hover:file:to-sage-300 file:cursor-pointer cursor-pointer file:transition-all"
          required
          disabled={uploading || compressing}
        />
      </motion.div>

      {/* Önizleme */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-2xl overflow-hidden shadow-xl border-2 border-sage-200"
          >
            <img
              src={previewUrl}
              alt="Önizleme"
              className="w-full h-64 object-cover"
            />
            
            {/* Dosya Boyutu Bilgisi */}
            {!compressing && !uploading && originalSize > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              >
                <div className="flex justify-between text-white text-xs">
                  <span>Orijinal: <strong>{formatFileSize(originalSize)}</strong></span>
                  {compressedSize > 0 && (
                    <span className="text-green-300">
                      Sıkıştırılmış: <strong>{formatFileSize(compressedSize)}</strong>
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Sıkıştırma/Yükleme Overlay */}
            {(compressing || uploading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-earth-900/80 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <div className="text-white text-lg font-bold mb-2">
                  {compressing ? '🔄 Optimize Ediliyor...' : '📤 Yükleniyor...'}
                </div>
                <div className="text-white text-3xl font-bold mb-4">
                  {Math.round(progress)}%
                </div>
                <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-peach-400 to-sage-400 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar (Dosya seçilmemişse) */}
      <AnimatePresence>
        {(uploading || compressing) && !previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm text-earth-700">
              <span>{compressing ? 'Optimize ediliyor...' : 'Yükleniyor...'}</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-sage-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-peach-400 via-sage-400 to-peach-500 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: uploading || compressing ? 1 : 1.02 }}
        whileTap={{ scale: uploading || compressing ? 1 : 0.98 }}
        type="submit"
        disabled={uploading || compressing}
        className="w-full bg-gradient-to-r from-peach-400 via-sage-400 to-peach-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {compressing ? '✨ Optimize Ediliyor...' : uploading ? '📤 Yükleniyor...' : '🎉 Fotoğrafı Paylaş'}
      </motion.button>

      {/* Bilgi Notu */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-center text-earth-500"
      >
        Fotoğraflarınız otomatik olarak optimize edilir ve güvenli bir şekilde saklanır.
      </motion.p>
    </motion.form>
  )
}

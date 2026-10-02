'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { compressImage, formatFileSize } from '@/lib/imageCompression'
import { uploadToFirebase } from '@/lib/firebaseStorage'
import { createPost } from '@/lib/firestore'

type Dict = any

type FileWithPreview = {
  file: File
  preview: string
  originalSize: number
  compressedSize?: number
}

export default function UploadForm({ dict, lang }: { dict: Dict; lang: Locale }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState<number[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length + files.length > 10) {
      setError(dict.upload.max_files)
      return
    }

    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    )

    if (validFiles.length !== selectedFiles.length) {
      setError(dict.upload.invalid_type)
    }

    // Create previews and store original sizes
    const filesWithPreviews: FileWithPreview[] = []
    
    for (const file of validFiles) {
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      filesWithPreviews.push({
        file,
        preview,
        originalSize: file.size,
      })
    }

    setFiles(prev => [...prev, ...filesWithPreviews])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError(dict.upload.name_required)
      return
    }

    if (files.length === 0) {
      setError('Lütfen en az bir dosya seçin')
      return
    }

    setError('')
    setCompressing(true)
    setCompressionProgress(new Array(files.length).fill(0))
    setUploadProgress(new Array(files.length).fill(0))

    try {
      // 1. ADIM: Sıkıştırma (İstemci Tarafı)
      console.log('🔄 ADIM 1: Görseller sıkıştırılıyor...')
      const compressedFiles: File[] = []
      
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i]
        
        const compressed = await compressImage(fileData.file, (progress) => {
          setCompressionProgress(prev => {
            const newProgress = [...prev]
            newProgress[i] = progress
            return newProgress
          })
        })

        compressedFiles.push(compressed)
        
        // Update compressed size
        setFiles(prev => {
          const updated = [...prev]
          updated[i] = { ...updated[i], compressedSize: compressed.size }
          return updated
        })
      }

      setCompressing(false)
      setUploading(true)

      // 2. ADIM: Firebase Storage'a Yükleme
      console.log('📤 ADIM 2: Firebase Storage\'a yükleniyor...')
      const mediaUrls: string[] = []
      const mediaTypes: string[] = []

      for (let i = 0; i < compressedFiles.length; i++) {
        const file = compressedFiles[i]
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const extension = file.name.split('.').pop()
        const path = `wedding-media/${timestamp}-${randomId}.${extension}`

        const downloadURL = await uploadToFirebase(file, path, (progress) => {
          setUploadProgress(prev => {
            const newProgress = [...prev]
            newProgress[i] = progress
            return newProgress
          })
        })

        mediaUrls.push(downloadURL)
        mediaTypes.push(file.type)
      }

      // 3. ADIM: Firestore'a Kayıt
      console.log('💾 ADIM 3: Firestore\'a kaydediliyor...')
      await createPost({
        guest_name: name,
        message: message || null,
        media_urls: mediaUrls,
        media_types: mediaTypes,
        likes: 0,
      })

      console.log('✅ Tüm işlemler başarıyla tamamlandı!')
      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setName('')
        setMessage('')
        setFiles([])
        setSuccess(false)
        setCompressionProgress([])
        setUploadProgress([])
      }, 3000)

    } catch (err) {
      console.error('❌ Hata:', err)
      setError(dict.upload.error_msg)
      setCompressing(false)
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-[#BBDEFB]">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#42A5F5] to-[#1976D2] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-[#0D47A1] mb-3">
          {dict.upload.success_title}
        </h2>
        <p className="text-[#1976D2] mb-6">
          {dict.upload.success_msg}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push(`/${lang}/gallery`)}
            className="px-6 py-3 bg-[#42A5F5] text-white rounded-xl font-semibold hover:bg-[#1976D2] transition-colors shadow-lg"
          >
            {dict.upload.success_gallery}
          </button>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-white text-[#42A5F5] border-2 border-[#BBDEFB] rounded-xl font-semibold hover:bg-[#E3F2FD] transition-colors"
          >
            {dict.upload.success_more}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-[#BBDEFB]">
      {/* Name Input */}
      <div>
        <label className="block text-sm font-semibold text-[#0D47A1] mb-2">
          {dict.upload.name_label} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.upload.name_placeholder}
          className="w-full px-4 py-3 border-2 border-[#BBDEFB] rounded-xl focus:border-[#42A5F5] focus:outline-none transition-colors text-[#0D47A1] font-medium"
          required
          disabled={compressing || uploading}
        />
      </div>

      {/* Message Input with Tooltip */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#0D47A1] mb-2">
          {dict.upload.message_label}
        </label>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 200))}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
            placeholder={dict.upload.message_placeholder}
            rows={4}
            className="w-full px-4 py-3 border-2 border-[#BBDEFB] rounded-xl focus:border-[#42A5F5] focus:outline-none transition-colors resize-none text-[#0D47A1]"
            disabled={compressing || uploading}
          />
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute left-0 -top-14 bg-[#1976D2] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
              Mesajınızı en fazla 200 karakterle sınırlayın
              <div className="absolute bottom-0 left-8 transform translate-y-1/2 rotate-45 w-2 h-2 bg-[#1976D2]"></div>
            </div>
          )}
        </div>
        <p className="text-sm text-[#42A5F5] mt-2 font-medium">
          {200 - message.length} {dict.upload.message_hint}
        </p>
      </div>

      {/* File Input */}
      <div>
        <label className="block text-sm font-semibold text-[#0D47A1] mb-2">
          {dict.upload.media_label}
        </label>
        <p className="text-sm text-[#1976D2] mb-3">
          {dict.upload.media_hint}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={compressing || uploading}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={compressing || uploading}
          className="w-full px-6 py-4 border-2 border-dashed border-[#42A5F5] rounded-xl text-[#42A5F5] hover:border-[#1976D2] hover:bg-[#E3F2FD] transition-all font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          {dict.upload.media_btn}
        </button>

        {/* File Previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {files.map((fileData, index) => (
              <div key={index} className="relative group">
                <img
                  src={fileData.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-[#BBDEFB]"
                />
                
                {/* Compression Progress */}
                {compressing && (
                  <div className="absolute inset-0 bg-[#0D47A1]/90 rounded-xl flex flex-col items-center justify-center p-2">
                    <div className="text-white text-xs font-bold mb-1">
                      🔄 Sıkıştırılıyor
                    </div>
                    <div className="text-white text-lg font-bold mb-2">
                      {compressionProgress[index]}%
                    </div>
                    <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#42A5F5] progress-shimmer transition-all duration-300"
                        style={{ width: `${compressionProgress[index]}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && !compressing && (
                  <div className="absolute inset-0 bg-[#1976D2]/90 rounded-xl flex flex-col items-center justify-center p-2">
                    <div className="text-white text-xs font-bold mb-1">
                      📤 Yükleniyor
                    </div>
                    <div className="text-white text-lg font-bold mb-2">
                      {uploadProgress[index]}%
                    </div>
                    <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#90CAF9] progress-shimmer transition-all duration-300"
                        style={{ width: `${uploadProgress[index]}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* File Size Info */}
                {!compressing && !uploading && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    <div className="flex justify-between">
                      <span>Orijinal:</span>
                      <span className="font-bold">{formatFileSize(fileData.originalSize)}</span>
                    </div>
                    {fileData.compressedSize && (
                      <div className="flex justify-between text-green-300">
                        <span>Sıkıştırılmış:</span>
                        <span className="font-bold">{formatFileSize(fileData.compressedSize)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Remove Button */}
                {!compressing && !uploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={compressing || uploading}
        className="w-full px-8 py-4 bg-[#42A5F5] text-white rounded-xl font-bold hover:bg-[#1976D2] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
      >
        {compressing ? '🔄 Sıkıştırılıyor...' : uploading ? '📤 Yükleniyor...' : dict.upload.submit}
      </button>

      {/* Progress Summary */}
      {(compressing || uploading) && (
        <div className="bg-[#E3F2FD] border-2 border-[#BBDEFB] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#42A5F5] border-t-transparent"></div>
            <span className="font-bold text-[#0D47A1]">
              {compressing ? 'Görseller optimize ediliyor...' : 'Firebase\'e yükleniyor...'}
            </span>
          </div>
          <p className="text-sm text-[#1976D2]">
            {files.length} dosya işleniyor. Lütfen bekleyin...
          </p>
        </div>
      )}
    </form>
  )
}

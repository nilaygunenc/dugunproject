import imageCompression from 'browser-image-compression'

/**
 * Agresif görsel sıkıştırma fonksiyonu
 * 5MB'lık bir fotoğrafı 200-300KB'a düşürür
 * 
 * @param file - Sıkıştırılacak dosya
 * @param onProgress - İlerleme callback'i (0-100)
 * @returns Sıkıştırılmış dosya
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  // Video dosyalarını sıkıştırma
  if (file.type.startsWith('video/')) {
    return file
  }

  // Sadece görsel dosyalarını sıkıştır
  if (!file.type.startsWith('image/')) {
    return file
  }

  try {
    const options = {
      maxSizeMB: 0.3, // Maksimum 300KB (0.3MB)
      maxWidthOrHeight: 1920, // Maksimum genişlik/yükseklik
      useWebWorker: true, // Web Worker kullanarak performans artışı
      fileType: 'image/jpeg', // JPEG formatına çevir (en iyi sıkıştırma)
      initialQuality: 0.8, // Başlangıç kalitesi
      alwaysKeepResolution: false, // Çözünürlüğü düşürebilir
      onProgress: (progress: number) => {
        if (onProgress) {
          onProgress(Math.round(progress))
        }
      },
    }

    console.log(`🔄 Sıkıştırma başlıyor: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

    const compressedFile = await imageCompression(file, options)

    console.log(`✅ Sıkıştırma tamamlandı: ${compressedFile.name} (${(compressedFile.size / 1024).toFixed(2)} KB)`)
    console.log(`📊 Sıkıştırma oranı: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)

    return compressedFile
  } catch (error) {
    console.error('❌ Sıkıştırma hatası:', error)
    throw new Error('Görsel sıkıştırma başarısız oldu')
  }
}

/**
 * Birden fazla dosyayı sıkıştır
 * 
 * @param files - Sıkıştırılacak dosyalar
 * @param onProgress - Her dosya için ilerleme callback'i
 * @returns Sıkıştırılmış dosyalar
 */
export async function compressMultipleImages(
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<File[]> {
  const compressedFiles: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    const compressed = await compressImage(file, (progress) => {
      if (onProgress) {
        onProgress(i, progress)
      }
    })

    compressedFiles.push(compressed)
  }

  return compressedFiles
}

/**
 * Dosya boyutunu okunabilir formata çevir
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

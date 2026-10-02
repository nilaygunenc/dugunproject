import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Firebase Storage'a dosya yükle
 * 
 * @param file - Yüklenecek dosya
 * @param path - Storage'daki yol (örn: 'wedding-media/image.jpg')
 * @param onProgress - İlerleme callback'i (0-100)
 * @returns Download URL
 */
export async function uploadToFirebase(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // 1 yıl cache
    })

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(Math.round(progress))
        }
        console.log(`📤 Yükleme: ${Math.round(progress)}%`)
      },
      (error) => {
        console.error('❌ Yükleme hatası:', error)
        reject(error)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('✅ Yükleme tamamlandı:', downloadURL)
          resolve(downloadURL)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

/**
 * Birden fazla dosyayı Firebase'e yükle
 * 
 * @param files - Yüklenecek dosyalar
 * @param onProgress - Her dosya için ilerleme callback'i
 * @returns Download URL'leri
 */
export async function uploadMultipleToFirebase(
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const path = `wedding-media/${timestamp}-${randomId}.${extension}`

    return uploadToFirebase(file, path, (progress) => {
      if (onProgress) {
        onProgress(index, progress)
      }
    })
  })

  return Promise.all(uploadPromises)
}

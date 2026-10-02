import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { createMediaPost, findOrCreateGuest } from '@/lib/models'

// Maksimum dosya boyutu (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// İzin verilen dosya tipleri
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Form verilerini al
    const file = formData.get('file') as File
    const eventId = formData.get('eventId') as string
    const guestName = formData.get('guestName') as string
    const message = formData.get('message') as string | null

    // Validasyon
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    if (!eventId || !guestName) {
      return NextResponse.json(
        { error: 'Etkinlik ID ve misafir adı gerekli' },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir.' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Dosya çok büyük. Maksimum 10MB yüklenebilir.' },
        { status: 400 }
      )
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload klasörünü oluştur (yoksa)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}-${randomString}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Dosyayı kaydet
    await writeFile(filePath, buffer)

    // Veritabanına kaydet
    const eventIdNum = parseInt(eventId)
    
    // Misafiri bul veya oluştur
    const guest = await findOrCreateGuest(eventIdNum, guestName)
    
    // Medya kaydı oluştur
    const mediaUrl = `/uploads/${fileName}`
    const mediaPost = await createMediaPost(
      eventIdNum,
      guest.id,
      mediaUrl,
      message || undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        id: mediaPost.id,
        url: mediaUrl,
        guestName: guest.full_name,
        message: mediaPost.message,
        createdAt: mediaPost.created_at
      }
    })

  } catch (error) {
    console.error('❌ Upload hatası:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// GET endpoint - Etkinliğe ait medyaları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Etkinlik ID gerekli' },
        { status: 400 }
      )
    }

    const { getMediaByEvent } = await import('@/lib/models')
    const media = await getMediaByEvent(parseInt(eventId))

    return NextResponse.json({
      success: true,
      data: media
    })

  } catch (error) {
    console.error('❌ Medya getirme hatası:', error)
    return NextResponse.json(
      { error: 'Medya getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

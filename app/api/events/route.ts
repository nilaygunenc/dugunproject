import { NextRequest, NextResponse } from 'next/server'
import { createEvent, getAllEvents, getEventById, deleteEvent, getEventStats } from '@/lib/models'

// Tüm etkinlikleri getir veya yeni etkinlik oluştur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')

    if (eventId) {
      // Tek etkinlik getir
      const event = await getEventById(parseInt(eventId))
      
      if (!event) {
        return NextResponse.json(
          { error: 'Etkinlik bulunamadı' },
          { status: 404 }
        )
      }

      // İstatistikleri de ekle
      const stats = await getEventStats(parseInt(eventId))

      return NextResponse.json({
        success: true,
        data: { ...event, ...stats }
      })
    }

    // Tüm etkinlikleri getir
    const events = await getAllEvents()
    
    return NextResponse.json({
      success: true,
      data: events
    })

  } catch (error) {
    console.error('❌ Etkinlik getirme hatası:', error)
    return NextResponse.json(
      { error: 'Etkinlikler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Yeni etkinlik oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, eventName, eventType, eventDate, slug, packageType } = body

    // Validasyon
    if (!userId || !eventName || !eventType || !eventDate || !slug) {
      return NextResponse.json(
        { error: 'Kullanıcı ID, etkinlik adı, tipi, tarihi ve slug gerekli' },
        { status: 400 }
      )
    }

    // Etkinlik tiplerini kontrol et
    const validTypes = ['Düğün', 'Doğum Günü', 'Nişan', 'Kına', 'Sünnet', 'Diğer']
    if (!validTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Geçersiz etkinlik tipi' },
        { status: 400 }
      )
    }

    const event = await createEvent(
      userId,
      eventName,
      eventType,
      new Date(eventDate),
      slug,
      packageType || 'basic'
    )

    return NextResponse.json({
      success: true,
      data: event
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Etkinlik oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Etkinlik oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Etkinlik sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Etkinlik ID gerekli' },
        { status: 400 }
      )
    }

    await deleteEvent(parseInt(eventId))

    return NextResponse.json({
      success: true,
      message: 'Etkinlik silindi'
    })

  } catch (error) {
    console.error('❌ Etkinlik silme hatası:', error)
    return NextResponse.json(
      { error: 'Etkinlik silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

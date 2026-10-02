import { NextRequest, NextResponse } from 'next/server'
import { createEvent } from '@/lib/models'

function generateSlug(eventName: string, eventType: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  }
  
  let slug = eventName.toLowerCase()
  Object.keys(turkishMap).forEach(key => {
    slug = slug.replace(new RegExp(key, 'g'), turkishMap[key])
  })
  
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  const typeSlug = eventType.toLowerCase().replace(/\s+/g, '-')
  const timestamp = Date.now().toString().slice(-6)
  
  return `${slug}-${typeSlug}-${timestamp}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      eventName, 
      eventType, 
      eventDate,
      packageType,
      welcomeTitle,
      welcomeSubtitle,
      uploadInstructions,
      thankYouMessage
    } = body

    if (!userId || !eventName || !eventType || !eventDate) {
      return NextResponse.json(
        { error: 'Kullanıcı ID, etkinlik adı, tipi ve tarihi gereklidir' },
        { status: 400 }
      )
    }

    const slug = generateSlug(eventName, eventType)

    const event = await createEvent(
      userId,
      eventName,
      eventType,
      new Date(eventDate),
      slug,
      packageType || 'basic'
    )

    if (welcomeTitle || welcomeSubtitle || uploadInstructions || thankYouMessage) {
      const { query } = await import('@/lib/database')
      await query(
        `UPDATE events 
         SET welcome_title = $1, 
             welcome_subtitle = $2, 
             upload_instructions = $3, 
             thank_you_message = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [
          welcomeTitle || null,
          welcomeSubtitle || null,
          uploadInstructions || null,
          thankYouMessage || null,
          event.id
        ]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Etkinlik başarıyla oluşturuldu',
      data: {
        id: event.id,
        slug: event.slug,
        eventName: event.event_name,
        eventType: event.event_type,
        eventDate: event.event_date,
        url: `/e/${event.slug}`
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Etkinlik oluşturma hatası:', error)
    return NextResponse.json(
      { 
        error: 'Etkinlik oluşturulurken bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      eventId,
      eventName,
      eventDate,
      welcomeTitle,
      welcomeSubtitle,
      uploadInstructions,
      thankYouMessage
    } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Etkinlik ID gereklidir' },
        { status: 400 }
      )
    }

    const updateFields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (eventName !== undefined) {
      updateFields.push(`event_name = $${paramIndex}`)
      values.push(eventName)
      paramIndex++
    }

    if (eventDate !== undefined) {
      updateFields.push(`event_date = $${paramIndex}`)
      values.push(new Date(eventDate))
      paramIndex++
    }

    if (welcomeTitle !== undefined) {
      updateFields.push(`welcome_title = $${paramIndex}`)
      values.push(welcomeTitle)
      paramIndex++
    }

    if (welcomeSubtitle !== undefined) {
      updateFields.push(`welcome_subtitle = $${paramIndex}`)
      values.push(welcomeSubtitle)
      paramIndex++
    }

    if (uploadInstructions !== undefined) {
      updateFields.push(`upload_instructions = $${paramIndex}`)
      values.push(uploadInstructions)
      paramIndex++
    }

    if (thankYouMessage !== undefined) {
      updateFields.push(`thank_you_message = $${paramIndex}`)
      values.push(thankYouMessage)
      paramIndex++
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    if (updateFields.length === 1) {
      return NextResponse.json(
        { error: 'Güncellenecek alan bulunamadı' },
        { status: 400 }
      )
    }

    values.push(eventId)

    const result = await query(
      `UPDATE events 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Etkinlik bulunamadı' },
        { status: 404 }
      )
    }

    const updatedEvent = result.rows[0]

    return NextResponse.json({
      success: true,
      message: 'Etkinlik başarıyla güncellendi',
      data: {
        id: updatedEvent.id,
        slug: updatedEvent.slug,
        eventName: updatedEvent.event_name,
        eventType: updatedEvent.event_type,
        eventDate: updatedEvent.event_date,
        welcomeTitle: updatedEvent.welcome_title,
        welcomeSubtitle: updatedEvent.welcome_subtitle,
        uploadInstructions: updatedEvent.upload_instructions,
        thankYouMessage: updatedEvent.thank_you_message,
        url: `/e/${updatedEvent.slug}`
      }
    })

  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'Etkinlik güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

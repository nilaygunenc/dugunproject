import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    // Bağlantı testi
    const result = await pool.query('SELECT NOW() as current_time, current_database() as database_name')
    
    // Tabloları kontrol et
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    return NextResponse.json({
      success: true,
      message: '✅ Veritabanı bağlantısı başarılı!',
      data: {
        currentTime: result.rows[0].current_time,
        databaseName: result.rows[0].database_name,
        tables: tables.rows.map(t => t.table_name),
        tableCount: tables.rows.length
      }
    })
  } catch (error: any) {
    console.error('❌ Veritabanı bağlantı hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı başarısız',
      details: error.message,
      hint: 'Lütfen .env.local dosyasındaki şifrenizi kontrol edin'
    }, { status: 500 })
  }
}

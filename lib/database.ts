import { Pool, PoolClient } from 'pg'

// PostgreSQL bağlantı havuzu
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'etkinlik_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maksimum bağlantı sayısı
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Bağlantı testi
pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlanıldı')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL bağlantı hatası:', err)
})

// Query fonksiyonu
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('🔍 Query çalıştırıldı:', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Query hatası:', error)
    throw error
  }
}

// Transaction için client alma
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect()
  return client
}

// Veritabanı bağlantısını kapat
export const closePool = async () => {
  await pool.end()
  console.log('🔌 PostgreSQL bağlantı havuzu kapatıldı')
}

export default pool

import { query, getClient } from './database'

// ==================== TİPLER ====================

export interface User {
  id: number
  full_name: string
  email: string
  password_hash: string
  role: string
  created_at: Date
}

export interface Event {
  id: number
  user_id: number
  event_name: string
  event_type: string // 'Düğün', 'Doğum Günü', 'Nişan', 'Kına', 'Sünnet'
  event_date: Date
  slug: string
  package_type: string
  created_at: Date
}

export interface Guest {
  id: number
  event_id: number
  full_name: string
  created_at: Date
}

export interface MediaPost {
  id: number
  event_id: number
  guest_id: number
  message: string | null
  media_url: string
  created_at: Date
  guest_name?: string // JOIN sonucu
}

// ==================== KULLANICI İŞLEMLERİ ====================

export const createUser = async (
  fullName: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [fullName, email, passwordHash]
  )
  return result.rows[0]
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] || null
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const result = await query('SELECT * FROM users WHERE id = $1', [userId])
  return result.rows[0] || null
}

// ==================== ETKİNLİK İŞLEMLERİ ====================

export const createEvent = async (
  userId: number,
  eventName: string,
  eventType: string,
  eventDate: Date,
  slug: string,
  packageType: string
): Promise<Event> => {
  const result = await query(
    `INSERT INTO events (user_id, event_name, event_type, event_date, slug, package_type) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [userId, eventName, eventType, eventDate, slug, packageType]
  )
  return result.rows[0]
}

export const getEventById = async (eventId: number): Promise<Event | null> => {
  const result = await query('SELECT * FROM events WHERE id = $1', [eventId])
  return result.rows[0] || null
}

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  const result = await query('SELECT * FROM events WHERE slug = $1', [slug])
  return result.rows[0] || null
}

export const getAllEvents = async (): Promise<Event[]> => {
  const result = await query('SELECT * FROM events ORDER BY event_date DESC')
  return result.rows
}

export const deleteEvent = async (eventId: number): Promise<void> => {
  await query('DELETE FROM events WHERE id = $1', [eventId])
}

// ==================== MİSAFİR İŞLEMLERİ ====================

export const createGuest = async (
  eventId: number,
  fullName: string
): Promise<Guest> => {
  const result = await query(
    `INSERT INTO guests (event_id, full_name) 
     VALUES ($1, $2) 
     RETURNING *`,
    [eventId, fullName]
  )
  return result.rows[0]
}

export const getGuestById = async (guestId: number): Promise<Guest | null> => {
  const result = await query('SELECT * FROM guests WHERE id = $1', [guestId])
  return result.rows[0] || null
}

export const getGuestsByEvent = async (eventId: number): Promise<Guest[]> => {
  const result = await query(
    'SELECT * FROM guests WHERE event_id = $1 ORDER BY created_at DESC',
    [eventId]
  )
  return result.rows
}

// Misafiri isimle bul veya oluştur
export const findOrCreateGuest = async (
  eventId: number,
  fullName: string
): Promise<Guest> => {
  // Önce var mı kontrol et
  const existing = await query(
    'SELECT * FROM guests WHERE event_id = $1 AND full_name = $2',
    [eventId, fullName]
  )
  
  if (existing.rows.length > 0) {
    return existing.rows[0]
  }
  
  // Yoksa oluştur
  return await createGuest(eventId, fullName)
}

// ==================== MEDYA İŞLEMLERİ ====================

export const createMediaPost = async (
  eventId: number,
  guestId: number,
  mediaUrl: string,
  message?: string
): Promise<MediaPost> => {
  const result = await query(
    `INSERT INTO media_posts (event_id, guest_id, media_url, message) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [eventId, guestId, mediaUrl, message || null]
  )
  return result.rows[0]
}

export const getMediaByEvent = async (eventId: number): Promise<MediaPost[]> => {
  const result = await query(
    `SELECT 
      mp.*,
      g.full_name as guest_name
     FROM media_posts mp
     JOIN guests g ON mp.guest_id = g.id
     WHERE mp.event_id = $1
     ORDER BY mp.created_at DESC`,
    [eventId]
  )
  return result.rows
}

export const getMediaById = async (mediaId: number): Promise<MediaPost | null> => {
  const result = await query(
    `SELECT 
      mp.*,
      g.full_name as guest_name
     FROM media_posts mp
     JOIN guests g ON mp.guest_id = g.id
     WHERE mp.id = $1`,
    [mediaId]
  )
  return result.rows[0] || null
}

export const deleteMediaPost = async (mediaId: number): Promise<void> => {
  await query('DELETE FROM media_posts WHERE id = $1', [mediaId])
}

// Etkinliğe ait tüm medyaları sil
export const deleteMediaByEvent = async (eventId: number): Promise<void> => {
  await query('DELETE FROM media_posts WHERE event_id = $1', [eventId])
}

// ==================== İSTATİSTİKLER ====================

export const getEventStats = async (eventId: number) => {
  const result = await query(
    `SELECT 
      COUNT(DISTINCT g.id) as guest_count,
      COUNT(mp.id) as media_count
     FROM events e
     LEFT JOIN guests g ON e.id = g.event_id
     LEFT JOIN media_posts mp ON e.id = mp.event_id
     WHERE e.id = $1
     GROUP BY e.id`,
    [eventId]
  )
  return result.rows[0] || { guest_count: 0, media_count: 0 }
}

-- ==========================================
-- EVENTS TABLOSUNU GÜNCELLE
-- pgAdmin'de etkinlik_platform veritabanında çalıştırın
-- ==========================================

-- Eksik kolonları ekle
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50);

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS welcome_title VARCHAR(255);

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS welcome_subtitle TEXT;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS upload_instructions TEXT;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS thank_you_message TEXT;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS custom_logo_url TEXT;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- İndeksleri ekle
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_posts(created_at DESC);

-- Kontrol et
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Başarı mesajı
SELECT '✅ Events tablosu güncellendi!' as sonuc;

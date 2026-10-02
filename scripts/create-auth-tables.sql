-- ==========================================
-- ETKİNLİK.IO - AUTH TABLOLARI
-- pgAdmin'de çalıştırın
-- ==========================================

-- 1. Önce etkinlik_platform veritabanına bağlanın
-- 2. Bu script'i çalıştırın

-- ==================== KULLANICILAR TABLOSU ====================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'event_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email için index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==================== ETKİNLİKLER TABLOSU ====================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    
    -- Özelleştirilebilir İçerik
    welcome_title VARCHAR(255),
    welcome_subtitle TEXT,
    upload_instructions TEXT,
    thank_you_message TEXT,
    
    -- Tema ve Görsel Ayarlar
    custom_logo_url TEXT,
    background_image_url TEXT,
    
    -- Durum
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- ==================== MİSAFİRLER TABLOSU ====================
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);

-- ==================== MEDYA VE MESAJLAR TABLOSU ====================
CREATE TABLE IF NOT EXISTS media_posts (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    message VARCHAR(255),
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_posts(created_at DESC);

-- ==================== TEST VERİSİ (Opsiyonel) ====================
-- Test kullanıcısı eklemek isterseniz aşağıdaki satırları çalıştırın
-- Şifre: 123456

-- INSERT INTO users (full_name, email, password_hash, role) 
-- VALUES (
--     'Test Kullanıcı',
--     'test@etkinlik.io',
--     '$2a$10$YourHashedPasswordHere',
--     'event_owner'
-- );

-- ==================== KONTROL ====================
-- Tabloları kontrol et
SELECT 'users' as tablo, COUNT(*) as kayit_sayisi FROM users
UNION ALL
SELECT 'events' as tablo, COUNT(*) as kayit_sayisi FROM events
UNION ALL
SELECT 'guests' as tablo, COUNT(*) as kayit_sayisi FROM guests
UNION ALL
SELECT 'media_posts' as tablo, COUNT(*) as kayit_sayisi FROM media_posts;

-- Başarı mesajı
SELECT '✅ Tüm tablolar başarıyla oluşturuldu!' as sonuc;

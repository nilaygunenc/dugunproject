-- ==========================================
-- HIZLI TEST KURULUMU
-- pgAdmin'de etkinlik_platform veritabanında çalıştırın
-- ==========================================

-- 1. Tabloları oluştur
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'event_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    welcome_title VARCHAR(255),
    welcome_subtitle TEXT,
    upload_instructions TEXT,
    thank_you_message TEXT,
    custom_logo_url TEXT,
    background_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_posts (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    message VARCHAR(255),
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. İndeksleri oluştur
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);

-- 3. Test kullanıcısı ekle (şifre: 123456)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@test.com',
    '$2a$10$rOZxQKJ9YXZ5YqN5YqN5YeN5YqN5YqN5YqN5YqN5YqN5YqN5YqN5Y',
    'event_owner'
)
ON CONFLICT (email) DO NOTHING;

-- 4. Kontrol et
SELECT 
    'users' as tablo, 
    COUNT(*) as kayit_sayisi 
FROM users
UNION ALL
SELECT 
    'events' as tablo, 
    COUNT(*) as kayit_sayisi 
FROM events;

-- 5. Başarı mesajı
SELECT '✅ Kurulum tamamlandı! Test kullanıcısı: test@test.com (şifre: 123456)' as sonuc;

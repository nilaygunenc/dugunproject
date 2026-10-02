# 🔍 VERİTABANI KONTROL REHBERİ

## Adım 1: pgAdmin'i Açın

1. pgAdmin 4'ü başlatın
2. PostgreSQL sunucunuza bağlanın (şifre: **1414**)

## Adım 2: Veritabanını Kontrol Edin

Sol panelde **Databases** altında `etkinlik_platform` var mı kontrol edin.

### Yoksa Oluşturun:

1. **Databases** üzerine sağ tıklayın
2. **Create** > **Database** seçin
3. **Database** alanına: `etkinlik_platform` yazın
4. **Save** butonuna tıklayın

## Adım 3: Tabloları Kontrol Edin

1. **etkinlik_platform** veritabanına sağ tıklayın
2. **Query Tool** seçin
3. Şu komutu çalıştırın:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Görmemiz Gereken Tablolar:
- ✅ users
- ✅ events
- ✅ guests
- ✅ media_posts

## Adım 4: Tablolar Yoksa Oluşturun

Query Tool'da şu komutları çalıştırın:

```sql
-- USERS TABLOSU
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'event_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- EVENTS TABLOSU
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

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- GUESTS TABLOSU
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);

-- MEDIA_POSTS TABLOSU
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
```

## Adım 5: Test Kullanıcısı Oluşturun

```sql
-- Test kullanıcısı (şifre: 123456)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@test.com',
    '$2a$10$YourHashedPasswordHere',
    'event_owner'
)
ON CONFLICT (email) DO NOTHING;
```

## Adım 6: Kontrol Edin

```sql
-- Tablo sayılarını kontrol et
SELECT 'users' as tablo, COUNT(*) as kayit_sayisi FROM users
UNION ALL
SELECT 'events' as tablo, COUNT(*) as kayit_sayisi FROM events
UNION ALL
SELECT 'guests' as tablo, COUNT(*) as kayit_sayisi FROM guests
UNION ALL
SELECT 'media_posts' as tablo, COUNT(*) as kayit_sayisi FROM media_posts;
```

## Adım 7: Veritabanı Bağlantısını Test Edin

Tarayıcıda:
```
http://localhost:3000/api/test-db
```

Başarılı mesajı görmelisiniz!

## 🐛 Hata Mesajları

### "relation does not exist"
- Tablolar oluşturulmamış
- Yukarıdaki CREATE TABLE komutlarını çalıştırın

### "database does not exist"
- Veritabanı oluşturulmamış
- `CREATE DATABASE etkinlik_platform;` komutunu çalıştırın

### "password authentication failed"
- `.env.local` dosyasındaki şifre yanlış
- Şifrenizi kontrol edin (şu an: 1414)

## ✅ Başarılı Kurulum Kontrolü

Şu komutu çalıştırın:
```sql
SELECT 
    t.table_name,
    COUNT(c.column_name) as column_count
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
GROUP BY t.table_name
ORDER BY t.table_name;
```

Şunu görmelisiniz:
```
users         - 6 columns
events        - 16 columns
guests        - 3 columns
media_posts   - 5 columns
```

---

**Tüm adımları tamamladıktan sonra etkinlik oluşturmayı tekrar deneyin!**

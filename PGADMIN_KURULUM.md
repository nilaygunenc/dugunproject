# 🔧 pgAdmin'de Veritabanı Kurulumu

## Adım 1: pgAdmin'i Açın

1. pgAdmin 4'ü başlatın
2. PostgreSQL sunucunuza bağlanın (şifre: **1414**)

## Adım 2: Veritabanını Oluşturun

### Yöntem 1: GUI ile

1. Sol panelde **Servers** > **PostgreSQL** > **Databases** üzerine sağ tıklayın
2. **Create** > **Database** seçin
3. **Database** alanına: `etkinlik_platform` yazın
4. **Save** butonuna tıklayın

### Yöntem 2: SQL ile

1. Sol panelde **PostgreSQL** üzerine sağ tıklayın
2. **Query Tool** seçin
3. Şu komutu çalıştırın:

```sql
CREATE DATABASE etkinlik_platform;
```

## Adım 3: Tabloları Oluşturun

1. Sol panelde **Databases** > **etkinlik_platform** üzerine sağ tıklayın
2. **Query Tool** seçin
3. `scripts/create-auth-tables.sql` dosyasını açın
4. Tüm içeriği kopyalayın
5. Query Tool'a yapıştırın
6. **Execute/Run** butonuna tıklayın (F5 tuşu)

## Adım 4: Tabloları Kontrol Edin

Query Tool'da şu komutu çalıştırın:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Şu tabloları görmelisiniz:
- ✅ users
- ✅ events
- ✅ guests
- ✅ media_posts

## Adım 5: Test Kullanıcısı Oluşturun (Opsiyonel)

Hızlı test için bir kullanıcı oluşturun:

```sql
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@etkinlik.io',
    '$2a$10$rOZxQKJ9YXZ5YqN5YqN5YeN5YqN5YqN5YqN5YqN5YqN5YqN5YqN5Y',
    'event_owner'
);
```

**Test Giriş Bilgileri:**
- E-posta: `test@etkinlik.io`
- Şifre: `123456`

## Adım 6: Veritabanı Bağlantısını Test Edin

Tarayıcıda şu adresi açın:

```
http://localhost:3000/api/test-db
```

Başarılı mesajı görmelisiniz!

## 🎯 Özet Komutlar

Tüm işlemleri tek seferde yapmak için:

```sql
-- 1. Veritabanını oluştur
CREATE DATABASE etkinlik_platform;

-- 2. Veritabanına bağlan (pgAdmin'de etkinlik_platform'u seçin)

-- 3. Tabloları oluştur
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

-- 4. İndeksleri oluştur
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_posts(created_at DESC);

-- 5. Kontrol et
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## ✅ Tamamlandı!

Artık giriş yap ve üye ol özellikleri çalışmaya hazır!

Test etmek için:
1. http://localhost:3000/register - Yeni hesap oluşturun
2. http://localhost:3000/login - Giriş yapın
3. http://localhost:3000/dashboard - Dashboard'a erişin

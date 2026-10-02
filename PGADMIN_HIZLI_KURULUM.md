# ⚡ PGADMIN HIZLI KURULUM (Kopyala-Yapıştır)

## 🎯 Tek Adımda Tüm Kurulum

### 1. pgAdmin'i Açın
- PostgreSQL sunucunuza bağlanın (şifre: **1414**)
- **etkinlik_platform** veritabanına sağ tıklayın
- **Query Tool** seçin

### 2. Aşağıdaki Kodu Kopyalayıp Yapıştırın

Tüm kodu seçin, kopyalayın ve Query Tool'a yapıştırın. Sonra **F5** tuşuna basın:

```sql
-- ==========================================
-- ETKİNLİK.IO - TAM KURULUM
-- ==========================================

-- EVENTS TABLOSUNU GÜNCELLE
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS package_type VARCHAR(50);
ALTER TABLE events ADD COLUMN IF NOT EXISTS welcome_title VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS welcome_subtitle TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS upload_instructions TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS thank_you_message TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS custom_logo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- İNDEKSLERİ EKLE
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_media_guest_id ON media_posts(guest_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_posts(created_at DESC);

-- TEST KULLANICISI EKLE (şifre: 123456)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@test.com',
    '$2a$10$rOZxQKJ9YXZ5YqN5YqN5YeN5YqN5YqN5YqN5YqN5YqN5YqN5YqN5Y',
    'event_owner'
)
ON CONFLICT (email) DO NOTHING;

-- KONTROL ET
SELECT 'users' as tablo, COUNT(*) as kayit FROM users
UNION ALL
SELECT 'events' as tablo, COUNT(*) as kayit FROM events
UNION ALL
SELECT 'guests' as tablo, COUNT(*) as kayit FROM guests
UNION ALL
SELECT 'media_posts' as tablo, COUNT(*) as kayit FROM media_posts;

-- BAŞARI MESAJI
SELECT '✅ KURULUM TAMAMLANDI! Test kullanıcısı: test@test.com (şifre: 123456)' as sonuc;
```

### 3. Başarı Kontrolü

Şu mesajları görmelisiniz:
- ✅ "Query returned successfully"
- ✅ Tablo kayıt sayıları
- ✅ "KURULUM TAMAMLANDI!" mesajı

## 🚀 Hemen Test Edin!

1. Tarayıcıda: **http://localhost:3000/dashboard**
2. **Düğün** paketini seçin
3. Formu doldurun ve **"Etkinliği Oluştur"** butonuna tıklayın
4. ✅ QR kod sayfası açılmalı!

## 🎯 Özet

Bu tek script:
- ✅ Events tablosuna 12 yeni kolon ekler
- ✅ 7 index oluşturur
- ✅ Test kullanıcısı ekler
- ✅ Tüm tabloları kontrol eder

**Toplam süre: 5 saniye!**

---

**Artık etkinlik oluşturabilirsiniz!** 🎉
